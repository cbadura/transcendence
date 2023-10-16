import { Type } from "class-transformer";
import { IsNotEmpty,IsArray, ArrayMinSize, ValidateNested, ArrayMaxSize, IsOptional } from "class-validator";
import { User } from "src/entities/user.entity";

class MatchParticipant{
    
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    score: number;

    outcome: boolean;

    user: User;
}

class MatchEndReason{
  @IsNotEmpty()
  reason: 'score' | 'disconnect';

  @IsOptional()
  disconnected_user_id: number;
}

export class CreateMatchDto {

  //this is necesarry to detemine who won if a user disconnected, so even a 0:4 match can be won if the player with 4 points leaves
  @IsNotEmpty()
  matchEndReason: MatchEndReason;

    @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => MatchParticipant)
  matchUsers: MatchParticipant[];
}
