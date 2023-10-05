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
            { name: 'First Matchasdasdasdas', description: ' Play 1 Match boomer adasdasdasdas', criteria: { matches: 1, } },
            { name: 'Addictasdasdas', description: ' Play 5 Matches boomer adasdasdas', criteria: { matches: 5, } },
            { name: 'Winnerasdasdasdasdasdasdasd', description: ' Win 5 Matches boomer this iasasdadasdasdasdass anii', criteria: { wins: 5, } },
            { name: 'new title wowooooo', description: ' Win 5 Matches boomer this is anii', criteria: { wins: 5, killme: 13123121 } },
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
