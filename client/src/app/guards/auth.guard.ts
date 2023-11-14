import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userDataService: UserDataService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    console.log('Current URL', state.url);
    if (this.userDataService.isUserLoggedIn())
      return true;
    try {
      const user = await this.userDataService.getNewestUser();
    } catch(error) {
      if (state.url === '/')
        return true;
      this.router.navigate(['/']);
      return false;
    }
    // await this.userDataService.CreateSocketConnections();
    return true;
  }
}
