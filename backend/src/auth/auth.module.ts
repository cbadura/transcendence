import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ftStrategy } from './strategy/ft.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { SecretBox } from 'src/entities/secretBox.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([User, SecretBox]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, ftStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
