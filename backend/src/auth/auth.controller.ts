import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
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
  redirect(@Res() res: Response, @Req() req: Request) {
    // console.log(req.headers);
    console.log(req.user['id']);
    res.status(200).send(req.user['id']);
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    console.log(req.headers);
    return 'okok';
  }

  @Get('logout')
  logout() {}

  @Get('session')
  session() {
    return this.authService.getSession();
  }

  @Delete('session')
  deleteSession() {
    return this.authService.deleteSession();
  }
}
