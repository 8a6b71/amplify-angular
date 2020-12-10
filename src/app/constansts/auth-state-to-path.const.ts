import { AuthState } from '@aws-amplify/ui-components';
import { AuthStateEvents } from '../auth/enums/auth-state-events.enum';

export const authUIStateToPath = {
  [AuthState.SignIn]: '/sign-in',
  [AuthState.SignUp]: '/sign-up',
  [AuthState.ConfirmSignUp]: '/confirm-sign-up',
  [AuthState.ForgotPassword]: '/forgot-password',
};

export const authStateToPath = {
  [AuthStateEvents.SignIn]: '',
  [AuthStateEvents.SignOut]: '/sign-in',
  [AuthStateEvents.OAuthSignOut]: '/sign-in',
};

