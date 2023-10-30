import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/entities/achievement.entity';
import { User } from 'src/entities/user.entity';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AchievementService],
  controllers: [AchievementController],
  imports: [UserModule,TypeOrmModule.forFeature([Achievement,User,AchievementDefinition])],
  exports: [AchievementService]
})
export class AchievementModule {}
