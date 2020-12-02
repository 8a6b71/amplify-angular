import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorComponent } from './components/authenticator/authenticator.component';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AuthenticatorComponent,
  ],
  imports: [
    CommonModule,
    AmplifyUIAngularModule,
    RouterModule,
  ]
})
export class AuthModule { }
