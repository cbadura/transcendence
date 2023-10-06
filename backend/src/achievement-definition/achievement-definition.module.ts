import { Module } from '@nestjs/common';
import { AchievementDefinitionService } from './achievement-definition.service';
import { AchievementDefinitionController } from './achievement-definition.controller';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [AchievementDefinitionService],
  controllers: [AchievementDefinitionController],
  imports: [TypeOrmModule.forFeature([AchievementDefinition])],
  // exports: [AchievementDefinitionService], 
})
export class AchievementDefinitionModule {}
