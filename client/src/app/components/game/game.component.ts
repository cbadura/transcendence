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
  public game! : Game;

  // Backend
  private movingUp: boolean = false;
  private movingDown: boolean = false;
  private movingUpOpp: boolean = false;
  private movingDownOpp: boolean = false;

  // private ball!: Ball;
  // public match!: Match;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
      // Server side
      this.initGameObj(this.game);
      // GET game object

    // Get user data
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
    });
    // Initialize dummy match object
  }

  // Initialize canvas and render after view Init
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.render = new Render(this.ctx, this.myUser);
  }
  
  initGameObj(game: Game): void {
    // Backend
    // Initialize Game object
    // Default configs (could be hard-coded?)
    this.game = {
      gameOver: false,
      score2: 0,
      score1: 0,
      paddle1: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
      paddle2: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
    };
  }

  startGame() : void {
    this.gameLoop();
  }

  gameLoop(): void {
    const gameLoopFn = () => {
      // Frontend:
      // get latest game object
      this.render.redraw(this.game);
      // Emit paddle step at each keypress (+ or -)
      this.movePaddle()
      
      // Backend
      // this.updateGame()

      if (!this.game.gameOver) {
        requestAnimationFrame(gameLoopFn);
      }
    };

    requestAnimationFrame(gameLoopFn);
  }

  updateGame(id : number, step : number)
  {
    const maxTop = 10;
    const maxBottom = gameConfig.canvas.height - gameConfig.paddle.length - maxTop;
    if (id === 1)
    {
      const newPaddlePos = this.game.paddle1 + step;
      if (newPaddlePos > maxTop && newPaddlePos < maxBottom)
        this.game.paddle1 = newPaddlePos;
    }
    if (id === 2) //check for limit
    {
      const newPaddlePos = this.game.paddle2 + step;
      if (newPaddlePos > maxTop && newPaddlePos < maxBottom)
        this.game.paddle2 = newPaddlePos;
    }
  }

  movePaddle() {
    if (this.movingUp) {
      this.updateGame(1, -gameConfig.paddle.step);
    }
    if (this.movingDown) {
      this.updateGame(1, gameConfig.paddle.step);
    }

    // To delete after moving to backend
    if (this.movingUpOpp) {
      this.updateGame(2, -gameConfig.paddle.step);
    }
    if (this.movingDownOpp) {
      this.updateGame(2, gameConfig.paddle.step);
    }
  }

  // // movePaddle() {


  // //   if (this.movingUp ) {
  // //     this.paddle.moveBy(-gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // //   if (this.movingDown) {
  // //     this.paddle.moveBy(gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // //   if (this.movingUpOpp) {
  // //     this.oppPaddle.moveBy(-gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // //   if (this.movingDownOpp) {
  // //     this.oppPaddle.moveBy(gameConfig.PADDLE_MOVE_STEP);
  // //   }
  // // }

 
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.movingUp = true;
    }
    if (event.key === 's') {
      this.movingDown = true;
    }
    if (event.key === 'ArrowUp') {
      this.movingUpOpp = true;
    }
    if (event.key === 'ArrowDown') {
      this.movingDownOpp = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.movingUp = false;
    }
    if (event.key === 's') {
      this.movingDown = false;
    }
    if (event.key === 'ArrowUp') {
      this.movingUpOpp = false;
    }
    if (event.key === 'ArrowDown') {
      this.movingDownOpp = false;
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}


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