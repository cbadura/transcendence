import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tcd-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  @ViewChild('inputField') inputField!: ElementRef;
  @Output() sendMessage = new EventEmitter<string>();


  focusInputField() {
    this.inputField.nativeElement.focus();
  }

  onSendClick() {
    const message = this.inputField.nativeElement.value;
    this.sendMessage.emit(message);
    this.inputField.nativeElement.value = "";
  }
}
