import { Component, OnInit } from '@angular/core';
import { FormFieldTypes } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styles: [
  ]
})
export class AuthenticatorComponent implements OnInit {
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

  ngOnInit(): void {
  }
}
