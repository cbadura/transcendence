import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ftAuthGuard } from './guard/ft.guard';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guard/jwt.guard';
import { simplejwtAuthGuard } from './guard/simple.jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(ftAuthGuard)
  login() {}

  @Get('redirect')
  @UseGuards(ftAuthGuard)
  async redirect(@Req() req: Request) {
    const token = await this.authService.jwtIssueToken(req.user);
    console.log(token);
    return token;
  }

  @Post('2fa/verify')
  @UseGuards(simplejwtAuthGuard)
  tfa(@Req() req: Request, @Body() body: any) {
    console.log(body);
    // return token;
  }

  @Get('2fa/activate')
  @UseGuards(jwtAuthGuard)
  activateTfa(@Req() req: Request) {

  }

  @Get('2fa/deactivate')
  @UseGuards(jwtAuthGuard)
  deactivateTfa(@Req() req: Request) {
    
  }

  @Get('profile')
  @UseGuards(jwtAuthGuard)
  profile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  logout() {}
}
