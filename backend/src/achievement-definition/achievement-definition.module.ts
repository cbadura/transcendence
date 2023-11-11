import { Module } from '@nestjs/common';
import { AchievementDefinitionService } from './achievement-definition.service';
import { AchievementDefinitionController } from './achievement-definition.controller';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AchievementDefinitionService],
  controllers: [AchievementDefinitionController],
  imports: [TypeOrmModule.forFeature([AchievementDefinition]), JwtModule, UserModule],
  // exports: [AchievementDefinitionService], 
})
export class AchievementDefinitionModule {}
