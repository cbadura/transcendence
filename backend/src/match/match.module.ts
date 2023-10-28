import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { User } from 'src/entities/user.entity';
import { MatchUser } from 'src/entities/match-user.entity';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [AchievementModule,TypeOrmModule.forFeature([Match,User,MatchUser])],
  exports: [MatchService],
})
export class MatchModule {}
