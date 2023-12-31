import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tcd-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;
  @Output() sendMessage = new EventEmitter<string>();
  @Input() userIds: number[] = [];
  public popup: boolean = false;
  public typePopup: boolean = false;
  public tempUserChanges!: [{ id: number; change: string }];
  public gameType: 'default' | 'special' = 'default';
  private invitedUser!: User;
  user!: User;
  public isDM: boolean = false;

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.tempUserChanges = [{ id: 0, change: '' }];
    this.route.params.subscribe((params) => {
      const { channel, ...rest } = params;
      console.log('channel in header', channel);
      if (channel === 'dm') {
        this.isDM = true;
        this.user = rest as User;
        this.user.id = Number(this.user.id);
        this.user.level = Number(this.user.level);
        this.user.wins = Number(this.user.wins);
        this.user.matches = Number(this.user.matches);
      }
    });
  }

  focusInputField() {
    this.inputField.nativeElement.focus();
  }

  onSendClick() {
    const message = this.inputField.nativeElement.value;
    this.sendMessage.emit(message);
    this.inputField.nativeElement.value = '';
  }

  onUserSelected(user: User) {
    this.invitedUser = user;
    this.closeUserPopup();
    this.openTypePopup();
  }

  setGameType(gameType: string) {
    if (gameType === 'default') {
      this.gameType = 'default';
    } else {
      this.gameType = 'special';
    }
    this.closeTypePopup();
    this.gameService.InviteToMatch(this.gameType, this.invitedUser.id);
    let invite = {
      gameType: this.gameType,
    };
    this.router.navigate(['game', 'invite', invite]);
  }

  editTempUserChanges = (id: number, mode: string) => {
    let index = this.tempUserChanges.findIndex(
      (change) => change.id === id && change.change === mode,
    );
    if (index !== -1) {
      this.tempUserChanges.splice(index, 1);
    } else {
      this.tempUserChanges.push({ id: id, change: mode });
    }
  };

  openUserPopup() {
	this.popup = true;
  }

  closeUserPopup() {
    this.popup = false;
  }

  openTypePopup() {
    this.typePopup = true;
  }

  closeTypePopup() {
    this.typePopup = false;
  }
}
