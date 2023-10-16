import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ftAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

  @Get('login')
  @UseGuards(ftAuthGuard)
  login() {}

  @Get('redirect')
  @UseGuards(ftAuthGuard)
  redirect(@Res() res: Response) {
    res.status(200).send('hi');    
  }

  @Get('status')
  status() {}

  @Get('logout')
  logout() {}
}
