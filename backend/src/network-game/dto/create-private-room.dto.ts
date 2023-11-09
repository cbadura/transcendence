import { IsNotEmpty } from "class-validator";


export class CreatePrivateRoomDto{

    gameType: 'default' | 'special' 

    @IsNotEmpty()
    recipient_user_id: number;
}