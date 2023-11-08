import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Match } from 'src/entities/match.entity';
import { MatchUser } from 'src/entities/match-user.entity';
import { Relationship } from 'src/entities/relationship.entity';
import { Socket } from 'socket.io';
import { EUserStatus } from '../network-game/interfaces/IGameSocketUser';
import { UserStatusUpdateDto } from './dto/user-status-update.dto';
import { EUserMessages, ISocketUserStatus } from './user.interface';
import { UserDataUpdateDto } from './dto/user-data-update.dto';
import { promises as fsPromises } from 'fs';
import { verifyJwtFromHandshake } from 'src/auth/cookie.jwtverify';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(MatchUser) private matchUserRepository: Repository<MatchUser>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(Relationship) private relationshipRepository: Repository<Relationship>,
    private readonly entityManager: EntityManager,
    // private readonly authService: AuthService
  ) {}

  // ~~~~~~~
  private clients: ISocketUserStatus[] = [];

  private getUserIdFromSocket(socket: Socket): number {
    const user: ISocketUserStatus = this.clients.find(
      (client) => client.socket.id === socket.id,
    );
    return user?.userId;
  }
  
  private createList(): UserStatusUpdateDto[] {
    let listUsers: UserStatusUpdateDto[] = [];
    listUsers = this.clients.map((user) => {
      const upd = new UserStatusUpdateDto();
      upd.userId = user.userId;
      upd.status = user.status;
      return upd;
    });
    return listUsers;
  }
  
  async handleConnection(socket: Socket) {
    
    // temporary solution, check token from cookie and verify it after connection
    // need to make a middleware to validate cookie/token before connection
    // const userId = await this.authService.verifyJwtFromHandshake(socket.handshake);
    const userId = await verifyJwtFromHandshake(socket.handshake);
    if (!userId) {
      socket.emit('exception', 'Invalid token');
      socket.disconnect(true);
      return ;
    }
    
    if (isNaN(userId)) {
      socket.emit('exception', 'Invalid user id');
      socket.disconnect(true);
      return;
    }
    // TODO  remove this check ^
    //  add validation of token and extraction user id from it
    if ((await this.getUser(userId)) == undefined) {
      socket.emit('exception', "User doesn't exist"); // remove this exception and just disconnect (?)
      socket.disconnect(true);
      return;
    }
    const client: ISocketUserStatus = {
      socket,
      userId: userId,
      status: EUserStatus.ONLINE
    };
    const statusUpdate: UserStatusUpdateDto = {
      userId,
      status: EUserStatus.ONLINE,
    };
    const isOnline: boolean = !!this.clients.find(
      (client) => client.userId === userId,
    );
    this.clients.push(client);
    if (!isOnline) {
      this.clients.forEach((client) => {
        client.socket.emit(EUserMessages.STATUS_UPDATE, statusUpdate);
      });
    }
  }

  handleDisconnect(client: Socket) {
    const statusUpdate: UserStatusUpdateDto = {
      userId: this.getUserIdFromSocket(client),
      status: EUserStatus.OFFLINE,
    };
    if (statusUpdate.userId === undefined) return ;
    const clientSockets: ISocketUserStatus[] = this.clients.filter(
      (client) => client.userId === statusUpdate.userId,
    );
    if (clientSockets.length === 1)
      this.clients.forEach((client) => {
        client.socket.emit(EUserMessages.STATUS_UPDATE, statusUpdate);
      });
    this.clients = this.clients.filter(
      (currentClient) => currentClient.socket.id !== client.id,
    );
  }

  listUserStatuses (client: Socket){
    client.emit(
        EUserMessages.LIST_USER_STATUSES,
        this.createList(),
    );
  }

  notifyUserStatusUpdate(userId: number, status: EUserStatus) {
    this.clients.forEach((client) => {
      if (client.userId === userId)
        client.status = status;
    });
    const statusUpdate: UserStatusUpdateDto = {
      userId,
      status,
    };
    this.clients.forEach((client) => {
      client.socket.emit(EUserMessages.STATUS_UPDATE, statusUpdate);
    });
  }

  notifyUserDataUpdate(userId: number, dto: UpdateUserDto) {
    const upd: UserDataUpdateDto = {
      userId,
      ...dto,
    };
    this.clients.forEach((client) => {
      client.socket.emit(EUserMessages.USER_UPDATE, upd);
    });
  }
  // ~~~~~~~~
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: number): Promise<User | undefined>{
    return await this.userRepository.findOne(
      { where: { id },
      relations: ['achievements','achievements.achievementDefinition'],
   });
  }

  async getUserFromftid(ftid: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {ftid},
      relations: ['achievements','achievements.achievementDefinition'],
    });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    if (id === 0) { // temp fix until dev specific endpoint
      return this.createUser({
        ftid: null,
        name: dto.name,
        color: dto.color,
        avatar: `http://localhost:3000/users/profilepic/default_0${Math.floor(Math.random() * 100 % 5)}.jpg`,
        tfa: false,
        level:1.00,
        matches: 0,
        wins: 0
      })
    }
    const currUser = await this.userRepository.findOne({ where: { id }});
    if(dto.avatar != null && currUser != null){
      await this.deleteExistingImage(currUser);
    }
    // console.log(currUser);
    this.userRepository.merge(currUser, dto);
    // console.log(currUser);
    const updatedUser = await this.userRepository.save(currUser);
    this.notifyUserDataUpdate(id, dto);
    return updatedUser;
  }

  createUser(dtoUserCreator: CreateUserDto): Promise<User> {
    console.log(dtoUserCreator);
    if(dtoUserCreator.avatar == null)
      dtoUserCreator.avatar = `http://localhost:3000/users/profilepic/default_0${Math.floor(Math.random() * 100 % 5)}.jpg`
    const newUser:CreateUserDto = {
      ...dtoUserCreator,
      tfa: false,
      color: '#E7C9FF',
      level:1.00,
      matches: 0,
      wins: 0
    };
    return this.userRepository.save(newUser);
  }


  async deleteUser(id: number){
    const DeletedUser = await this.userRepository.findOne({where: {id}})
    await this.userRepository.remove(DeletedUser);

    return DeletedUser;
  }

  private async deleteExistingImage(user: User){
    if(!user.avatar.includes('http://localhost:3000/users/profilepic/default_0')){
        const filePath = this.createImageFilePath(user.avatar)
        try {
          await fsPromises.unlink(filePath); 
          console.log(`Deleted file: ${filePath}`);
      } catch (error) {
          if (error.code === 'ENOENT') {
              console.error(`File not found: ${filePath}`);
          } else {
              console.error(`Error deleting file: ${error.message}`);
          }
      }
    }
  }

  private createImageFilePath(url:string):string {
    const lastIndex = url.lastIndexOf('/');
    const fileName = url.slice(lastIndex + 1);
    const pathIndex = __dirname.lastIndexOf('backend')
    const path = __dirname.slice(0,pathIndex);
    const filePath = path + 'backend/uploadedData/profilepictures/'+ fileName;
    return filePath;
  }

  async createDummyUsers() {
    const colors: string[] = ['#E7C9FF','#C9FFE5','#C9CBFF','#FFC9C9','#FFFDC9','#C9FFFC'];
    try{

      for(let i: number = 0 ; i < 100 ;i++){
        let user = new CreateUserDto;
        user.name = 'DummyUser_' + Math.floor(100000 + Math.random() * 900000).toString();
        user.avatar = `http://localhost:3000/users/profilepic/default_0${Math.floor(Math.random() * 100 % 5)}.jpg`;
        user.color = colors[Math.floor(100000 + Math.random() * 900000) % 6];
        user.level = Number(((100000 + Math.random() * 10000) % 100).toFixed(2)); 
        user.matches = Math.floor(100000 + Math.random() * 900000) % 500;
        user.wins = Math.floor(user.matches * Math.random());
        user.tfa = false;
        const newUser = await this.userRepository.save(user);
        // const newUser = await this.createUser(user);
        await this.updateUser(newUser.id, {ftid: newUser.id});
      }
    } catch(error){ 
      console.log(error);
    }
  }
 
  async deleteUserDatabase(){
    // const users = await this.userRepository.find();
    // for (const user of users) {
    //   await this.achievementRepo.delete({ userId: user.id});
    //   await this.userRepository.delete(user.id);
    // }
    await this.userRepository.createQueryBuilder().delete().from(User).execute();
    const query = `ALTER SEQUENCE User_id_seq RESTART WITH 1;`;
    await this.entityManager.query(query);
  }

  async getUserMatches(id: number): Promise<Match[]> {
    const user = await this.userRepository.findOne({where: {id: id}})
    if (!user)
      throw new NotFoundException('User doesnt exist');
    // console.log(user);
    const matchUsers = await this.matchUserRepository.find({where:{user: {id: user.id}},
      relations: ['match','match.matchUsers',"match.matchUsers.user"], 
    })
    const matchesParticipated = matchUsers.map((matchUser)=> matchUser.match);
    return matchesParticipated;
  }

  async getUserRelationships(id: number,filter: string): Promise<Relationship[]> {

    const query = this.relationshipRepository.createQueryBuilder('relationship')
    .where('relationship.primary_user_id = :id', { id });

    //will filter results if a filter was given
    if (filter === 'friend' || filter === 'blocked') {
      query.andWhere(`relationship.relationship_status = :filter`, { filter });
    }

    return query.getMany();
  }

  async validateRelationshipFromUser(user_id: number,other_user_id: number, relationType: string): Promise<boolean> {
    const relations = await this.getUserRelationships(user_id,relationType);
    const uniqueRelationship = relations.find(relation => relation.relational_user_id ==other_user_id)
    if(uniqueRelationship == null)
      return false;
    return true;
  }


  validateFileExtension() {
    
  }

}
