import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ftStrategy } from './auth.strategy';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SessionSerializer } from './auth.serializer';
import { ESession } from 'src/entities/session.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, ESession])],
  controllers: [AuthController],
  providers: [AuthService, ftStrategy, SessionSerializer]
})
export class AuthModule {}
