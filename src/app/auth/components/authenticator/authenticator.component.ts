import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthState } from '@aws-amplify/ui-components';
import { FormFieldTypes } from '@aws-amplify/ui-components';
import { AuthService } from '../../services';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  initialAuthState: AuthState = AuthState.SignIn;
  signUpFormFields: FormFieldTypes;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.buildSignUpFormFields();
    this.listenRouterData();
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.authService.federatedSignIn(CognitoHostedUIIdentityProvider.Google);
    } catch (err) {
      this.snackBar.open(err.message, 'Undo');
    }
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
