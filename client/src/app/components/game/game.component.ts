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
import { Match, MatchUser } from 'src/app/shared/interfaces/match';
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
  private paddle!: number;
  public match!: Match | null;
  public opponent: User | null = null;
  public resultString: string = 'notset';
  public status: string = 'new-game';
  private render!: Render | null;
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
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
      this.saturatedColor = SaturatedColor(this.myUser.color, 50);
      this.darkerColor = LightenDarkenColor(this.myUser.color, -10);
    });

    // Get params from URL
    this.route.params.subscribe(params => {
      if (params['gameType']) {
        console.log('START FROM INVITE');
        this.gameType = params['gameType'];
        this.status = 'waiting';
        this.subscribeToEventObject();
      }
    });
  }

  // Initialize canvas after view Init
  ngAfterViewInit(): void {
    // Initialize canvas
    this.ctx = this.canvas.nativeElement.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.status === 'waiting' || this.status === 'playing' || this.status === 'gameover') {
      const navigate = window.confirm(
        'Are you sure you want to leave the game?',
      );
      if (navigate) {
        this.cleanUpPrevMatch();
        console.log('navigating boiiiiiiiiiiiii')
		    this.status === 'playing' || this.status === 'gameover' ?  this.gameService.leaveMatch() : this.gameService.leaveQueue() ;
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
		this.myUser.id === event.data.userInfo.user1.id ? this.paddle = 1 : this.paddle = 2;
		this.myUser.id === event.data.userInfo.user1.id ? this.opponent = event.data.userInfo.user2 : this.opponent = event.data.userInfo.user1;
      }

      //   START_COUNTDOWN
      if (event.eventType === ESocketGameMessage.START_COUNTDOWN) {
        console.log('START COUNTDOWN IN GAME COMPONENT');
        console.log(event.data);
        this.status = 'playing';
        this.render?.setCountdown(event.data.countdown);
      }

      //   UPDATE_GAME_INFO
      if (event.eventType === ESocketGameMessage.UPDATE_GAME_INFO) {
        this.gameRenderInfo = event.data.gameRenderInfo;
        if (this.gameRenderInfo && this.render) {
			this.movePaddle();
			if (!this.gameRenderInfo.gameOver) {
				this.render.redraw(this.gameRenderInfo);
			} 
        }
      }

      if (event.eventType === ESocketGameMessage.GAME_ENDED) {
        console.log('GAME ENDED EVENT CALLED',event.data)
        this.match = {...event.data.match};
        let oppArrId = 0;
        if(this.match?.matchUsers[0].user.id == this.myUser.id){
          oppArrId = 1;
        }
        this.opponent = this.match?.matchUsers[oppArrId].user ? this.match?.matchUsers[oppArrId].user : null;
        this.resultString = this.match?.matchUsers[oppArrId].outcome ? 'YOU LOOSE' : 'YOU WIN';
        this.status = 'gameover'; 
      }

      // GAME_ABORTED
      if (event.eventType === ESocketGameMessage.GAME_ABORTED) {
        this.status = 'aborted';
        console.log('GAME_ABORTED', event.data);
      }

	// OPP_PLAY_AGAIN
	if (event.eventType === ESocketGameMessage.OPP_PLAY_AGAIN) {
		if (this.status === 'gameover') this.status = 'rematch';
        console.log('OPP_PLAY_AGAIN');
      }
    });
  }

  returnToGameSelectionScreen(){
    this.gameService.leaveMatch();
    this.cleanUpPrevMatch();
  }

  //right now this play again will just queue up the user again.
  cleanUpPrevMatch(): void {
    //clean up prev field
    this.status = 'new-game';
	this.gameType = 'default';
	this.match = null;
	this.opponent = null;
	this.render = null;
	this.paddle = 0;
  if (this.gameSubscription) this.gameSubscription.unsubscribe();
  }

  rematch(): void {
	this.gameService.playAgain();
	this.status = 'sent-rematch';
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
