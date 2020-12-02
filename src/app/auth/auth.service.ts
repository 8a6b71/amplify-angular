import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Auth from '@aws-amplify/auth';

export interface AuthUsersState {
  isSignedIn: boolean;
  email: string | null;
}

const initialAuthState = {
  isSignedIn: false,
  email: null,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly authState = new BehaviorSubject<AuthUsersState>(initialAuthState);

  constructor() {}

  async initAuthState(): Promise<void> {
    await Auth.currentAuthenticatedUser().then((data) => {
      const { attributes } = data;
      const email = attributes ? attributes.email : null;
      this.authState.next({ isSignedIn: true, email });
    }).catch(() => {
      this.authState.next(initialAuthState);
    });
  }

  async isSignedId(): Promise<boolean> {
    try {
      return await Auth.currentAuthenticatedUser().then(() => {
        return true;
      });
    } catch (e) {
      return false;
    }
  }
}
