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
    ) {}

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response, @Body() dto: CreateUserDto) {
    console.log('herererer');
    const user = await this.devService.createDevAcc(res, dto);
    res.send(user);
  }

  @Get('login/:id')
  login() {

  }
  
  @Get('dummy')
  createDummy() {
  }
  
  @Delete('dummy')
  deleteDummy() {
  }


}
