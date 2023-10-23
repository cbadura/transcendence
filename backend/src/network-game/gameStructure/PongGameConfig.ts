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
    },
    balls: [{
      defaultPosX: 1280 / 2,
      defaultPosY: 720 / 2,
      defaultDirX: -1,
      defaultDirY: 0,
      defaultRadius: 20,
      defaultSize: 1.00, //not sure
      defaultSpeed: 5,
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
        minLength: 10,
        maxLength: 1280,
      },
      balls: [{
        defaultPosX: 1280 / 2,
        defaultPosY: 720 / 2,
        defaultDirX: Math.floor(Math.random() * 2) === 0 ? 1 : -1,
        defaultDirY: Math.floor(Math.random() * 2) === 0 ? 0.5 : -0.5,
        // defaultDirY: 0, //temporary
        // defaultDirY:  Math.floor(Math.random() * 2),
        // defaultDirY:  0.1,
        defaultRadius: 20,
        defaultSize: 1.00, //not sure
        defaultSpeed: 5,
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
      minLength: 10,
      maxLength: 1280,
    },
    balls: [
      {
        defaultPosX: 1280 / 2,
        defaultPosY: 720 / 2,
        defaultDirX: 1,
        defaultDirY: -0.5,
        defaultRadius: 20,
        defaultSize: 1.00, //not sure
        defaultSpeed: 5,
      },
      {
        defaultPosX: 1280 / 2,
        defaultPosY: 720 / 2,
        defaultDirX: -1,
        defaultDirY: -0.5,
        defaultRadius: 20,
        defaultSize: 1.00, //not sure
        defaultSpeed: 5,
      },
  ],
    maxScore: 5,
} 





export interface BallConfig {
    defaultPosX: number;
    defaultPosY: number;
    defaultDirX: number;
    defaultDirY: number;
    defaultRadius: number;
    defaultSize: number; //not sure
    defaultSpeed: number;
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

