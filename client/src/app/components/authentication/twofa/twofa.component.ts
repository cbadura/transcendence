import {
	Component,
	ElementRef,
	Renderer2,
	OnInit
  } from '@angular/core';
  import { UserDataService } from 'src/app/services/user-data.service';
@Component({
  selector: 'tcd-twofa',
  templateUrl: './twofa.component.html'
})
export class TwofaComponent implements OnInit {
	constructor(    private userDataService: UserDataService,
		private renderer: Renderer2,
		private el: ElementRef,) {}

	ngOnInit(): void {
		const firestInput = this.el.nativeElement.querySelector(
			`input:nth-child(1)`,
		  );
		  if (firestInput) {
			this.renderer.selectRootElement(firestInput).focus();
		  }
	}

	onKeyUp(index: number, event: any) {
		if (event.key === 'Backspace') {
		  return;
		}
		if (event.target.value.length === 1) {
		  if (index < 6) {
			const nextInput = this.el.nativeElement.querySelector(
			  `input:nth-child(${index + 1})`,
			);
			if (nextInput) {
			  this.renderer.selectRootElement(nextInput).focus();
			}
		  } else {
			//this.handleSixDigits();
		  }
		}
	  }
	
	  onKeyDown(index: number, event: KeyboardEvent) {
		if (event.key === 'Backspace' && index > 1) {
		  const currentInput = this.el.nativeElement.querySelector(
			`input:nth-child(${index})`,
		  );
		  const prevInput = this.el.nativeElement.querySelector(
			`input:nth-child(${index - 1})`,
		  );
		  if (currentInput) {
			this.renderer.selectRootElement(currentInput).value = '';
		  }
		  if (prevInput) {
			this.renderer.selectRootElement(prevInput).focus();
		  }
		  event.preventDefault();
		}
	  }
}
