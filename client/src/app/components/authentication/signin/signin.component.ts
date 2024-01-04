import { Component } from '@angular/core';

@Component({
  selector: 'tcd-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {


	redirectToLogin() {
		window.location.href = `http://localhost:3000/auth/login`;
	}
}
