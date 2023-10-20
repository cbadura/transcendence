import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ftAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

  @Get('login')
  @UseGuards(ftAuthGuard)
  login() {
    return ;
  }

  @Get('redirect')
  @UseGuards(ftAuthGuard)
  redirect(@Res() res: Response, @Req() req: Request) {
    console.log(req.user);
    res.status(200).send(req.user);
  }

  @Get('status')
  // @UseGuards()
  status(@Req() req: Request) {
    console.log(req.headers);
    return 'okok';
  }

  @Get('logout')
  logout() {}
}
