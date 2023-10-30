import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from 'src/entities/achievement.entity';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { User } from 'src/entities/user.entity';
import { AchievementDefinition } from 'src/entities/achievement-definition.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AchievementService {
    constructor(
        @InjectRepository(Achievement) private achievementRepository: Repository<Achievement>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(AchievementDefinition) private achievementDefinition: Repository<AchievementDefinition>,
        readonly userService: UserService
    ){}


    async GrantAchievement(createachievementdto: CreateAchievementDto){

        const user = await this.userRepository.findOne({where:{id:createachievementdto.user_id}})
        if (!user) 
            return {message: `User with ID ${createachievementdto.user_id} not found.`,success: false};

        const achievementDef = await this.achievementDefinition.findOne({where:{id:createachievementdto.achievement_id}})
        if (!achievementDef) 
            return {message: `Achievement with ID ${createachievementdto.achievement_id} not found.`,success: false};
            
        const existingAchievement = await this.checkExistingAchievementFromID(user.id,achievementDef.id)

        if(existingAchievement){
           return { message: `Achievement for User ID ${createachievementdto.user_id} and Achievement ID ${createachievementdto.achievement_id} already exists.`, success: false}
        }
        //do more error checking if a user has already unlocked this achievement
        const achievement = this.saveAchievement(user,achievementDef);
        return {message: `Successfully created Achievement Entry.`,success: true,data: achievement };
    }

    async checkAndGrantMatchAchievements(user_id: number) {
        const user = await this.userRepository.findOne({where:{id:user_id},relations: ['achievements','achievements.achievementDefinition'],})
        if (!user) 
            return {message: `User with ID ${user_id} not found.`,success: false};

        //get all possible achievements that are not unlocked yet
        let unlockableAchievements = await this.getUnlockableAchievements(user)

        //grant all match achievements that can be granted
        for (let i = 0; i < unlockableAchievements.length; i++) {
            if(unlockableAchievements[i].id == 1 || unlockableAchievements[i].id == 2) {
                user.matches >= unlockableAchievements[i].criteria.matches && this.saveAchievement(user,unlockableAchievements[i]);
            }
            else if(unlockableAchievements[i].id == 3) {
                user.wins >= unlockableAchievements[i].criteria.wins && this.saveAchievement(user,unlockableAchievements[i]);
            }
        }
    }

    async checkAndGrantPlayAFriendAchievement(user_id: number,opponent_id: number) {
        const user = await this.userRepository.findOne({where:{id:user_id},relations: ['achievements','achievements.achievementDefinition'],})
        if (!user) 
            return;

        const existingAchievement = await this.checkExistingAchievementFromID(user_id,4)
        if(existingAchievement){
            return;
         }
        
        const usersAreFriends = await this.userService.validateRelationshipFromUser(user_id,opponent_id,'friend')
        if(usersAreFriends)
            this.GrantAchievement({user_id:user_id,achievement_id: 4})
    }

    private async getUnlockableAchievements(user:User) {
        let unlockableAchievements = await this.achievementDefinition.find();
        return unlockableAchievements.filter((definition)=> user.achievements.find((achievement)=>achievement.achievementDefinition.id == definition.id) == null)
    }

    async checkExistingAchievementFromID(user_id: number,achievement_def_id){
        return await this.achievementRepository.findOne({
            where: {
                owner: {id: user_id},
                achievementDefinition: {id: achievement_def_id},
            },
        });
    }

    saveAchievement(user: User,achievementDef: AchievementDefinition): Achievement{
        const achievement = new Achievement();
        achievement.owner = user;
        achievement.achievementDefinition = achievementDef;
        achievement.date_unlocked = new Date();
        this.achievementRepository.save(achievement);
        return achievement;
    }
}
