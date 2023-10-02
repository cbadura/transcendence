import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @Get()
  // get_hehe() {
  //   return "blablablab";
  // }

  // @Get()
  // serve(@Res() res: Response) {
  //   res.sendFile('/nfs/homes/htam/github/transcendence/site/index.html');
  // }
  
}
