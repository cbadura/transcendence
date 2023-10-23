import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'tcd-token',
	templateUrl: './token.component.html',
	styleUrls: ['./token.component.css']
  })
  export class TokenComponent implements OnInit {
	constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
	ngOnInit() {
	  const code = this.route.snapshot.queryParamMap.get('code');
  
	  if (code) {
		this.http.get(`http://localhost:3000/auth/redirect?code=${code}`).subscribe(
		  (response: any) => {
			const token = response.access_token;
			if (token) {
			  console.log('Token received:', token);
			} else {
			  console.log('No token received in the response.');
			}
		  },
		  (error) => {
			console.error('Error occurred while making the request:', error);
		  }
		);
	  } else {
		console.log('No code parameter found in the URL.');
	  }
	}
  }
  