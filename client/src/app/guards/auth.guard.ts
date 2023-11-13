import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userDataService: UserDataService, private router: Router) {}

  canActivate(): boolean {
    if (this.userDataService.isUserLoggedIn()) {
      return true;
    } else {
      // Redirect to the login page if not logged in
      this.router.navigate(['/']);
      return false;
    }
  }
}
