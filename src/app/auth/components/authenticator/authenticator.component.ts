import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InitialAuthState } from '../../enums/initial-auth-state.enum';

@UntilDestroy()
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  initialAuthState: InitialAuthState = InitialAuthState.SignIn;

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
