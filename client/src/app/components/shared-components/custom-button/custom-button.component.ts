import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-custom-button',
  templateUrl: './custom-button.component.html'
})
export class CustomButtonComponent {
	@Input() buttonText: string = "buttonText";
	@Input() onClick?: () => void;
	@Input() customRoute?: string;
	@Input() isBlack: boolean = false;
	@Input() size: string = "small";
}
