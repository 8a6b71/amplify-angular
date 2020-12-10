import { Component, OnInit } from '@angular/core';
import { AuthRedirectService, AuthService } from './auth/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSignedIn = false;

  constructor(
    private readonly authService: AuthService,
    private readonly authRedirectService: AuthRedirectService,
  ) {}

  ngOnInit(): void {
    this.authService.initStateChangeSubscription();
    this.authRedirectService.initStateChangeSubscription();
    this.listenIsLoggedIn();
  }

  private listenIsLoggedIn(): void {
    this.authService.isLoggedIn$
      .pipe(untilDestroyed(this))
      .subscribe( (isSignedIn) => {
        this.isSignedIn = isSignedIn;
      });
  }
}
