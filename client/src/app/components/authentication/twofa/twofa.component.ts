import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'tcd-twofa',
  templateUrl: './twofa.component.html',
})
export class TwofaComponent implements OnInit {
  public animationClass: string = '';

  constructor(
    private userDataService: UserDataService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
	private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const firestInput =
      this.el.nativeElement.querySelector(`input:nth-child(1)`);
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
      event.preventDefault();
    }
  }

  handleSixDigits() {
    const allDigits: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const input = this.el.nativeElement.querySelector(
        `input:nth-child(${i})`,
      );
      if (input) {
        allDigits.push(input.value);
      }
    }
    const sixDigitCode = allDigits.join('');
    this.userDataService.verifyTFA(sixDigitCode).subscribe(
      (data) => {
        console.log(data);
        if (data.verified) {
		  this.cookieService.set('token', data.access_token);
          this.userDataService.getNewestUser();
          this.router.navigate(['/']);
        } else {
          this.animationClass = 'shake-horizontal';
          const divElement =
            this.el.nativeElement.querySelector('.animation-div');
          if (divElement) {
            divElement.addEventListener('animationend', () => {
              this.animationClass = '';
            });
          }
        }
      },
      (error) => {
        console.error('verifyTFA error:', error);
      },
    );
  }
}
