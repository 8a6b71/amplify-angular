import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthState, FormFieldTypes } from '@aws-amplify/ui-components';

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

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initialAuthState = this.activatedRoute.snapshot.data.initialAuthState;
  }
}
