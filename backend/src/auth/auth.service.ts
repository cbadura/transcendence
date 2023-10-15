import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  
  constructor(
    /*@InjectRepository(User) private userRepo: Repository<User>,*/
    private readonly userService: UserService) {}

  async validateUser(userId: number) {
    // const user = await this.userRepo.findOne({where: {id}})
    const user: User = await this.userService.getUser(userId);
    if (user) return user;
    const newUser = new CreateUserDto;
    newUser.name = "test";
    return this.userService.createUser(newUser);
  }

  createUser() {
    
  }

  findUser(userId: number) {
    
  }
}