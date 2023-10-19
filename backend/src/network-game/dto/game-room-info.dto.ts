import { User } from "src/entities/user.entity";
import { Game } from "../interfaces/Game";
import { GameConfig } from "../gameConfig";

export class GameRoomUserInfo {
    constructor(user1: User,user2: User){
        this.user1 = user1;
        this.user2 = user2;
    }
    user1: User;
    user2: User;
}


export class GameRoomInfoDto {
    constructor(roomID: number = -1,game: Game= null,gameConfig: GameConfig,userInfo: GameRoomUserInfo = null){
        this.room_id = roomID;
        this.game = game;
        this.userInfo = userInfo;
        this.gameConfig = gameConfig;
    }
    room_id: number;

    game: Game;

    gameConfig: GameConfig;

    userInfo: GameRoomUserInfo;
}