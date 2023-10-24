import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ftAuthGuard } from './guard/ft.guard';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(ftAuthGuard)
  login() {}

  @Get('redirect')
  @UseGuards(ftAuthGuard)
  redirect(@Req() req: Request) {
    return this.authService.jwtIssueToken(req.user);
  }

  @Get('protected')
  @UseGuards(jwtAuthGuard)
  status(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Get('profile')
  @UseGuards(jwtAuthGuard)
  profile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  logout() {}
}
