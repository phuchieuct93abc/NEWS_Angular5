import 'hammerjs';
import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import CONFIG from "./environments/environment";
import * as moment from 'moment';
import 'intersection-observer';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

if (CONFIG.production) {
    enableProdMode();
    if (window) {
        window.console.log = function () {
        };
    }
}

moment.locale('vi');


document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
        // Ensure Angular destroys itself on hot reloads.
        if (window['ngRef']) {
            window['ngRef'].destroy();
        }
        window['ngRef'] = ref;

        // Otherwise, log the boot error
    }).catch(err => console.error(err));
}, { passive: true });
