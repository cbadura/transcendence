// user-search.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { UserStatus } from 'src/app/shared/interfaces/userStatus';

@Component({
  selector: 'tcd-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
})
export class UserSearchComponent implements OnInit, OnDestroy {
  users: User[] = [];
  searchTerm: string = '';
    private statusSubscription!: Subscription;
  private statuses: UserStatus[] = [];
  @Output() userSelected = new EventEmitter<User>();
  @Output() closeClicked = new EventEmitter<void>();
  @Input() searchIds: number[] = [];
  @Input() onlyIds!: boolean;
  @Input() invitation: string = '';
  @Input() onlyOnline: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      if (this.onlyIds) {
        this.users = this.users.filter((user) =>
          this.searchIds.includes(Number(user.id)),
        );
		console.log(this.onlyIds, this.users);
      } else {
        this.users = this.users.filter(
          (user) => !this.searchIds.includes(Number(user.id)),
        );
		console.log(this.onlyIds, this.users);
      }
    });
	this.statusSubscription = this.userService.statusChatObs$.subscribe(
		(statuses) => {
		  this.statuses = statuses;
		},
	  );
  }

  getUserStatus(id: number) {
    const userStatus = this.statuses.find(
      (status) => status.userId === Number(id),
    );
    return userStatus ? userStatus.status : 'Offline';
  }

  get filteredUsers(): User[] {
    if (this.searchTerm === '') return [];
	if (this.onlyOnline) {
		return this.users.filter((user) =>
		  user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
		  this.getUserStatus(user.id) === 'Online',
		);
		}
    return this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  selectUser(user: User) {
    this.userSelected.emit(user);
  }

  closeUserPopup() {
    this.closeClicked.emit();
  }

  closePopup(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeUserPopup();
    }
  }

  ngOnDestroy(): void {
	this.statusSubscription.unsubscribe();
  }
}
