import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AchievementDefinitionService } from './achievement-definition.service';

@Controller('achievement-definition')
export class AchievementDefinitionController {
    constructor(private readonly achievementDefinitionService: AchievementDefinitionService) {}


    @Get()
    getAchievementDefinitions(){
        return this.achievementDefinitionService.getAchievementDefinitions();
    }

    @Get(':id')
    getAchievementDefinition(@Param('id',ParseIntPipe ) id: number){
        return this.achievementDefinitionService.getAchievementDefinition(id);
    }
}
