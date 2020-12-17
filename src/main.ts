import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from '@aws-amplify/auth';
import { AppModule } from './app/app.module';
import aws_exports from './aws-exports';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

Auth.configure(aws_exports);
