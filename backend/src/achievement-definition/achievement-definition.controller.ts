import { Controller, Get, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { AchievementDefinitionService } from './achievement-definition.service';
import {Response} from 'express'
import * as path from 'path';
import { jwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('achievement-definition')
export class AchievementDefinitionController {
    constructor(private readonly achievementDefinitionService: AchievementDefinitionService) {}

    @UseGuards(jwtAuthGuard)
    @Get()
    getAchievementDefinitions(){
        return this.achievementDefinitionService.getAchievementDefinitions();
    }

    @UseGuards(jwtAuthGuard)
    @Get(':id')
    getAchievementDefinition(@Param('id',ParseIntPipe ) id: number){
        return this.achievementDefinitionService.getAchievementDefinition(id);
    }

    @UseGuards(jwtAuthGuard)
    @Get('achievementImages/:filename')
    ServeUploadedFile(@Param('filename')filename:string, @Res() res: Response){
        const filePath = path.join(__dirname, '../../', 'uploadedData/achievementImages/', filename);
        res.sendFile(filePath)
    }
}
