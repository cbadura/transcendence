import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'tcd-activate-twofa',
  templateUrl: './activate-twofa.component.html',
})
export class ActivateTwofaComponent implements OnInit {
  @Output() closeClicked = new EventEmitter<void>();
  @Input() user!: User;
  public verified: boolean = false;
  public animationClass : string = '';
  constructor(
    private userDataService: UserDataService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}
  ngOnInit(): void {
    this.userDataService.getQRCode();
    console.log('user', this.user);
  }

  closeTwoFAPopup() {
    this.closeClicked.emit();
  }

  closePopup(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeTwoFAPopup();
    }
  }

  onKeyUp(index: number, event: any) {
    if (event.target.value.length === 1) {
      if (index < 6) {
        const nextInput = this.el.nativeElement.querySelector(
          `input:nth-child(${index + 1})`,
        );
        if (nextInput) {
          this.renderer.selectRootElement(nextInput).focus();
        }
      } else {
        // All six digits are filled, trigger your function
        this.handleSixDigits();
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
    }
  }

  handleSixDigits() {
	const allDigits: string[] = [];
  	for (let i = 1; i <= 6; i++) {
	  const input = this.el.nativeElement.querySelector(`input:nth-child(${i})`);
	  if (input) {
		allDigits.push(input.value);
	  }
	}
  	const sixDigitCode = allDigits.join('');
	  this.userDataService.submit2fa(sixDigitCode).subscribe(
		(data) => {
		  this.verified = data.verified;
		  if (data.verified === false) {
			this.animationClass = 'shake-horizontal';
		
			const divElement = this.el.nativeElement.querySelector('.animation-div');
			if (divElement) {
			  divElement.addEventListener('animationend', () => {
				this.animationClass = '';
			  });
			}
		  }
		},
		(error) => {
		  console.error('Submit2fa error:', error);
		}
	  );

  }
}
