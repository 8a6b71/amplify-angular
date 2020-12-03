import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticatorComponent } from './auth/components/authenticator/authenticator.component';
import { UnAuthGuard } from './auth/guards/un-auth.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { InitialAuthState } from './auth/enums/initial-auth-state.enum';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-in',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: InitialAuthState.SignIn
    }
  },
  {
    path: 'sign-up',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: InitialAuthState.SignUp
    }
  },
  {
    path: 'forgot-password',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: InitialAuthState.ForgotPassword
    }
  },
  {
    path: 'confirm-sign-up',
    component: AuthenticatorComponent,
    canActivate: [UnAuthGuard],
    data: {
      initialAuthState: InitialAuthState.ConfirmSignUp
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
