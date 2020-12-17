import { Component, OnInit } from '@angular/core';
import { AuthRedirectService } from './auth/services/auth-redirect.service';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly authRedirectService: AuthRedirectService,
  ) {}

  ngOnInit(): void {
    this.authService.initStateChangeSubscription();
    this.authRedirectService.initStateChangeSubscription();
  }
}
