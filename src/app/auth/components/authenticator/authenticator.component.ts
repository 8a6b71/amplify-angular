import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthState } from '@aws-amplify/ui-components';
import { FormFieldTypes } from '@aws-amplify/ui-components';

@UntilDestroy()
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  initialAuthState: AuthState = AuthState.SignIn;
  signUpFormFields: FormFieldTypes;

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildSignUpFormFields();
    this.listenRouterData();
  }

  private buildSignUpFormFields(): void {
    this.signUpFormFields = [
      {
        type: 'email',
        label: 'Email Address *',
        placeholder: 'Email',
        required: true,
      },
      {
        type: 'password',
        label: 'Password *',
        placeholder: 'Password',
        required: true,
      },
    ];
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
