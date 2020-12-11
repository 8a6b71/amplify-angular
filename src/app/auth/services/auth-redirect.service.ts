import { Injectable, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthState } from '@aws-amplify/ui-components';
import { Hub } from '@aws-amplify/core';

import { AuthStateEvents } from '../enums/auth-state-events.enum';
import { authStateToPath, authUIStateToPath } from '../../constansts/auth-state-to-path.const';
import has from 'lodash/has';

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
      this.ngZone.run(() => {
        this.router.navigate([path]);
      });
    }
  }
}
