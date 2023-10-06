import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'tcd-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  @ViewChild('inputField') inputField!: ElementRef;


  focusInputField() {
    this.inputField.nativeElement.focus();
  }
}
