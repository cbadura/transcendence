import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { DevService } from './dev.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}

  @Post('register')
  register(@Res() res: Response, @Body() dto: CreateUserDto) {
    const user = this.userService.createUser(dto);
    // const token = this.authService.jwtIssueToken(user);
    
    res.send(user);
  }

  @Get('login/:id')
  login() {

  }
  
  @Get('dummy')
  createDummy() {
    this.userService.createDummyUsers();
  }
  
  @Delete('dummy')
  deleteDummy() {
    this.userService.deleteUserDatabase();
  }


}
