import 'hammerjs';
import './polyfills';


import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import smoothscroll from 'smoothscroll-polyfill';
import { AppModule } from './app/app.module';
import CONFIG from './environments/environment';
import 'intersection-observer';
 
smoothscroll.polyfill();
declare var navigator: any;

if (CONFIG.production) {
  enableProdMode();
  if (window) {
    window.console.log = () => {
      //Do nothing
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
