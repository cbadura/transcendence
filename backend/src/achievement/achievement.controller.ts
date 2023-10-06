import { Body, Controller, Post } from '@nestjs/common';
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


    @Post()
    GrantAchievement(@Body() createachievementdto: CreateAchievementDto): Promise<ApiResponse>{
        return this.achievementService.GrantAchievement(createachievementdto);
    }

}
