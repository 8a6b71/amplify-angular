import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticatorComponent } from './auth/components/authenticator/authenticator.component';
import { UnAuthGuard } from './auth/guards/un-auth.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { AuthState } from '@aws-amplify/ui-components';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-in',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: AuthState.SignIn
    }
  },
  {
    path: 'sign-up',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: AuthState.SignUp
    }
  },
  {
    path: 'forgot-password',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: AuthState.ForgotPassword
    }
  },
  {
    path: 'confirm-sign-up',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: AuthState.ConfirmSignUp
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
