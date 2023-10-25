import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
	selector: 'tcd-token',
	templateUrl: './token.component.html'
  })
export class TokenComponent implements OnInit {
	public status! : string;
	constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,  private userDataService: UserDataService) {}
  
	ngOnInit() {
		this.status = 'loading';
	  const code = this.route.snapshot.queryParamMap.get('code');
  
	  if (code) {
		this.http.get(`http://localhost:3000/auth/redirect?code=${code}`).subscribe(
		  (response: any) => {
			const token = response.access_token;
				if (token) {
					//save token
				this.userDataService.setToken(token);
				const url = `http://localhost:3000/auth/profile?token=${token}`;
				this.http.get(url).subscribe(
					(response: any) => {
						const user: User = {
							id: response.id,
							name: response.name,
							status: response.status,
							level: response.level,
							matches: response.matches,
							wins: response.wins,
							color: response.color,
							avatar: response.avatar,
						};
						console.log('First user created!', user);
						this.userDataService.replaceUser(user);
						this.router.navigate(['/create-profile']);
					},
					(error) => {
						console.error('Error occurred while making the request:', error);
					}
				);
			  console.log('Token received in the response:', token);
			
			} else {
				this.status = 'error';
			  console.log('No token received in the response.');
			}
		  },
			(error) => {
				this.status = 'error';
			console.error('Error occurred while making the request:', error);
		  }
		);
	  } else {
		this.status = 'error';
		console.log('No code parameter found in the URL.');
	  }
	}
  }
  