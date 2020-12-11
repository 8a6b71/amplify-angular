import { Component, OnInit } from '@angular/core';
import { AuthRedirectService, AuthService } from './auth/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSignedIn: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly authRedirectService: AuthRedirectService,
  ) {}

  ngOnInit(): void {
    this.authService.initStateChangeSubscription();
    this.authRedirectService.initStateChangeSubscription();
    this.isSignedIn = this.authService.isLoggedIn$;
  }
}
