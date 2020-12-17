import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean|UrlTree> {

    // Hub has a delay, immidiate state coudle be chacked from `Auth`
    // (decreas a chance of reacting to extra state changes)
    const isSignedIn = await this.authService.isSignedIn();

    return isSignedIn
      ? true
      : this.router.parseUrl('/sign-in');
  }
}
