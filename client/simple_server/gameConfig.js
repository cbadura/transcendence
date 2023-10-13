const gameConfig = {
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
	  lineOffset: 30,
	  maxScore: 5,  	
  };
  

  module.exports = gameConfig;