import { User } from "src/entities/user.entity";
import { GameRenderInfo } from "../gameStructure/RenderInfo";

export class GameRoomUserInfo {
    constructor(user1: User,user2: User){
        this.user1 = user1;
        this.user2 = user2;
    }
    user1: User;
    user2: User;
}


export class GameRoomInfoDto {
    constructor(roomID: number = -1,game: GameRenderInfo = null,userInfo: GameRoomUserInfo = null){
        this.room_id = roomID;
        this.game = game;
        this.userInfo = userInfo;
    }
    room_id: number;

    game: GameRenderInfo;

    userInfo: GameRoomUserInfo;
}