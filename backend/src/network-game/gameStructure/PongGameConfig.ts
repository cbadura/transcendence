import { EPowerUpType } from "./PowerUps/EPowerUpType";
import { Vector2D } from "./Vector2D";
import { EBallType } from "./gameBalls/EBallType";

export const trainingGameConfig: PongGameConfig = {
  canvas: {
      width: 1280,
      height: 720,
      goalLineOffset: 60,
    },
    paddle: {
      length: 180,
      width: 25,
      startPosY: 720 / 2, //hard coding for now
      step: 10,
      minLength: 20,
      maxLength: 400,
    },
    balls: [{
      type: EBallType.DEFAULT,
      defaultPos: new Vector2D(1280 / 2,720 / 2),
      defaultDir: new Vector2D(-1,0),
    }],
    powerUps: [
      {type: EPowerUpType.SPLITBALL,config: { splitBallAmount: 2,maxAngle: 10,}},
      {type: EPowerUpType.INC_BALL_SIZE,config: { increase: 5, applyToAll: false}},
      {type: EPowerUpType.INC_OWN_PADDLE_SIZE,config: { increment: 10}},
      {type: EPowerUpType.DEC_OPP_PADDLE_SIZE,config: { increment: -10}},
    ],
    maxScore: 1000,
} 

export const defaultConfig: PongGameConfig = {
    canvas: {
        width: 1280,
        height: 720,
        goalLineOffset: 60,
      },
      paddle: {
        length: 180,
        width: 25,
        startPosY: 720 / 2, //hard coding for now
        step: 10,
        minLength: 20,
        maxLength: 400,
      },
      balls: [{
        type:EBallType.DEFAULT,
        defaultPos: new Vector2D(1280 / 2,720 / 2),
        defaultDir: new Vector2D(Math.floor(Math.random() * 2) === 0 ? 1 : -1, Math.floor(Math.random() * 2) === 0 ? 0.5 : -0.5),
      }],
      maxScore: 5,
} 

export const specialConfig: PongGameConfig = {
  canvas: {
      width: 1280,
      height: 720,
      goalLineOffset: 60,
    },
    paddle: {
      length: 90,
      width: 25,
      startPosY: 720 / 2, //hard coding for now
      step: 10,
      minLength: 20,
      maxLength: 1280,
    },
    balls: [
      {
        type: EBallType.DEFAULT,
        defaultPos: new Vector2D(1280 / 2,720 / 2),
        defaultDir: new Vector2D(1,-0.5),
      },
      {
        type: EBallType.DEFAULT,
        defaultPos: new Vector2D(1280 / 2,720 / 2),
        defaultDir: new Vector2D(-1,-0.5),
      },
    ],
    powerUps: [
      {type: EPowerUpType.SPLITBALL,config: { splitBallAmount: 2,maxAngle: 45,}},
      {type: EPowerUpType.INC_BALL_SIZE,config: { increase: 5, applyToAll: false}},
      {type: EPowerUpType.INC_OWN_PADDLE_SIZE,config: { increment: 10}},
      {type: EPowerUpType.DEC_OPP_PADDLE_SIZE,config: { increment: -10}},
    ],
    maxScore: 5,
} 





export interface BallConfig {
    type: EBallType;
    defaultPos: Vector2D;
    defaultDir: Vector2D;
}

export interface GameBoardConfig {
    width: number;
    height: number;
    goalLineOffset: number;
}

export interface PaddleConfig {
    length: number;
    width: number;
    startPosY: number;
    step: number;
    minLength?: number;
    maxLength?: number;
}

export interface PowerUpConfig {
    type: EPowerUpType;
    config?: any;
}

export interface PongGameConfig {
    canvas: GameBoardConfig;
    paddle: PaddleConfig;
    balls: BallConfig[];
    maxScore: number;
    powerUps?: PowerUpConfig[];
}