import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthState } from '@aws-amplify/ui-components';
import { Hub } from '@aws-amplify/core';
import { Auth, CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { AuthStateEvents } from './enums/auth-state-events.enum';
import { authStateToPathMap, authUIStateToPathMap } from '../constansts/auth-state-to-path-map.const';

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

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {}

  async initHubListen(): Promise<void> {
    await this.updateAuthState();

    Hub.listen('UI Auth', ({ payload: { message} }) => {
      if (message) {
        this.onUIAuthStateChange(message as AuthState);
      }
    });

    Hub.listen('auth', async ({ payload: { event}}) => {
      await this.onAuthStateEventChange(event as AuthStateEvents);
    });
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

  private onUIAuthStateChange(state: AuthState): void {
    if (authUIStateToPathMap.has(state)) {
      const path = authUIStateToPathMap.get(state);
      this.ngZoneNavigate(path);
    }
  }

  private async onAuthStateEventChange(state: AuthStateEvents): Promise<void> {
    if (authStateToPathMap.has(state)) {
      switch (state) {
        case AuthStateEvents.SignIn:
          await this.updateAuthState();
          break;
        case AuthStateEvents.OAuthSignOut:
          this.authState.next(initialAuthState);
          break;
        case AuthStateEvents.SignOut:
          this.authState.next(initialAuthState);
          break;
      }

      const path = authStateToPathMap.get(state);
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
