import { Controller, Get, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Get('login')
  login() {}

  @Get('redirect')
  redirect(@Res() res: Response) {
    
  }

  @Get('status')
  status() {}

  @Get('logout')
  logout() {}
}
