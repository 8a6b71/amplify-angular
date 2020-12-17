import { Injectable, NgZone } from '@angular/core';
import { Auth } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateEvents } from '../enums/auth-state-events.enum';

export interface CurrentAuthState {
  isLoggedIn: boolean;
  username: string | null;
  id: string | null;
  email: string | null;
}

const initialAuthState: CurrentAuthState = {
  isLoggedIn: false,
  username: null,
  id: null,
  email: null
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // make it changable only by service itself, to guarantee single source of truth
  private readonly authState = new BehaviorSubject<CurrentAuthState>(initialAuthState);

  readonly authState$ = this.authState.asObservable();
  readonly isLoggedIn$ = this.authState$.pipe(map(state => state.isLoggedIn));
  private isStateSubscriptionActive = false;

  constructor(private readonly ngZone: NgZone) {
    this.updateAuthState();
  }

  // add a control when exactly start subscription, avoid placing it in the constructor
  initStateChangeSubscription(): void {
    // avoid double subscription
    if (this.isStateSubscriptionActive) {
      return;
    }

    Hub.listen('auth', async ({ payload: { event}}) => {
      await this.syncStateOnAuthEvent(event as AuthStateEvents);
    });

    this.isStateSubscriptionActive = true;
  }

  /**
   * Recommended to be used in guards.
   * In other cases please use property `isLoggedIn$` {@link AuthService#isLoggedIn$}
   */
  async isSignedIn(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (e) {
      return false;
    }
  }

  private syncStateOnAuthEvent(state: AuthStateEvents): void {
    switch (state) {
      case AuthStateEvents.SignIn:
      case AuthStateEvents.OAuthSignOut:
      case AuthStateEvents.SignOut:
        this.ngZone.run(async () => await this.updateAuthState());
        break;
    }
  }

  private async updateAuthState(): Promise<void> {
    try {
      const user = await Auth.currentUserInfo();

      if (user) {
        const {
          attributes: { sub: id, email },
          username
        } = user;

        this.authState.next({ isLoggedIn: true, username, email, id });
      } else {
        this.authState.next(initialAuthState);
      }
    } catch (e) {
      this.authState.next(initialAuthState);
    }
  }
}
