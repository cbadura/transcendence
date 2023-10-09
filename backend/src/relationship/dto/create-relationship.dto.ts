import { IsIn, IsNotEmpty, IsNumber, IsInt, Max } from "class-validator";

export class CreateRelationshipDto {

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @Max(2147483647)
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @Max(2147483647)
    relationship_user_id: number;

    @IsNotEmpty()
    @IsIn(['friend', 'blocked'])
    relationship_status: 'friend' | 'blocked'

}