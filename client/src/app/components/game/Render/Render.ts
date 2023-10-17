import { GameConfig } from '../gameConfig';
import { Game } from '../../../shared/interfaces/game/Game';
import { User } from 'src/app/shared/interfaces/user';
import { SaturatedColor, LightenDarkenColor } from 'src/app/shared/functions/color';
import { Rectangle } from './Rectangle';
import { Puck } from './Puck';

export class Render {
  private game!: Game;
  private darkerColor: string;
  private saturatedColor: string;
  private paddle1: Rectangle;
  private paddle2: Rectangle;
  private puck: Puck;

  constructor(private ctx: CanvasRenderingContext2D, private user: User, private gameConfig: GameConfig, user1: User, user2: User) {
    this.darkerColor = LightenDarkenColor(this.user.color, -10);
    this.saturatedColor = SaturatedColor(this.user.color, 20);
    this.paddle1 = new Rectangle(
      this.ctx,
      user1,
      gameConfig.lineOffset + gameConfig.paddle.width / 2
    );
    this.paddle2 = new Rectangle(
      this.ctx,
      user2,
      this.ctx.canvas.width -
        (gameConfig.lineOffset + gameConfig.paddle.width * 1.5)
    );
    this.puck = new Puck(this.ctx);
  }

  redraw(newGame: Game): void {
    this.game = newGame;
    const canvas = this.ctx.canvas;

    // Clear canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background
    this.ctx.fillStyle = this.darkerColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines and scores
    this.drawCourt(this.darkerColor, this.user.color, 10);

    this.paddle1.draw(this.game.paddle1);
    this.paddle2.draw(this.game.paddle2);
    this.puck.draw(this.game.ball.x, this.game.ball.y);
  }

  drawCourt(backgroundColor: string, lineColor: string, lineWidth: number) {
    const { gameConfig } = this;
	  
	  // Define variables
    const midX = gameConfig.canvas.width / 2 - 2;
    const midY = gameConfig.canvas.height / 2;

    // Mid line
    this.drawLine(midX, gameConfig.canvas.height, lineWidth, lineColor);
    // Right line
    this.drawLine(
      gameConfig.paddle.width + gameConfig.lineOffset,
      gameConfig.canvas.height,
      lineWidth,
      lineColor
    );
    // Lines left
    this.drawLine(
      gameConfig.canvas.width - gameConfig.paddle.width - gameConfig.lineOffset,
      gameConfig.canvas.height,
      lineWidth,
      lineColor
    );
    // Center circle
    this.drawCircle(midX, midY, 150, backgroundColor, lineColor);
    // Score 1
    this.drawString(
      midX - 120,
      gameConfig.canvas.height - 50,
      lineColor,
      'bold 60pt Sniglet',
      this.game.score1.toString()
    );
    // Score 2
    this.drawString(
      midX + 70,
      gameConfig.canvas.height - 50,
      lineColor,
      'bold 60pt Sniglet',
      this.game.score2.toString()
    );
    // Ball hits
    if (this.game.ball.hits < 10) {
      this.drawString(
        midX - 20,
        midY + 50,
        lineColor,
        'bold 100pt Sniglet',
        this.game.ball.hits.toString()
      );
    } else if (this.game.ball.hits < 100) {
      this.drawString(
        midX - 35,
        midY + 50,
        lineColor,
        'bold 100pt Sniglet',
        this.game.ball.hits.toString()
      );
    }
    else if (this.game.ball.hits < 1000) {
      this.drawString(
        midX - 60,
        midY + 50,
        lineColor,
        'bold 100pt Sniglet',
        this.game.ball.hits.toString()
      );
    }
    else if (this.game.ball.hits < 10000) {
      this.drawString(
        midX - 125,
        midY + 40,
        lineColor,
        'bold 80pt Sniglet',
        this.game.ball.hits.toString()
      );
    }
    else {
      this.drawString(
        midX - 125,
        midY + 35,
        lineColor,
        'bold 65pt Sniglet',
        '1000+'
      );
    }
  }

  drawLine(x: number, y: number, width: number, color: string) {
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    fillColor: string,
    strokeColor: string
  ) {
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
}
