import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';

import { UserDataService } from '../../services/user-data.service';
import { GameService } from 'src/app/services/game.service';
import { gameConfig } from './gameConfig';
import { Render } from './Render/Render';
import {
  SaturatedColor,
  LightenDarkenColor,
} from 'src/app/shared/functions/color';
// import { GameControl } from './GameControl/GameControl'; //seems to not exist anymore

// Interfaces
import { User } from 'src/app/shared/interfaces/user';
import { Game } from 'src/app/shared/interfaces/game/Game';
import { Ball } from 'src/app/shared/interfaces/game/Ball';
import { Match } from 'src/app/shared/interfaces/match';
import { ESocketGameMessage } from 'src/app/shared/macros/ESocketGameMessage';

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private userSubscription!: Subscription;
  private gameSubscription!: Subscription;
  private startCountdownSubscription!: Subscription;
  public myUser!: User;
  public match!: Match;
  public status: string = 'new-game';

  // Render class
  private render!: Render;
  // GameControl class
  private game!: Game;

  // Paddle movement
  private movingUp: boolean = false;
  private movingDown: boolean = false;

  // Colors
  public saturatedColor!: string;
  public highLightColor: string = 'black';
  public darkerColor!: string;

  constructor(
    private userDataService: UserDataService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    // Get user data
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
      this.saturatedColor = SaturatedColor(this.myUser.color, 50);
      this.darkerColor = LightenDarkenColor(this.myUser.color, -10);
    });

    // Get game data
  }

  // Initialize canvas and render after view Init
  ngAfterViewInit(): void {
    // Initialize canvas
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  startGame(): void {
    console.log(this.myUser);
    this.status = 'waiting';
    this.gameService.createGameSocket(this.myUser.id);
    console.log('gameSocket created');

    this.gameService.subscribeToEvents();
    this.gameService.getEventData().subscribe((event) => {
      //   ROOM_CREATED
      if (event.eventType === ESocketGameMessage.ROOM_CREATED) {
        console.log('ROOM CREATED IN GAME COMPONENT');
        this.game = event.data.game;
        console.log(event.data);
        console.log(event.data.game.paddle1);
        console.log(event.data.game.paddle2);
        //Initialize render with game and users

        //   Initialize Render class - gameConfig should come from server
        this.render = new Render(this.ctx, this.myUser, gameConfig, event.data.userInfo.user1,  event.data.userInfo.user2);
        console.log('FINISHE ROOM CREATED');
      }

      //   START_COUNTDOWN
      if (event.eventType === ESocketGameMessage.START_COUNTDOWN) {
        console.log('START COUNTDOWN IN GAME COMPONENT');
        let countdown = event.data.countdown;
        console.log(countdown);
      }

      //   UPDATE_GAME_INFO
      if (event.eventType === ESocketGameMessage.UPDATE_GAME_INFO) {
        this.game = event.data.game;
        //console.log('status:', this.status);
        if (this.game && this.render) {
          this.movePaddle();
          if (!this.game.gameOver) {
            this.status = 'playing';
            this.render.redraw(this.game);
          } else {
            this.status = 'gameover';
            this.fillMatchData(this.game);
            return;
          }
        }
      }
    });
  }

  playAgain(): void {
    //clean up prev field
    this.status = 'new-game';
    this.game = {
      paddle1: 0,
      paddle2: 0,
      ball: {
        x: 0,
        y: 0,
        hits: 0,
      },
      score1: 0,
      score2: 0,
      gameOver: false,
    };
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
    if (event.key === 'ArrowUp') {
      this.movingUp = true;
    }
    if (event.key === 'ArrowDown') {
      this.movingDown = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.movingUp = false;
    }
    if (event.key === 'ArrowDown') {
      this.movingDown = false;
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
