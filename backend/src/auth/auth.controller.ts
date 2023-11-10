import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ftAuthGuard } from './guard/ft.guard';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guard/jwt.guard';
import { simplejwtAuthGuard } from './guard/simple.jwt.guard';
import { cookieConfig } from './cookie.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(ftAuthGuard)
  login() {
    console.log('hi there');
  }

  @Get('redirect')
  @UseGuards(ftAuthGuard)
  async redirect(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.jwtIssueToken(req.user, res);
    console.log(token);
    // res.cookie('token', token.access_token, cookieConfig);
    // console.log(req);
    // console.log(res);
    // console.log(req.cookies.token);
    res.send(token);
  }

  @Get('2fa/activate')
  @UseGuards(jwtAuthGuard)
  async activateTfa(@Req() req: Request, @Res() res: Response) {
    // just create temp secret, save it and send to client, not enabling tfa yet
    console.log(req.user);
    const img = await this.authService.getTempQRcode(req.user);
    res.setHeader('content-type', 'image/png');
    res.send({qr: img})
  }

  @Post('2fa/activate')
  @UseGuards(jwtAuthGuard)
  validActivate(@Req() req: Request, @Body() body: any) {
    return this.authService.verifyActivate(req.user, body);
    // change user tfa to true here after verify
    // make temp secret real secret
  }

  @Get('2fa/deactivate')
  @UseGuards(jwtAuthGuard)
  deactivateTfa(@Req() req: Request) {
    return this.authService.deactivateTfa(req.user);
  }

  @Post('2fa/verify')
  @UseGuards(simplejwtAuthGuard)
  async tfa(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const data = await this.authService.tfaVerify(req.user, body, res);
    // verify and issue a "verified" jwt
    console.log(body);
    res.send(data);
  }

  @Get('profile')
  @UseGuards(jwtAuthGuard)
  profile(@Req() req: Request) {
    console.log(req.cookies);
    return req.user;
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token').send('logged out');
  }

  /* ----------dev-------------- */

  @Get('boxes') //added to dev module
  boxes() {
    return this.authService.getBoxes();
  }

  @Delete('boxes') //added to dev module
  wipe() {
    return this.authService.burnAllSecret();
  }
}
