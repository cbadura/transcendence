import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Achievement } from 'src/entities/achievement.entity';
import { DebugRoute } from 'src/auth/guard/debugRoute.guard';


interface ApiResponse {
    success: boolean,
    message: string,
    data?: any,
}

@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService){}
    
}
