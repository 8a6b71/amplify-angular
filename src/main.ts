import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from '@aws-amplify/auth';
import { AppModule } from './app/app.module';
import awsconfig from './aws-exports';
import { environment } from './environments/environment';
import { getEnvAmplifyConfig } from './helpers/amplifyConfigConstructor';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

Auth.configure(getEnvAmplifyConfig(awsconfig));
