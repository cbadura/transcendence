import { Component } from '@angular/core';

@Component({
  selector: 'tcd-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {


	redirectToLogin() {
		window.location.href = `https://${import.meta.env['NG_APP_HOST_NAME']}:3000/auth/login`;
	}
}
