import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
  tfa(@Req() req: Request, @Body() body: any) {
    // verify and issue a "verified" jwt
    console.log(body);
    return this.authService.tfaVerify(req.user, body);
    // return token;
  }

  @Get('profile')
  @UseGuards(jwtAuthGuard)
  profile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout') // not needed...probably
  logout() {}

  /* ----------dev-------------- */

  @Get('boxes')
  boxes() {
    return this.authService.getBoxes();
  }

  @Delete('boxes')
  wipe() {
    return this.authService.burnAllSecret();
  }
}
