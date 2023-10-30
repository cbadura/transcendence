import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { CanComponentDeactivate } from 'src/app/guards/can-deactivate.guard';
import { UserDataService } from '../../services/user-data.service';
import { GameService } from 'src/app/services/game.service';
import { Render } from './Render/Render';
import {
  SaturatedColor,
  LightenDarkenColor,
} from 'src/app/shared/functions/color';
// import { GameControl } from './GameControl/GameControl'; //seems to not exist anymore

// Interfaces
import { User } from 'src/app/shared/interfaces/user';
import { Match } from 'src/app/shared/interfaces/match';
import { ESocketGameMessage } from 'src/app/shared/macros/ESocketGameMessage';
import { GameRenderInfo } from 'src/app/components/game/Render/GameRenderInfo';

@Component({
  selector: 'tcd-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements CanComponentDeactivate {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private userSubscription!: Subscription;
  public myUser!: User;
  public match!: Match;
  public status: string = 'new-game';

  // Render class
  private render!: Render;
  // GameControl class
  // private game!: Game;
  private gameRenderInfo!: GameRenderInfo;

  private gameType: 'default' | 'special' = 'default';

  // Paddle movement
  private movingUp: boolean = false;
  private movingDown: boolean = false;

  // Colors
  public saturatedColor!: string;
  public highLightColor: string = 'black';
  public darkerColor!: string;
  private gameSubscription!: Subscription;

  constructor(
    private userDataService: UserDataService,
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get user data
    // this.gameService.gameSocket = this.userDataService.gameSocket;
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
      this.saturatedColor = SaturatedColor(this.myUser.color, 50);
      this.darkerColor = LightenDarkenColor(this.myUser.color, -10);
    });

    // Get params from URL
    this.route.params.subscribe(params => {
      if (params) {
        console.log('START FROM INVITE');
        this.gameType = params['gameType'];
        this.status = 'waiting';
        this.gameService.JoinQueue(this.myUser.id, this.gameType);
        this.subscribeToEventObject();
      }
    });

    // Get game data
  }

  // Initialize canvas and render after view Init
  ngAfterViewInit(): void {
    // Initialize canvas
    this.ctx = this.canvas.nativeElement.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.status === 'waiting' || this.status === 'playing') {
      const navigate = window.confirm(
        'Are you sure you want to leave the game?',
      );
      if (navigate) {
        this.gameService.leaveMatch();
        return true;
      } else return false;
    }
    return true;
  }

  startTrainingGame() {
    // this.gameService.subscribeToEventObject();
    //make request to create room
    this.gameService.CreateTrainingMatch('special');
    this.subscribeToEventObject();
  }

  startGame(gameType: 'default' | 'special'): void {
    this.gameType = gameType;
    this.status = 'waiting';
    this.gameService.JoinQueue(this.myUser.id, gameType);
    this.subscribeToEventObject();
  }

  subscribeToEventObject() {
    this.gameSubscription = this.gameService.event$.subscribe((event) => {
      if (!event) return;
      if (event.eventType === ESocketGameMessage.LOBBY_COMPLETED) {
        this.gameRenderInfo = event.data.game;
        this.render = new Render(
          this.ctx,
          this.gameRenderInfo,
          event.data.userInfo.user1,
          event.data.userInfo.user2,
          this.myUser.id,
        );
      }

      //   START_COUNTDOWN
      if (event.eventType === ESocketGameMessage.START_COUNTDOWN) {
        console.log('START COUNTDOWN IN GAME COMPONENT');
        console.log(event.data);
        this.status = 'playing';
        this.render.setCountdown(event.data.countdown);
        //let countdown = event.data.countdown;
      }

      //   UPDATE_GAME_INFO
      if (event.eventType === ESocketGameMessage.UPDATE_GAME_INFO) {
        this.gameRenderInfo = event.data.gameRenderInfo;
        if (this.gameRenderInfo && this.render) {
          this.movePaddle();
          if (!this.gameRenderInfo.gameOver) {
            this.render.redraw(this.gameRenderInfo);
          } else {
            console.log('gameover');
            this.status = 'gameover';
            this.fillMatchData(this.gameRenderInfo);
            return;
          }
        }
      }

      // GAME_ABORTED
      if (event.eventType === ESocketGameMessage.GAME_ABORTED) {
        this.status = 'aborted';
        console.log('GAME_ABORTED', event.data);
      }
    });
  }

  //right now this play again will just queue up the user again.
  // later we probably want to enable users to play agains the same opponent again
  playAgain(): void {
    //clean up prev field
    this.status = 'new-game';
    this.render.reset();
    this.startGame(this.gameType);
  }

  fillMatchData(game: GameRenderInfo): void {
    this.match = {
      opponent: this.myUser, //change to real opponent
      myScore: game.paddles[0].score,
      opponentScore: game.paddles[1].score,
      dateTime: new Date().toISOString(),
    };
  }

  leaveQueue() {
    this.gameService.leaveQueue();
    this.status = 'new-game';
  }

  movePaddle() {
    // Will emit events to backend
    if (this.movingUp) {
      this.gameService.sendPaddle(this.myUser.id, -1);
    }
    if (this.movingDown) {
      this.gameService.sendPaddle(this.myUser.id, 1);
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
    console.log('NG ON DESTROY CALLED ');
    this.userSubscription.unsubscribe();
    if (this.gameSubscription) this.gameSubscription.unsubscribe();
  }
}
