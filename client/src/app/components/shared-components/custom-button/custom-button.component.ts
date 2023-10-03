import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css']
})
export class CustomButtonComponent {
	@Input() buttonText: string = "Default Button Text";
	@Input() onClick?: () => void;
	@Input() customRoute?: string;
	@Input() isBlack: boolean = false;
}
