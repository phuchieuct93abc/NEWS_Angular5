import 'hammerjs';
import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as smoothscroll from 'smoothscroll-polyfill';
import { AppModule } from './app/app.module';
import environment from './environments/environment';
import 'intersection-observer';

smoothscroll.polyfill();

if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = () => {
      //Do nothing
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
