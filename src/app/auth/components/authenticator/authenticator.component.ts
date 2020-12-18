import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { AuthState, FormFieldTypes } from '@aws-amplify/ui-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styles: [
  ]
})
export class AuthenticatorComponent implements OnInit {
  initialAuthState: AuthState = AuthState.SignIn;
  signUpFormFields: FormFieldTypes = [
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
    }
  ];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initialAuthState = this.activatedRoute.snapshot.data.initialAuthState;
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.authService.federatedSignIn(CognitoHostedUIIdentityProvider.Google);
    } catch (err) {
      // TODO: Add error handler
      console.error(err);
    }
  }
}
