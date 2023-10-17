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
    radius: number;
    maxBounceAngle: number;
    color: string;
    speed: number;
  };
	lineOffset: number;
	maxScore: number;
}

export const gameConfig: GameConfig = {
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
    radius: 20,
    maxBounceAngle: (75 * Math.PI) / 180,
    color: 'black',
    speed: 5,
  },
	lineOffset: 50,
	maxScore: 5,  	
};
