import {Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../shared/interfaces/user';

@Component({
  selector: 'tcd-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
	myUser!: User;
	noUser: boolean = true;
  private userSubscription!: Subscription;

  constructor(private userDataService: UserDataService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userDataService.user$.subscribe(
      (user) => {
			this.myUser = user;
			console.log('Body component user:', user);
			if (this.myUser && this.myUser.id != 0) this.noUser = false;
			console.log('Body component noUser:', this.noUser);
      this.elementRef.nativeElement.ownerDocument
        .body.style.backgroundColor = this.myUser.color;
      }
    );
  }

  ngOnDestroy(): void {
	this.userSubscription.unsubscribe();
  }
}
