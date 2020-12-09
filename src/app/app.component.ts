import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSignedIn = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initHubListen();
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
