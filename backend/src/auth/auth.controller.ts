import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, ftAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('session')
  session() {
    return this.authService.getSession();
  }
}
