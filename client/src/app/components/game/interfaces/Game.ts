import { Ball } from './Ball'

export interface Paddle {
	y: number,
	user: User
}

export interface Game {
    ball : Ball,
    paddle1 : Paddle,
    paddle2 : Paddle,
    score1: number,
    score2: number
    gameOver: boolean,
}