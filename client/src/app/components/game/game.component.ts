import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/user';
import { gameConfig } from './gameConfig';
import { Render } from './Render/Render';
import { GameControl } from './GameControl/GameControl';

import { Game } from './interfaces/Game';
import { Ball } from './interfaces/Ball';
import { Match } from 'src/app/shared/match';

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
})
export class GameComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private userSubscription!: Subscription;
  public myUser!: User;
  public match!: Match;

  // Render class
  private render!: Render;
  // GameControl class
  private gameControl!: GameControl;

  // Paddle movement
  private movingUp: boolean = false;
  private movingDown: boolean = false;

  // To delete after moving to backend:
  private movingUpOpp: boolean = false;
  private movingDownOpp: boolean = false;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    // Server side
    this.initGameControl();
    // GET game object

    // Get user data
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
    });
  }

  // Initialize canvas and render after view Init
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.render = new Render(this.ctx, this.myUser);
  }

  initGameControl(): void {
    // Backend
    // Initialize Game object
    // Default configs (could be hard-coded?)
    let ball: Ball = {
      x: gameConfig.canvas.width / 2,
      y: gameConfig.canvas.height / 2,
      hits: 0,
    };
    let game: Game = {
      gameOver: false,
      score2: 0,
      score1: 0,
      paddle1: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
      paddle2: gameConfig.canvas.height / 2 - gameConfig.paddle.length / 2,
      ball: ball,
    };
    // Initialize GameControl class
    this.gameControl = new GameControl(game);
  }

  startGame(): void {
    this.gameLoop();
  }

  fillMatchData(game: Game): void {
    this.match = {
      opponent: this.myUser, //change to real opponent
      myScore: game.score1,
      opponentScore: game.score2,
      dateTime: new Date().toISOString(),
    };
  }

  gameLoop(): void {
    const gameLoopFn = () => {
      // Backend
      this.gameControl.routine();

      // Frontend:
      // get latest game object
      this.render.redraw(this.gameControl.getGame());
      // Emit paddle step at each keypress (+ or -)
      this.movePaddle();

      if (this.isGameOver()) {
        this.fillMatchData(this.gameControl.getGame());
        return;
      }
      requestAnimationFrame(gameLoopFn);
    };

    requestAnimationFrame(gameLoopFn);
  }

  movePaddle() {
    // Will emit events to backend
    if (this.movingUp) {
      this.gameControl.movePaddle(1, -gameConfig.paddle.step);
    }
    if (this.movingDown) {
      this.gameControl.movePaddle(1, gameConfig.paddle.step);
    }

    // To delete after moving to backend
    if (this.movingUpOpp) {
      this.gameControl.movePaddle(2, -gameConfig.paddle.step);
    }
    if (this.movingDownOpp) {
      this.gameControl.movePaddle(2, gameConfig.paddle.step);
    }
  }

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

  isGameOver(): boolean {
    return this.gameControl.getGame().gameOver;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
