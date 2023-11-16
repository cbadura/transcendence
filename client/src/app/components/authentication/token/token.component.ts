import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from 'src/app/services/user-data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'tcd-token',
  templateUrl: './token.component.html',
})
export class TokenComponent implements OnInit {
  public status!: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private userDataService: UserDataService,
	private cookieService: CookieService,
  ) {}

  ngOnInit() {
    this.status = 'loading';
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.http
        .get(`https://${import.meta.env['NG_APP_HOST_NAME']}:3000/auth/redirect?code=${code}`, { withCredentials: true })
        .subscribe(
          (response: any) => {
            console.log('login response', response);
            // const token = response.access_token;
            // if (token) {
             // this.userDataService.setToken(token);
			  // this.cookieService.set('token', token);
              if (response.verified) {
                this.userDataService.getNewestUser();
                this.router.navigate(['/']);
              } else {
                this.router.navigate(['/signin/2fa']);
              }
            // } else {
            //   // this.status = 'error';
            //   console.log('No token received in the response.');
            // }
          },
          (error) => {
            this.status = 'error';
            console.error('Error occurred while making the request:', error);
          },
        );
    } else {
      this.status = 'error';
      console.log('No code parameter found in the URL.');
    }
  }
}
