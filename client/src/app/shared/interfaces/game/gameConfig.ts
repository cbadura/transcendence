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
