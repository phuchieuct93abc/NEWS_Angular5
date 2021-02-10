
import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as moment from 'moment';
import smoothscroll from 'smoothscroll-polyfill';
import { AppModule } from './app/app.module';
import CONFIG from './environments/environment';
import 'intersection-observer';

smoothscroll.polyfill();

if (CONFIG.production) {
    enableProdMode();
    if (window) {
        window.console.log = () => {
            //Do nothing
        };
    }
}

moment.locale('vi');


document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule).then((ref) => {
        // Ensure Angular destroys itself on hot reloads.
        if ((window as any).ngRef) {
            (window as any).ngRef.destroy();
        }
        (window as any).ngRef = ref;

        // Otherwise, log the boot error
    }).catch((err) => console.error(err));
}, { passive: true });
