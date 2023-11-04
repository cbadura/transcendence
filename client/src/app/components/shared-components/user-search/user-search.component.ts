// user-search.component.ts
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'tcd-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
})
export class UserSearchComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  @Output() userSelected = new EventEmitter<User>();
  @Output() closeClicked = new EventEmitter<void>();
  @Input() searchIds: number[] = [];
  @Input() onlyIds!: boolean;
  @Input() invitation: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      //make this user have only users that have ids in searchIds
	  console.log('search ids',this.searchIds)

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
  }

  get filteredUsers(): User[] {
    if (this.searchTerm === '') return [];
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
}
