// user-search.component.ts
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  get filteredUsers(): User[] {
    if (this.searchTerm === '') return [];
    return this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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
