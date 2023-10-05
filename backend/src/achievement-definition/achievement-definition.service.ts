import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementDefinitionService {
    constructor(
    @InjectRepository(AchievementDefinition)
    private achievementDefinitionRepository: Repository<AchievementDefinition>,
    ) {}

    async getAchievementDefinitions(): Promise<AchievementDefinition[]> {
        return await this.achievementDefinitionRepository.find();
    }

    async getAchievementDefinition(id: number): Promise<AchievementDefinition> {
        return await this.achievementDefinitionRepository.findOne({where: {id}});
    }
}
