import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ftAuthGuard } from './auth.guard';
import { PassportModule } from '@nestjs/passport'

@Controller('auth')
export class AuthController {

  @Get('login')
  @UseGuards(ftAuthGuard)
  login() {}

  @Get('redirect')
  redirect(@Res() res: Response) {
    res.status;
  }

  @Get('status')
  status() {}

  @Get('logout')
  logout() {}
}
