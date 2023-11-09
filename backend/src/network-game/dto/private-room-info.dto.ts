import { User } from "src/entities/user.entity";


export class privateRoomInvitationInfo {
    room_id: number; 
    gameType: 'default' | 'special';
    inviting_user: User;
}