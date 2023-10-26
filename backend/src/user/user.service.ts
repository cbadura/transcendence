import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Match } from 'src/entities/match.entity';
import { MatchUser } from 'src/entities/match-user.entity';
import { Relationship } from 'src/entities/relationship.entity';
import { Socket } from 'socket.io';
import { ISocketUser } from '../chat/chat.interfaces';
import { EUserStatus } from '../network-game/interfaces/IGameSocketUser';
import { UserStatusUpdateDto } from './dto/user-status-update.dto';
import { EUserMessages } from './user.interface';
import { WsException } from '@nestjs/websockets';
import { UserDataUpdateDto } from './dto/user-data-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(MatchUser) private matchUserRepository: Repository<MatchUser>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(Relationship) private relationshipRepository: Repository<Relationship>,
  ) {}

  // ~~~~~~~
  private clients: ISocketUser[] = [];

  private getUserIdFromSocket(socket: Socket): number {
    const user: ISocketUser = this.clients.find(
      (client) => client.socket.id === socket.id,
    );
    if (!user) throw new WsException('Unexpected error');
    return user.userId;
  }
  async handleConnection(socket: Socket, userId: number) {
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
    const client: ISocketUser = {
      socket,
      userId: userId,
    };
    const statusUpdate: UserStatusUpdateDto = {
      userId,
      status: EUserStatus.ONLINE,
    };
    const isOnline: boolean = !!this.clients.find(
      (client) => client.userId === userId,
    );
    this.clients.push(client);
    if (!isOnline)
      this.clients.forEach((client) => {
        client.socket.emit(EUserMessages.STATUS_UPDATE, statusUpdate);
      });
  }
  handleDisconnect(client: Socket) {
    const statusUpdate: UserStatusUpdateDto = {
      userId: this.getUserIdFromSocket(client),
      status: EUserStatus.OFFLINE,
    };
    const clientSockets: ISocketUser[] = this.clients.filter(
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

  notifyUserStatusUpdate(userId: number, status: EUserStatus) {
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
    const currUser = await this.userRepository.findOne({ where: { id }});
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
    const newUser:CreateUserDto = {...dtoUserCreator, level:1.00,matches: 0, wins: 0};
    return this.userRepository.save(newUser);
  }


  async deleteUser(id: number){
    const DeletedUser = await this.userRepository.findOne({where: {id}})
    await this.userRepository.remove(DeletedUser);

    return DeletedUser;
  }

  async createDummyUsers() {
    const colors: string[] = ['#E7C9FF','#C9FFE5','#C9CBFF','#FFC9C9','#FFFDC9','#C9FFFC'];
    try{

      for(let i: number = 0 ; i < 100 ;i++){
        let user = new CreateUserDto;
        user.name = 'DummyUser_' + Math.floor(100000 + Math.random() * 900000).toString();
        user.color = colors[Math.floor(100000 + Math.random() * 900000) % 6];
        user.level = Number(((100000 + Math.random() * 10000) % 100).toFixed(2)); 
        user.matches = Math.floor(100000 + Math.random() * 900000) % 500;
        user.wins = Math.floor(user.matches * Math.random());
        await this.userRepository.save(user);
      }
    } catch(error){
      console.log(error);
    }
  }

  async deleteUserDatabase(){
    await this.userRepository.clear();
  }


  async getUserMatches(id: number): Promise<Match[]> {
    const user = await this.userRepository.findOne({where: {id: id}})
    // console.log(user);
    const matchUsers = await this.matchUserRepository.find({where:{user: {id: user.id}},
      relations: ['match','match.matchUsers',"match.matchUsers.user"], //might be cost intensive?
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

}
