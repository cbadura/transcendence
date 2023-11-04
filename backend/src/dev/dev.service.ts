import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DevService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

async createDevAcc(@Res() res: Response, dto: CreateUserDto) {
  const user = await this.userService.createUser(dto);
  await this.authService.jwtIssueToken(user, res);
  return user
}

}
