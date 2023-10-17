import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, ftAuthGuard } from './auth.guard';

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
  @UseGuards(AuthenticatedGuard)
  status() {
    return 'okok';
  }

  @Get('logout')
  logout() {}
}
