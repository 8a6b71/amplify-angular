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
    Auth.currentAuthenticatedUser()
      .then((user: any) => this.setUser(user))
      .catch(() => {
        this.authState.next(initialAuthState);
      });

    Hub.listen('auth', ({ payload: { event, data } }) => {
      if (event === 'signIn') {
        this.setUser(data);
      } else {
        this.authState.next(initialAuthState);
      }
    });
  }

  setUser(user: CognitoUserInterface): void {
    if (!user) {
      return;
    }

    const {
      attributes: { sub: id, email },
      username
    } = user;

    this.authState.next({ isLoggedIn: true, id, username, email });
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
    }
  }

  async signIn(username: string, password: string): Promise<CognitoUserInterface> {
    const user = await Auth.signIn(username, password) as CognitoUserInterface;
    this.setUser(user);
    return user;
  }

  async isSignedIn(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (e) {
      return false;
    }
  }
}
