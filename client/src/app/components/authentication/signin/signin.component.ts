import { Component } from '@angular/core';

@Component({
  selector: 'tcd-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {


	redirectToLogin() {
		window.location.href = `http://${import.meta.env['HOST']}:3000/auth/login`;
	}
}
