import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';
import Auth from '@aws-amplify/auth';
import { map } from 'rxjs/operators';
import { AuthState, CognitoUserInterface } from '@aws-amplify/ui-components';
import { Hub } from '@aws-amplify/core';

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

  constructor() {
    this.updateUserData();

    Hub.listen('auth', ({ payload: { event, data } }) => {
      this.onAuthStateChange(event);
    });
  }

  getPathOnAuthStage(authState: AuthState): string {
    switch (authState) {
      case AuthState.SignIn:
        return '/sign-in';

      case AuthState.SignUp:
        return '/sign-up';

      case AuthState.ConfirmSignUp:
        return '/confirm-sign-up';

      case AuthState.SignedOut:
        return '/sign-in';

      case AuthState.ForgotPassword:
        return '/forgot-password';

      case AuthState.SignedIn:
        return '';

      default:
        return '';
    }
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

  private onAuthStateChange(event): void {
    switch (event) {
      case 'signIn':
        this.updateUserData();
        break;
      case 'cognitoHostedUI':
        this.updateUserData();
        break;
      case 'signOut':
        this.authState.next(initialAuthState);
        break;
      case 'oAuthSignOut':
        this.authState.next(initialAuthState);
        break;
      default:
        this.updateUserData();
        break;
    }
  }

  private updateUserData(): void {
    Auth.currentAuthenticatedUser()
      .then((user: CognitoUserInterface) => this.setUser(user))
      .catch(() => {
        this.authState.next(initialAuthState);
      });
  }

  private setUser(user: CognitoUserInterface): void {
    if (!user) {
      return;
    }

    const {
      attributes: { sub: id, email },
      username
    } = user;

    this.authState.next({ isLoggedIn: true, id, username, email });
  }
}
