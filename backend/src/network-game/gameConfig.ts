export interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  paddle: {
    length: number;
    width: number;
    leftX: number;
    rightX: number;
    step: number;
  };
  ball: {
    defaultRadius: number;
    maxBounceAngle: number;
    color: string;
    speed: number;
  };
	lineOffset: number;
	maxScore: number;
}

export const defaultGameConfig: GameConfig = {
  canvas: {
    width: 1280,
    height: 720,
  },
  paddle: {
    length: 180,
    width: 25,
    leftX: 15,
    rightX: 15,
    step: 10,
  },
  ball: {
    defaultRadius: 20,
    maxBounceAngle: (75 * Math.PI) / 180,
    color: 'black',
    speed: 5,
  },
	lineOffset: 30,
	maxScore: 5,  	
};

export const specialGameConfig: GameConfig = {
  canvas: {
    width: 1280,
    height: 720,
  },
  paddle: {
    length: 180,
    width: 25,
    leftX: 15,
    rightX: 15,
    step: 10,
  },
  ball: {
    defaultRadius: 20,
    maxBounceAngle: (75 * Math.PI) / 180,
    color: 'red',
    speed: 10,
  },
	lineOffset: 30,
	maxScore: 5,  	
};
