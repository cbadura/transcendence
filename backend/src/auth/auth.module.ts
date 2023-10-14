import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ftStrategy } from './auth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ftStrategy]
})
export class AuthModule {}
