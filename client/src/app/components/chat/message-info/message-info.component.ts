import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/shared/interfaces/post';

@Component({
  selector: 'tcd-message-info',
  templateUrl: './message-info.component.html',
})
export class MessageInfoComponent {
  private serverAddress: string = `https://${import.meta.env['NG_APP_HOST_NAME']}:3000`;
  constructor(private http: HttpClient,private router: Router) {}
  ngOnInit(): void {}

@Input() post!: Post;
@Input() isMe!: boolean;

clickOnCard = (event: Event) => {
  if(this.isMe){ //right now do nothing, because you dont want to accidentally move to own profile
    // event.stopPropagation();
    // this.router.navigate(['profile',]);
  }
  else{
    // this.http.get(this.serverAddress + '/users/' + this.post.senderId, { withCredentials: true }).subscribe(
    //   (data) => {
    //     console.log('EDIT', JSON.stringify(data));
    //     console.log('data =',data)
    //     event.stopPropagation();
    //     // this.router.navigate(['profile', 'profile', data]); 
    //     this.router.navigate(['profile', this.post.senderId]);
        
    //   },
    //   (error) => {
    //     window.alert('Error editing user: ' + JSON.stringify(error));
    //   })
    this.router.navigate(['profile', this.post.senderId]);
  };
  }
}
