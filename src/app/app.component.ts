import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuthState, CognitoUserInterface, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly authService: AuthService,
    private readonly ref: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initAuthState();
  }

  ngOnDestroy(): (authStateHandler) => void {
    return onAuthUIStateChange;
  }

  private async initAuthState(): Promise<void> {
    await this.authService.initAuthState();
    const previousIsSignInState = await this.authService.isSignedId();

    await onAuthUIStateChange((authState, authData) => {
      const currentState = authState === AuthState.SignedIn;
      const data = authData as CognitoUserInterface;
      const email = data && data.attributes ? data.attributes.email : null ;

      this.authService.authState.next({
        isSignedIn: currentState,
        email
      });

      this.navigateOnAuthStateChange(previousIsSignInState, authState);
      this.ref.detectChanges();
    });
  }

  private navigateOnAuthStateChange(previousState: boolean, authState: AuthState): void {
    if (!previousState && authState === AuthState.SignedIn) {
      this.router.navigate(['']);
    }

    if (previousState && authState === AuthState.SignedOut) {
      this.router.navigate(['/sign-in']);
    }
  }
}
