import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthState } from '@aws-amplify/ui-components';

@UntilDestroy()
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  initialAuthState: AuthState = AuthState.SignIn;

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.listenRouterData();
  }

  private listenRouterData(): void {
    this.activatedRoute.data
      .pipe(untilDestroyed(this))
      .subscribe(({initialAuthState}) => {
        if (initialAuthState) {
          this.initialAuthState = initialAuthState;
        }
      });
  }
}
