import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userService: UserService) {}

  async validateUser({id, username}) {
    const user: User = await this.userRepo.findOne({where: {ftid: id}})
    // const user: User = await this.userService.getUser(userId);
    if (user) return user;
    const newUser = new CreateUserDto;
    newUser.name = username;
    newUser.ftid = id;
    return this.userService.createUser(newUser);
  }

  createUser() {
    
  }

  findUser(ftid: number): Promise<User | undefined> {
    return this.userRepo.findOne({ where:{ftid} });
  }
}