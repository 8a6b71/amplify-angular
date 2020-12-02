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
    onAuthUIStateChange((authState, authData) => {
      const userData = authData as CognitoUserInterface;
      this.authService.currentUser.next(userData);
      this.navigateOnAuthStateChange(authState);
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): (authStateHandler) => void {
    return onAuthUIStateChange;
  }

  private navigateOnAuthStateChange(authState: AuthState): void {
    if (authState === AuthState.SignedIn) {
      this.router.navigate(['']);
    }

    if (authState === AuthState.SignedOut) {
      this.router.navigate(['/sign-in']);
    }
  }
}
