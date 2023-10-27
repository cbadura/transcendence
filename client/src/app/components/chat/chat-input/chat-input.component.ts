import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'tcd-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  @ViewChild('inputField') inputField!: ElementRef;
  @Output() sendMessage = new EventEmitter<string>();
  public popup: boolean = false;
  public tempUserChanges!: [{ id: number; change: string }];
  public invitedUsers!: User[];

  focusInputField() {
    this.inputField.nativeElement.focus();
  }

  onSendClick() {
    const message = this.inputField.nativeElement.value;
    this.sendMessage.emit(message);
    this.inputField.nativeElement.value = "";
  }

  onUserSelected(user: User) {
    this.closeUserPopup();
    this.editTempUserChanges(user.id, 'invite');
    this.invitedUsers.push(user);
  }

  editTempUserChanges = (id: number, mode: string) => {
    let index = this.tempUserChanges.findIndex(
      (change) => change.id === id && change.change === mode
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
}
