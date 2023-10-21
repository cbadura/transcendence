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
  login() {
    return ;
  }

  @Get('redirect')
  @UseGuards(ftAuthGuard)
  async redirect(@Res() res: Response, @Req() req: Request) {
    const token = await this.authService.jwtValidate(req.user);
    console.log(token);
    res.status(200).send(token);
    
  }

  @Get('protected')
  @UseGuards(jwtAuthGuard)
  status(@Req() req: Request) {
    console.log(req.user);
    return 'status';
  }

  @Get('logout')
  logout() {}
}
