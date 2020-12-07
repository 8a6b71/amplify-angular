import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Amplify } from 'aws-amplify';
import aws_exports from './aws-exports';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = aws_exports.oauth.redirectSignIn.split(',');

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = aws_exports.oauth.redirectSignOut.split(',');

const updatedAwsConfig = {
  ...aws_exports,
  oauth: {
    ...aws_exports.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  }
};

Amplify.configure(updatedAwsConfig);
