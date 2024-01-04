import { Injectable, MethodNotAllowedException, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { cookieConfig } from 'src/auth/cookie.config';
import { Achievement } from 'src/entities/achievement.entity';
import { SecretBox } from 'src/entities/secretBox.entity';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class DevService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Achievement) private achievementRepo: Repository<Achievement>,
    @InjectRepository(SecretBox) private boxRepo: Repository<SecretBox>,
  ) {}


  async getUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async createDevAcc(@Res() res: Response, dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    await this.authService.jwtIssueToken(user, res);
    return user
  }

  async devLogin(@Res() res: Response, id: number) {
    const user = await this.userService.getUser(id);
    if (!user)
      throw new NotFoundException(`User ${id} not found`);
    if (user.ftid)
      throw new UnauthorizedException('Logging in 42 user profile not allowed');
    return await this.authService.jwtIssueToken(user, res);
  }

  async absDevLogin(@Res() res: Response, id: number) {
    const user = await this.userService.getUser(id);
    if (!user)
      throw new NotFoundException(`User ${id} not found`);
    if (user.ftid)
      throw new UnauthorizedException('Logging in 42 user profile not allowed');
    const token: string = this.jwtService.sign({
        verified: true,
        id: user.id
      });
    res.cookie('token', token, cookieConfig);
    return { verified: true };
  }

  async createDummyUsers() {
    const colors: string[] = ['#E7C9FF','#C9FFE5','#C9CBFF','#FFC9C9','#FFFDC9','#C9FFFC'];
    try{
      for(let i: number = 0; i < 100; i++){
        let user = new CreateUserDto;
        user.name = 'DummyUser_' + Math.floor(100000 + Math.random() * 900000).toString();
        user.avatar = `http://${process.env.HOST_NAME}:3000/users/profilepic/default_0${Math.floor(Math.random() * 100 % 5)}.jpg`;
        user.color = colors[Math.floor(100000 + Math.random() * 900000) % 6];
        user.level = Number(((100000 + Math.random() * 10000) % 100).toFixed(2)); 
        user.matches = Math.floor(100000 + Math.random() * 900000) % 500;
        user.wins = Math.floor(user.matches * Math.random());
        user.tfa = false;
        const newUser = await this.userRepo.save(user);
        // const newUser = await this.createUser(user);
        // await this.userService.updateUser(newUser.id, {ftid: newUser.id});
      }
    } catch(error) { 
      console.log(error);
    }
  }

  async deleteOne(id: number) {
    const user = await this.userRepo.findOne({where: {id}});
    if (!user)
      throw new NotFoundException();
    if (user.ftid)
      throw new MethodNotAllowedException('Removing 42 user is not allowed')
    await this.userRepo.remove(user);
    return (user);
  }

  async deleteAllUsers() {
    // const users = await this.userRepo.find();
    // for (const user of users) {
    //   await this.achievementRepo.delete({ id: user.id});
    //   await this.userRepo.delete(user.id);
    // }
    await this.userRepo.createQueryBuilder().delete().from(User).execute();
    const query = `ALTER SEQUENCE User_id_seq RESTART WITH 1;`;
    await this.entityManager.query(query);
  }

  async getBoxes(): Promise<SecretBox[] | null> {
    return await this.boxRepo.find();
  }

  async getBox(id: number) {
    return await this.boxRepo.findOne({where: { id }});
  }

  async burnOneSecret(id: number): Promise<SecretBox | null> {
    const user: User = await this.userService.getUser(id);
    if (!user) return null;
    user.tfa = false;
    const box: SecretBox = await this.boxRepo.findOne({where: { id }});
    return await this.boxRepo.remove(box);
  }

  async burnAllSecret() {
    return await this.boxRepo.clear();
  }
}
