import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Hub } from '@aws-amplify/core';
import { AuthState } from '@aws-amplify/ui-components';
import { has } from 'lodash';
import { authStateToPath, authUIStateToPath } from '../../constansts/auth-state-to-path.const';
import { AuthStateEvents } from '../enums/auth-state-events.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {
  private isStateSubscriptionActive = false;

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {}

  initStateChangeSubscription(): void {
    if (this.isStateSubscriptionActive) {
      return;
    }

    Hub.listen('UI Auth', ({ payload: { message} }) => {
      if (message) {
        this.navigateOnUIAuthStateChange(message as AuthState);
      }
    });

    Hub.listen('auth', ({ payload: { event}}) => {
      this.navigateOnAuthStateChange(event as AuthStateEvents);
    });

    this.isStateSubscriptionActive = true;
  }

  private navigateOnUIAuthStateChange(state: AuthState): void {
    if (has(authUIStateToPath, state)) {
      const path = authUIStateToPath[state];
      this.ngZoneNavigate(path);
    }
  }

  private navigateOnAuthStateChange(state: AuthStateEvents): void {
    if (has(authStateToPath, state)) {
      const path = authStateToPath[state];
      this.ngZoneNavigate(path);
    }
  }

  private ngZoneNavigate(path: string): void {
    if (this.location.path() !== path) {
      // required because triggered by Event buz out of Angular event loop
      this.ngZone.run(() => {
        this.router.navigate([path]);
      });
    }
  }
}
