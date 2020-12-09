import { AuthState } from '@aws-amplify/ui-components';
import { AuthStateEvents } from '../auth/enums/auth-state-events.enum';

export const authUIStateToPathMap = new Map([
  [AuthState.SignIn, '/sign-in'],
  [AuthState.SignUp, '/sign-up'],
  [AuthState.ConfirmSignUp, '/confirm-sign-up'],
  [AuthState.ForgotPassword, '/forgot-password'],
]);

export const authStateToPathMap = new Map([
  [AuthStateEvents.SignIn, ''],
  [AuthStateEvents.SignOut, '/sign-in'],
  [AuthStateEvents.OAuthSignOut, '/sign-in'],
]);

