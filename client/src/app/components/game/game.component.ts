import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Square } from './square';
import { Ball } from './ball';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/user';
import { gameConfig } from './gameConfig';
import { SaturatedColor, LightenDarkenColor } from 'src/app/shared/color';
import { Render } from './Render'


import { Match } from 'src/app/shared/match';
import { Game } from './interfaces/Game'

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private render!: Render;
  private ctx!: CanvasRenderingContext2D;
  private myUser!: User;
  private userSubscription!: Subscription;
  private game! : Game;
  // private paddle!: Square;
  // private oppPaddle!: Square;
  // private ball!: Ball;
  // private oppPaddleColor: string = 'black';
  // private userScore = 0;
  // private oppScore = 0;
  public gameOver: boolean = false;
  // public match!: Match;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
      // Server side
      this.initGameObj(this.game);


    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
    });
    
	  
	//   this.match = {
	// 	  opponent: this.myUser,
	// 	  dateTime: new Date().toISOString(),
	// 	  myScore: 10,
	// 	  opponentScore: 11,
	//   };
  }

  // Initialize canvas after view Init
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.render = new Render(this.ctx, this.myUser);
  }
  
  initGameObj(game: Game): void {
    // Initialize Game object
  
    // Default configs (could be hard-coded?)
    this.game = {
      gameOver: false,
      score2: 0,
      score1: 0,
    };
  }

  startGame() : void {
    this.gameLoop();
  }

  gameLoop(): void {
    const gameLoopFn = () => {
      this.render.redraw(this.game);
      //this.updateGame(this.game);
      if (!this.gameOver) {
        requestAnimationFrame(gameLoopFn);
      }
    };

    requestAnimationFrame(gameLoopFn);
  }


  // startGame(): void {
  
  // gameLoop(): void {
  //   const gameLoopFn = () => {
  //     this.redraw();
  //     this.movePaddle();

  //     // Check for score
  //     const score = this.ball.move(this.paddle.y, this.oppPaddle.y);
  //     if (score === 1) {
  //       this.userScore++;
  //       this.ball.resetBall();
  //     } else if (score === 2) {
  //       this.oppScore++;
  //       this.ball.resetBall();
  //     }

  //     // Check for win
  //     if (this.userScore >= 5 || this.oppScore >= 5) {
  //       this.gameOverRoutine();
  //       return;
  //     } else if (!this.ball.stop) {
  //       requestAnimationFrame(gameLoopFn);
  //     }
  //   };

  //   requestAnimationFrame(gameLoopFn);
  // }


  // private movingUp: boolean = false;
  // private movingDown: boolean = false;
  // private movingUpOpp: boolean = false;
  // private movingDownOpp: boolean = false;

  // @HostListener('window:keydown', ['$event'])
  // handleKeyDown(event: KeyboardEvent) {
  //   if (event.key === 'w') {
  //     this.movingUp = true;
  //   }
  //   if (event.key === 's') {
  //     this.movingDown = true;
  //   }
  //   if (event.key === 'ArrowUp') {
  //     this.movingUpOpp = true;
  //   }
  //   if (event.key === 'ArrowDown') {
  //     this.movingDownOpp = true;
  //   }
  // }

  // @HostListener('window:keyup', ['$event'])
  // handleKeyUp(event: KeyboardEvent) {
  //   if (event.key === 'w') {
  //     this.movingUp = false;
  //   }
  //   if (event.key === 's') {
  //     this.movingDown = false;
  //   }
  //   if (event.key === 'ArrowUp') {
  //     this.movingUpOpp = false;
  //   }
  //   if (event.key === 'ArrowDown') {
  //     this.movingDownOpp = false;
  //   }
  // }

  // // movePaddle() {
  // //   const maxTop = 10;
  // //   const maxBottom = this.ctx.canvas.height - maxTop - gameConfig.PADDLE_LEN;

  // //   if (this.movingUp && this.paddle.y > maxTop) {
  // //     this.paddle.moveBy(-gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // //   if (this.movingDown && this.paddle.y < maxBottom) {
  // //     this.paddle.moveBy(gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // //   if (this.movingUpOpp && this.oppPaddle.y > maxTop) {
  // //     this.oppPaddle.moveBy(-gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // //   if (this.movingDownOpp && this.oppPaddle.y < maxBottom) {
  // //     this.oppPaddle.moveBy(gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // // }

  // redraw() {

  // }

 


  // ngOnDestroy(): void {
  //   this.userSubscription.unsubscribe();
  // }
}
