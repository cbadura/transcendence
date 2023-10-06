import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from 'src/entities/achievement.entity';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { User } from 'src/entities/user.entity';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';

@Injectable()
export class AchievementService {
    constructor(
        @InjectRepository(Achievement) private achievementRepository: Repository<Achievement>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(AchievementDefinition) private achievementDefinition: Repository<AchievementDefinition>,
    ){}


    async GrantAchievement(createachievementdto: CreateAchievementDto){

        const user = await this.userRepository.findOne({where:{id:createachievementdto.user_id}})
        if (!user) 
            return {message: `User with ID ${createachievementdto.user_id} not found.`,success: false};

        const achievementDef = await this.achievementDefinition.findOne({where:{id:createachievementdto.achievement_id}})
        if (!achievementDef) 
            return {message: `Achievement with ID ${createachievementdto.achievement_id} not found.`,success: false};
    
        const existingAchievement = await this.achievementRepository.findOne({
            where: {
                owner: {id: user.id},
                achievementDefinition: {id: achievementDef.id},
            },
        });

        if(existingAchievement){
           return { message: `Achievement for User ID ${createachievementdto.user_id} and Achievement ID ${createachievementdto.achievement_id} already exists.`, success: false}
        }
        //do more error checking if a user has already unlocked this achievement

        const achievement = new Achievement();
        achievement.owner = user;
        achievement.achievementDefinition = achievementDef;
        achievement.date_unlocked = new Date();
        this.achievementRepository.save(achievement);
        return {message: `Successfully created Achievement Entry.`,success: true,data: achievement };
    }
}
