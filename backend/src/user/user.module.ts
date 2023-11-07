import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { MatchUser } from 'src/entities/match-user.entity';
import { Match } from 'src/entities/match.entity';
import { Relationship } from 'src/entities/relationship.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User,MatchUser,Match,Relationship]),
    JwtModule
  ],
  exports: [UserService],
})
export class UserModule {}
