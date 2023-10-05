import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementDefinitionService } from 'src/achievement-definition/achievement-definition.service';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { SeedingService } from './seeding.service';

@Module({
    providers: [AchievementDefinitionService,SeedingService],
    imports: [TypeOrmModule.forFeature([AchievementDefinition])],
})
export class SeedingModule {}
