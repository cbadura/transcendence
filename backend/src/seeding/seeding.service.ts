import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { MongoRuntimeError, Repository } from 'typeorm';

@Injectable()
export class SeedingService implements OnModuleInit{
    constructor(
        @InjectRepository(AchievementDefinition)
    private achievementDefinitionRepository: Repository<AchievementDefinition>,
    ) {}

    async onModuleInit() {


        await this.seedAchievementDefinitions();
    }

    async seedAchievementDefinitions(){
        const AchievementDevs = [
            { name: 'First Match', description: ' Play 1 Match', criteria: { matches: 1, } },
            { name: 'Addict', description: ' Play 5 Matches', criteria: { matches: 5, } },
            { name: 'Winner', description: ' Win 5 Matches', criteria: { wins: 5, } },
            { name: '1v1me', description: 'Play against a friend' },
        ];
        
        const existingData = await this.achievementDefinitionRepository.find();
        let i = 0;
        for (; i < existingData.length; i++) {
            this.achievementDefinitionRepository.update({id: existingData[i].id } , {
                name: AchievementDevs[i].name,
                description: AchievementDevs[i].description,
                criteria: AchievementDevs[i].criteria as Record<string,any>,
            })
        }
        for (; i < AchievementDevs.length; i++) { 
            await this.achievementDefinitionRepository.save(AchievementDevs[i]);
        }
    }
}
