import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { User } from 'src/entities/user.entity';
import { MatchUser } from 'src/entities/match-user.entity';
import { AchievementModule } from 'src/achievement/achievement.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [
    AchievementModule,
    TypeOrmModule.forFeature([Match,User,MatchUser]),
    JwtModule,
    UserModule
  ],
  exports: [MatchService],
})
export class MatchModule {}
