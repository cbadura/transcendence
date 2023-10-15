import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';

import { UserDataService } from '../../services/user-data.service';
import { GameService } from 'src/app/services/game.service';
import { gameConfig } from './gameConfig';
import { Render } from './Render/Render';

// Interfaces
import { User } from '../../shared/user';
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
  private gameSubscription!: Subscription;
  public myUser!: User;
  public match!: Match;

  // Render class
  private render!: Render;
  // GameControl class
  private game!: Game;

  // Paddle movement
  private movingUp: boolean = false;
  private movingDown: boolean = false;

  // To delete after moving to backend:
  private movingUpOpp: boolean = false;
  private movingDownOpp: boolean = false;

  constructor(
    private userDataService: UserDataService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    // Get user data
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
    });

    // Add event emitters
    //this.movePaddle();

    // Get game data
  }

  // Initialize canvas and render after view Init
  ngAfterViewInit(): void {
    // Initialize canvas
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    //   Initialize Render class - gameConfig should come from server
    this.render = new Render(this.ctx, this.myUser, gameConfig);
  }

  startGame(): void {
    console.log(this.myUser);
    this.gameService.createGameSocket(this.myUser.id);
    console.log('gameSocket created');
    console.log('gameover:', this.isGameOver());

    this.gameService.subscribeToGame();
    this.gameSubscription = this.gameService.serverGameObs$.subscribe(
      (game) => {
        this.game = game;
        console.log('game', game);
        if (this.game && this.render) {
          this.movePaddle();
          if (!this.game.gameOver) this.render.redraw(this.game);
          else {
            this.fillMatchData(this.game);
            return;
          }
        }
      }
    );
  }

  playAgain(): void {
    //clean up prev field
    this.gameService.disconnectGameSocket();
    this.startGame();
  }

  fillMatchData(game: Game): void {
    this.match = {
      opponent: this.myUser, //change to real opponent
      myScore: game.score1,
      opponentScore: game.score2,
      dateTime: new Date().toISOString(),
    };
  }

  movePaddle() {
    // Will emit events to backend
    if (this.movingUp) {
      this.gameService.sendPaddle(this.myUser.id, -gameConfig.paddle.step);
    }
    if (this.movingDown) {
      this.gameService.sendPaddle(this.myUser.id, gameConfig.paddle.step);
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
    //console.log('checking for gameover')
    if (!this.game) return false;
    return this.game.gameOver;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
