import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { AchievementDefinitionService } from './achievement-definition.service';
import {Response} from 'express'
import * as path from 'path';

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

    @Get('achievementImages/:filename')
    ServeUploadedFile(@Param('filename')filename:string, @Res() res: Response){
        const filePath = path.join(__dirname, '../../', 'uploadedData/achievementImages/', filename);
        console.log(filePath);
        res.sendFile(filePath)
    }
}
