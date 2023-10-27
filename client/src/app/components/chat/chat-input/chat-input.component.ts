import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { User } from 'src/app/shared/interfaces/user';


@Component({
  selector: 'tcd-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;
  @Output() sendMessage = new EventEmitter<string>();
  @Input() userIds: number[] = [];
  public popup: boolean = false;
  public tempUserChanges!: [{ id: number; change: string }];

  ngOnInit() {
    console.log('INPUT USERS', this.userIds);
    this.tempUserChanges = [{ id: 0, change: '' }];
  }

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
    console.log(this.tempUserChanges);
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
