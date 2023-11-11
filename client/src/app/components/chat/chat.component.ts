import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { UserDataService } from '../../services/user-data.service';
import { ChatHistoryService } from '../../services/chat-history.service';
import { ChannelService } from 'src/app/services/channel.service';
import { ESocketGameMessage } from 'src/app/shared/macros/ESocketGameMessage';
import { Post } from 'src/app/shared/interfaces/post';
import { User } from 'src/app/shared/interfaces/user';
import { Channel } from 'src/app/shared/chat/Channel';

@Component({
  selector: 'tcd-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesDiv') messagesDiv!: ElementRef;
  messages!: Post[];
  tempText!: string;
  private postSubscription!: Subscription;
  private userSubscription!: Subscription;
  private gameSubscription!: Subscription;
  public gameType: 'default' | 'special' = 'default';
  private roomId: number = 0;
  public ownerLeavePopup: boolean = false;
  public isDM: boolean = false;

  myUser!: User;
  channel!: Channel;
  user!: User;

  constructor(
    public datepipe: DatePipe,
    private chatHistoryService: ChatHistoryService,
    private userDataService: UserDataService,
    private gameService: GameService,
    private channelService: ChannelService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.messages = [];
  }

  ngOnInit() {
    this.userSubscription = this.userDataService.user$.subscribe((user) => {
      this.myUser = user;
    });
    // Get params from URL
    this.route.params.subscribe((params) => {
      const { channel, ...rest } = params;
      console.log('params', params);
      console.log('channel', channel);
      if (channel === 'dm') this.isDM = true;

      if (this.isDM) {
        this.user = rest as User;
        this.user.id = Number(this.user.id);
        this.user.level = Number(this.user.level);
        this.user.wins = Number(this.user.wins);
        this.user.matches = Number(this.user.matches);
      } else {
        this.channel = rest as Channel;
        this.channel.usersIds = params['usersIds']
          ?.split(',')
          .map((num: string) => +num);
        console.log('channel from params', this.channel);
      }
    });
    // Unsubscribe from any previous subscription
    // if (this.postSubscription) {
    //   this.postSubscription.unsubscribe();
    // }
    if (this.isDM) {
	this.postSubscription = this.chatHistoryService
	  .getChatObservableForDM(this.user.id)
	  .subscribe((posts) => {
		this.messages = posts;
	  });
    } else {
      // Subscribe to the chat history for the new channel
      this.postSubscription = this.chatHistoryService
        .getChatObservableForChannel(this.channel.name)
        .subscribe((posts) => {
          this.messages = posts;
        });

      this.gameSubscription = this.gameService.event$.subscribe(
        (event: any) => {
          if (
            event &&
            event.eventType === ESocketGameMessage.RECEIVE_ROOM_INVITE
          ) {
            console.log('Invitation received:', event.data);
            this.gameType = event.data.data.gameType;
            this.roomId = event.data.data.room_id;
            const newPost = {
              senderId: event.data.data.inviting_user.id,
              senderName: event.data.data.inviting_user.name,
              senderColor: event.data.data.inviting_user.color,
              senderAvatar: event.data.data.inviting_user.avatar,
              message: event.data.data.gameType,
              channel: this.channel.name,
              timestamp:
                this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ??
                '',
              gameInvite: true,
            };
            console.log('adding post to chat histor');
            this.chatHistoryService.addPost(this.channel.name, newPost);
          }
        },
      );
    }
  }

  acceptInvitation() {
    console.log('INVITE ACCEPTED', this.myUser.id, this.gameType);
    this.gameService.JoinRoom(this.roomId, true);
    let invite = {
      gameType: this.gameType,
    };
    this.router.navigate(['game', 'invite', invite]);
  }

  tryLeaveChannel() {
    if (this.channel.role !== 'owner') this.leaveChannel();
    else this.ownerLeavePopup = true;
  }

  transferOwnership(id: number) {
    this.channelService.leaveChannel(this.channel.name, 'keep', id);
    this.router.navigate(['channels']);
  }

  closeLeavePopup() {
    this.ownerLeavePopup = false;
  }

  leaveChannel() {
    this.channelService.leaveChannel(this.channel.name, 'delete');
    this.router.navigate(['channels']);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messagesDiv.nativeElement.scrollTop =
        this.messagesDiv.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  savePost(message: string) {
	const newPost: {
	  message: string;
	  senderAvatar: string;
	  timestamp: string;
	  receiverId?: number;
	  channel?: string;
	} = {
	  message: message,
	  senderAvatar: '',
	  timestamp: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ?? '',
	};
  
	if (this.isDM) {
	  newPost.receiverId = this.user.id;
	} else {
	  newPost.channel = this.channel.name;
	}
  
	this.chatHistoryService.sendMessage(newPost);
  }
  

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.gameSubscription) this.gameSubscription.unsubscribe();
    if (this.postSubscription) this.postSubscription.unsubscribe();
  }
}
