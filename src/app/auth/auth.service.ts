import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import Auth from '@aws-amplify/auth';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';
import { AuthState, CognitoUserInterface } from '@aws-amplify/ui-components';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly currentUser: BehaviorSubject<CognitoUserInterface | null> = new BehaviorSubject<CognitoUserInterface | null>(null);

  constructor() {}

  isSignedIn(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map((result) => {
          this.loggedIn.next(true);
          const userData = result as CognitoUserInterface;
          this.currentUser.next(userData);
          return true;
        }),
        catchError(() => {
          this.loggedIn.next(false);
          this.currentUser.next(null);
          return of(false);
        })
      );
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
    this.currentUser.next(user);
    return user;
  }
}
