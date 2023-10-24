import { User } from 'src/app/shared/interfaces/user';
import { LightenDarkenColor, SaturatedColor } from 'src/app/shared/functions/color';
import { Rectangle } from './Rectangle';
import { BallRenderInfo, GameRenderInfo, PowerUpRenderInfo } from 'src/app/components/game/Render/GameRenderInfo';

export class Render {
  private userColor: string;
  private darkerColor: string;
  private paddle1: Rectangle;
  private paddle2: Rectangle;
  private countdown!: number;
  private initialFrame: GameRenderInfo;
  constructor(
    private ctx: CanvasRenderingContext2D,
    // private gameConfig: GameConfig,
    private gameRenderInfo: GameRenderInfo,
    user1: User,
    user2: User,
    private id: number
  ) {
    this.initialFrame = gameRenderInfo;
    console.log('USER COLOR',user1.id === id ? user1.color : user2.color)
    console.log(user1.id,id);
    this.userColor = user1.id === id ? user1.color : user2.color;
    this.darkerColor = LightenDarkenColor(this.userColor, -10);
    console.log('RENDER INFO',gameRenderInfo);
    this.paddle1 = new Rectangle( this.ctx, user1, gameRenderInfo.paddles[0]);
    this.paddle2 = new Rectangle( this.ctx, user2, gameRenderInfo.paddles[1]);

    console.log('Render constructor');
    console.log('this.game', this.gameRenderInfo);
  }

  redraw(frame: GameRenderInfo): void {
    this.gameRenderInfo = frame;
    const canvas = this.ctx.canvas;

    // Clear canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background
    this.ctx.fillStyle = this.darkerColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines and scores
    this.drawCourt(this.darkerColor, this.userColor, 10);

    if (this.countdown > 0) this.drawCountdown();
    else {
      this.drawScores(this.userColor);
      this.paddle1.draw(this.gameRenderInfo.paddles[0],frame.canvas);
      this.paddle2.draw(this.gameRenderInfo.paddles[1],frame.canvas);
      this.drawName(this.paddle1.user, this.gameRenderInfo.paddles[0].pos.x - 30,this.gameRenderInfo.paddles[0].pos.y,  Math.PI / 2)
      this.drawName(this.paddle2.user, this.gameRenderInfo.paddles[1].pos.x + 30,this.gameRenderInfo.paddles[1].pos.y,- Math.PI /2)
      for (let i = 0; i < this.gameRenderInfo.powerups.length; i++) {
        this.drawPowerUp(this.gameRenderInfo.powerups[i])
      }
      for (let i = 0; i < this.gameRenderInfo.balls.length; i++) {
        this.drawBall(this.gameRenderInfo.balls[i])
      }
    }
  }

  drawPowerUp(powerup: PowerUpRenderInfo){
    this.drawCircle(powerup.pos.x, powerup.pos.y, powerup.radius, '#00000000', 'black',2);
    this.drawString(powerup.pos.x, powerup.pos.y,'black','bold 25pt Inter',powerup.type[0])
  }

  drawName(user:User,x:number,y:number,rotation: number = 0) {
    this.ctx.font = 'bold 25pt Inter';
    this.ctx.fillStyle = SaturatedColor(user.color, 20);
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.save();
    this.ctx.translate(x,y);
    this.ctx.rotate(rotation);
    this.ctx.fillText(user.name, 0, 0);
    this.ctx.restore();
  }


  drawBall(ball: BallRenderInfo) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'black'; //balls[i].color //color should be determined by renderer based on the type
      this.ctx.strokeStyle = 'black'; //balls[i].color
      this.ctx.lineWidth = 2;
      this.ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.fill();
      //drawing debug direction line
      const mult = 50;
      this.drawLine(ball.pos.x, ball.pos.y,ball.pos.x + (ball.debugDir.x * mult), ball.pos.y + (ball.debugDir.y * mult), 2, 'black');
  }

  
  drawCourt(backgroundColor: string, lineColor: string, lineWidth: number) {
    const { canvas } = this.gameRenderInfo;

    // Define variables
    const midX = canvas.width / 2 - 2;
    const midY = canvas.height / 2;

    // Mid line
    this.drawLine(midX,0,midX, canvas.height, lineWidth, lineColor);
    // Right line
    this.drawLine(
      this.gameRenderInfo.paddles[0].pos.x,0,
      this.gameRenderInfo.paddles[0].pos.x,canvas.height,
      lineWidth,
      lineColor
    );
    // Lines left
    this.drawLine(
      this.gameRenderInfo.paddles[1].pos.x,0,
      this.gameRenderInfo.paddles[1].pos.x,canvas.height,
      lineWidth,
      lineColor
    );
    // Center circle
    this.drawCircle(midX, midY, 150, backgroundColor, lineColor);
  }

  drawScores(lineColor: string) {
    // Define variables
    const { canvas } = this.gameRenderInfo;
    const midX = canvas.width / 2 - 2;
    const midY = canvas.height / 2;

    this.ctx.textAlign = 'center';
    // Score 1
    this.drawString(
      midX - 60,
      canvas.height - 50,
      lineColor,
      'bold 60pt Sniglet',
      this.gameRenderInfo.paddles[0].score.toString()
    );
    // Score 2
    this.drawString(
      midX + 60,
      canvas.height - 50,
      lineColor,
      'bold 60pt Sniglet',
      this.gameRenderInfo.paddles[1].score.toString()
    );
    // Ball hits
    if (this.gameRenderInfo.hits < 1000) {
      this.drawString(
        midX,
        midY + 50,
        lineColor,
        'bold 100pt Sniglet',
        this.gameRenderInfo.hits.toString()
      );
    } else if (this.gameRenderInfo.hits < 10000) {
      this.drawString(
        midX,
        midY + 40,
        lineColor,
        'bold 80pt Sniglet',
        this.gameRenderInfo.hits.toString()
      );
    } else {
      this.drawString(midX, midY + 35, lineColor, 'bold 65pt Sniglet', '1000+');
    }
  }

  drawLine(StartX: number, StartY: number,EndX: number, EndY: number, width: number, color: string) {
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(StartX, StartY);
    this.ctx.lineTo(EndX, EndY);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    fillColor: string,
    strokeColor: string,
    strokeWidth?: number,
  ) {
    if(strokeWidth)
      this.ctx.lineWidth = strokeWidth;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawString(x: number, y: number, color: string, font: string, text: string) {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  }

  drawCountdown() {
    const { canvas } = this.gameRenderInfo;
    const midX = canvas.width / 2 - 2;
    const midY = canvas.height / 2;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawString(
      midX,
      midY + 50,
      'black',
      'bold 100pt Sniglet',
      this.countdown.toString()
    );
  }

  reset(){
    this.redraw(this.initialFrame);
  }

  setCountdown(countdown: number) {
    console.log('SET COUNTDOWN IN RENDER');
    this.countdown = countdown;
    this.redraw(this.gameRenderInfo);
    const countdownInterval = setInterval(() => {
      this.countdown--;
      this.redraw(this.gameRenderInfo);
      console.log('COUNTDOWN: ' + this.countdown);
      if (this.countdown === 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }
}
