import { Type } from "class-transformer";
import { IsNotEmpty,IsArray, ArrayMinSize, ValidateNested, ArrayMaxSize } from "class-validator";
import { User } from "src/entities/user.entity";

class MatchParticipant{
    
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    score: number;

    outcome: boolean;

    user: User;
}

export class CreateMatchDto {

    @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => MatchParticipant)
  matchUsers: MatchParticipant[];
}
