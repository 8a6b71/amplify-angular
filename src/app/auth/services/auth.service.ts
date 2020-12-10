import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hub } from '@aws-amplify/core';
import { Auth, CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
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
  private readonly authState = new BehaviorSubject<CurrentAuthState>(initialAuthState);

  readonly authState$ = this.authState.asObservable();
  readonly isLoggedIn$ = this.authState$.pipe(map(state => state.isLoggedIn));
  private isStateSubscriptionActive = false;

  constructor() {
    this.updateAuthState();
  }

  initStateChangeSubscription(): void {
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

  async federatedSignIn(provider: CognitoHostedUIIdentityProvider): Promise<void> {
    await Auth.federatedSignIn({provider});
  }

  private async syncStateOnAuthEvent(state: AuthStateEvents): Promise<void> {
    switch (state) {
      case AuthStateEvents.SignIn:
      case AuthStateEvents.OAuthSignOut:
      case AuthStateEvents.SignOut:
        await this.updateAuthState();
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
