import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuthState, CognitoUserInterface, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isSignedIn = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly location: Location,
    private readonly ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    onAuthUIStateChange((authState, authData) => {
      const userData = authData as CognitoUserInterface;
      this.authService.currentUser.next(userData);
      this.navigateOnAuthStateChange(authState);
    });

    this.listenAuthState();
  }

  ngOnDestroy(): (authStateHandler) => void {
    return onAuthUIStateChange;
  }

  private navigateOnAuthStateChange(authState: AuthState): void {
    const path = this.authService.getPathOnAuthStage(authState);
    if (this.location.path() !== path && typeof path === 'string') {
      this.ngZone.run(() => this.router.navigate([path]));
    }
  }

  private listenAuthState(): void {
    this.authService.loggedIn
      .pipe(untilDestroyed(this))
      .subscribe( (isSignedIn) => {
        this.isSignedIn = isSignedIn;
        this.ref.detectChanges();
      });
  }
}
