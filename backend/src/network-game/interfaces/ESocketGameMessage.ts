
export enum ESocketGameMessage {
    TRY_CREATE_ROOM = 'tryCreateRoom', //currently does nothing but might be needed for players skipping a queue and go to play right away (e.g personal matches)
    ROOM_CREATED = 'roomCreated',
    START_COUNTDOWN = 'startCountdown',
    GAME_ABORTED = 'gameAborted',
    START_GAME = 'startGame',
    UPDATE_GAME_INFO = 'updateGame',
    GAME_ENDED = 'gameEnded',
    TRY_MOVE_PADDLE = 'tryMovePaddle',


    TRY_JOIN_QUEUE = 'tryJoinQueue',
    TRY_LEAVE_QUEUE = 'tryLeaveQueue',
}