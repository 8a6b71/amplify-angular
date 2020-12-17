import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { AuthenticatorComponent } from './components/authenticator/authenticator.component';

@NgModule({
  declarations: [
    AuthenticatorComponent
  ],
  imports: [
    CommonModule,
    AmplifyUIAngularModule,
    RouterModule
  ],
  exports: [
    AuthenticatorComponent
  ]
})
export class AuthModule { }
