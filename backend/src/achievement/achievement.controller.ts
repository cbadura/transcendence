import { Body, Controller, Get, Post } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Achievement } from 'src/entities/achievement.entity';


interface ApiResponse {
    success: boolean,
    message: string,
    data?: any,
}

@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService){}


    @Post() //this is just for debugging. Should be removed later
    GrantAchievement(@Body() createachievementdto: CreateAchievementDto): Promise<ApiResponse>{
        return this.achievementService.GrantAchievement(createachievementdto);
    }
    
    // @Get() //this is just for debugging. Should be removed later
    // GrantMatchAchievement(): Promise<ApiResponse>{
    //     return this.achievementService.checkAndGrantMatchAchievements(1); 
    // }
}
