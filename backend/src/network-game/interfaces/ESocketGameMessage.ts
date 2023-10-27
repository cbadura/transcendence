
export enum ESocketGameMessage {
    TRY_CREATE_ROOM = 'tryCreateRoom', 
    ROOM_CREATED = 'roomCreated', //confirmation that room was successfully created
    RECEIVE_ROOM_INVITE = 'receiveRoomInvite', //event to receive game invitations
    TRY_JOIN_ROOM = 'tryJoinRoom', //response to a game invitation either accept or decline

    LOBBY_COMPLETED = 'lobbyCompleted', //will send all game relevant information
    START_COUNTDOWN = 'startCountdown',
    GAME_ABORTED = 'gameAborted',
    START_GAME = 'startGame',
    UPDATE_GAME_INFO = 'updateGame',
    GAME_ENDED = 'gameEnded',
    TRY_MOVE_PADDLE = 'tryMovePaddle',

    TRY_LEAVE_MATCH = 'tryLeaveMatch',
    
    
    TRY_JOIN_QUEUE = 'tryJoinQueue',
    TRY_LEAVE_QUEUE = 'tryLeaveQueue',
    
}