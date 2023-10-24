import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { verifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User, verified: boolean) {
    const payload = {
      verified: verified,
      id: user.id,
      ftid: user.ftid
    };
    return {
      verified: verified,
      access_token: this.jwtService.sign(payload)
    }
  }

  async ftValidateUser(ftid: number, username: string, avatar: string) {
    // const user: User = await this.userRepo.findOne({where: {ftid: id}});
    const user: User = await this.userService.getUserFromftid(ftid);
    if (user) return user;
    const newUser = new CreateUserDto;
    newUser.name = username;
    newUser.ftid = ftid;
    newUser.avatar = avatar;
    return this.userService.createUser(newUser);
  }

  async jwtIssueToken(user: any) {
    if (user.tfa === true)
      return this.generateToken(user, false);
    if (user.tfa === false)
      return this.generateToken(user, true);
  }

  findUser(ftid: number): Promise<User | undefined> {
    return this.userRepo.findOne({where: {ftid} });
  }
}
