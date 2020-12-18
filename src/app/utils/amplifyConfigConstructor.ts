import { isLocalhost } from './utils';

export function getEnvAmplifyConfig(config: AmplifyConfig): AmplifyConfig {
  const [
    localRedirectSignIn,
    productionRedirectSignIn,
  ] = config.oauth.redirectSignIn.split(',');

  const [
    localRedirectSignOut,
    productionRedirectSignOut,
  ] = config.oauth.redirectSignOut.split(',');

  return {
    ...config,
    oauth: {
      ...config.oauth,
      redirectSignIn: isLocalhost() || !productionRedirectSignIn ? localRedirectSignIn : productionRedirectSignIn,
      redirectSignOut: isLocalhost() || !productionRedirectSignOut ? localRedirectSignOut : productionRedirectSignOut,
    }
  };
}

export interface AmplifyConfig {
  aws_user_pools_id?: string;
  aws_project_region?: string;
  federationTarget?: string;
  aws_cognito_identity_pool_id?: string;
  aws_cloud_logic_custom?: { endpoint: string; name: string; region: string }[];
  aws_cognito_region?: string;
  oauth?: {
    redirectSignIn: string;
    responseType: string;
    domain: string; scope: string[];
    redirectSignOut: string
  };
  aws_user_pools_web_client_id?: string;
  [ key: string ]: any;
}
