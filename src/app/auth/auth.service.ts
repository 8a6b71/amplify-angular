import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import Auth from '@aws-amplify/auth';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map } from 'rxjs/operators';
import { CognitoUserInterface } from '@aws-amplify/ui-components';

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
}
