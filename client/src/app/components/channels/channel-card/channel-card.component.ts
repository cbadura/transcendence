import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Channel } from 'src/app/shared/chat/Channel';
import { Router } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { EChannelMode } from 'src/app/shared/macros/EChannelMode';

@Component({
  selector: 'tcd-channel-card',
  templateUrl: './channel-card.component.html',
})
export class ChannelCardComponent {
  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;
  @Input() channel!: Channel;
  @Input() editMode: boolean = false;
  @Input() joinMode: boolean = false;
  constructor(
    private router: Router,
    private channelService: ChannelService,
    private renderer2: Renderer2,
  ) {}
  public tempPassword: string = '';
  public passwordField: boolean = false;

  navigateToEditChannel(event: Event, channel: Channel) {
    event.stopPropagation(); // Stop event propagation
    this.router.navigate(['channels/edit', 'channel', channel]);
  }

  navigateToChat(event: Event, channel: Channel) {
    event.stopPropagation(); // Stop event propagation
    // console.log('Navigating to chat: ');
    //console.log editmode and joinmode
    console.log('edit', this.editMode);
    console.log('join', this.joinMode);
    if (this.joinMode) {
      this.joinChannel(event);
      return;
    } else this.router.navigate(['chat', 'type', channel]);
  }

  showPasswordField() {
    this.passwordField = true;
    setTimeout(() => {
      this.renderer2
        .selectRootElement(this.passwordInput.nativeElement)
        .focus();
    });
  }

  hidePasswordField(event: Event) {
    event.stopPropagation();
    this.passwordField = false;
    this.tempPassword = '';
  }

  submitPassword(event: Event) {
    event.stopPropagation();
    this.tryJoinChanel();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.hidePasswordField(event);
    } else if (event.key === 'Enter') {
      this.submitPassword(event);
    }
  }

  joinChannel(event: Event) {
    event.stopPropagation(); // Stop event propagation
    console.log('Joining channel: ' + this.channel);
    let value: string | null = '';
    if (this.channel.mode === EChannelMode.PROTECTED) this.showPasswordField();
    else this.tryJoinChanel();
  }

  tryJoinChanel() {
    this.channelService.joinChannel(this.channel, this.tempPassword);
  }
}
