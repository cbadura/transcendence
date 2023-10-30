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
            { name: 'First Match', description: ' Play 1 Match',image: '1match.png', criteria: { matches: 1, } },
            { name: 'Addict', description: ' Play 5 Matches',image: '5matches.png', criteria: { matches: 5, } },
            { name: 'Winner', description: ' Win 5 Matches',image: '5wins.png', criteria: { wins: 5, } },
            { name: '1v1me', description: 'Play against a friend ',image: 'playafriend.png' },
        ];
        
        for (let i = 0; i < AchievementDevs.length; i++) {
            AchievementDevs[i].image = 'http://localhost:3000/achievement-definition/achievementImages/' + AchievementDevs[i].image;
        }
        const existingData = await this.achievementDefinitionRepository.find({order: {id: "ASC"}});
        let i = 0;
        for (; i < existingData.length; i++) {
            this.achievementDefinitionRepository.update({id: existingData[i].id } , {
                name: AchievementDevs[i].name,
                description: AchievementDevs[i].description,
                image: AchievementDevs[i].image,
                criteria: AchievementDevs[i].criteria as Record<string,any>,
            })
            // console.log("updating ID",existingData[i].id,'with Name',AchievementDevs[i].name )
        }
        for (; i < AchievementDevs.length; i++) { 
            await this.achievementDefinitionRepository.save(AchievementDevs[i]);
        }
    }
}
