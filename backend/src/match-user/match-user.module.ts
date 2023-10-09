import { Module } from '@nestjs/common';
import { MatchUserService } from './match-user.service';
import { MatchUserController } from './match-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchUser } from 'src/entities/match-user.entity';

@Module({
  providers: [MatchUserService],
  controllers: [MatchUserController],
  imports: [TypeOrmModule.forFeature([MatchUser])],
})
export class MatchUserModule {}
