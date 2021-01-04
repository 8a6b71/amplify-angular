import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthState } from '@aws-amplify/ui-components';
import { AuthenticatorComponent } from './auth/components/authenticator/authenticator.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';
import { TruncateOAuthQueryParamsGuard } from './auth/guards/truncate-oauth-query-params.guard';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [
      AuthGuard,
      TruncateOAuthQueryParamsGuard
    ],
  },
  {
    path: 'sign-in',
    component: AuthenticatorComponent,
    canActivate: [GuestGuard],
    data: {
      initialAuthState: AuthState.SignIn
    }
  },
  {
    path: 'sign-up',
    component: AuthenticatorComponent,
    canActivate: [GuestGuard],
    data: {
      initialAuthState: AuthState.SignUp
    }
  },
  {
    path: 'forgot-password',
    component: AuthenticatorComponent,
    canActivate: [GuestGuard],
    data: {
      initialAuthState: AuthState.ForgotPassword
    }
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
