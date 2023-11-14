import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userDataService: UserDataService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (this.userDataService.isUserLoggedIn())
      return true;
    this.userDataService.getNewestUser();
    // await this.userDataService.CreateSocketConnections();
    return true;
  }
}
