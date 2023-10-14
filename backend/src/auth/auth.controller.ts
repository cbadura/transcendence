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
  redirect(/*@Res() res: Response*/@Query() qpara: any) {
    // res.status(200).send('hi');
    console.log(qpara.code);
    
  }

  @Get('status')
  status() {}

  @Get('logout')
  logout() {}
}
