import { IsNotEmpty, } from "class-validator";



export class CreateAchievementDto {
  
    @IsNotEmpty()
    user_id: number;
  
    @IsNotEmpty()
    achievement_id: number;
  
}