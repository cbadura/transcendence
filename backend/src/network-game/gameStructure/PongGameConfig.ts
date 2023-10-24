import { Vector2D } from "./Vector2D";

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
      maxLength: 1280,
    },
    balls: [{
      type: 'Default',
      defaultPos: new Vector2D(1280 / 2,720 / 2),
      defaultDir: new Vector2D(-1,0),
    }],
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
        maxLength: 1280,
      },
      balls: [{
        type: 'Default',
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
        type: 'Default',
        defaultPos: new Vector2D(1280 / 2,720 / 2),
        defaultDir: new Vector2D(1,-0.5),
      },
      {
        type: 'Default',
        defaultPos: new Vector2D(1280 / 2,720 / 2),
        defaultDir: new Vector2D(-1,-0.5),
      },
  ],
    maxScore: 5,
} 





export interface BallConfig {
    type: string;
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

export interface PongGameConfig {
    canvas: GameBoardConfig;
    paddle: PaddleConfig;
    balls: BallConfig[];
    maxScore: number;
}

