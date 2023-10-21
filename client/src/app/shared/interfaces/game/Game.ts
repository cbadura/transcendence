import { Ball } from './Ball'

export interface Game {
    ball : Ball,
    paddle1 : number,
    paddle2 : number,
    score1: number,
    score2: number
    gameOver: boolean,
}