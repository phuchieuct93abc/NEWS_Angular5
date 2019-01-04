import 'hammerjs';
import './polyfills';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import CONFIG from "./environments/environment";
import * as moment from 'moment';

if (CONFIG.production) {
    enableProdMode();
}

moment.locale('vi');


platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
        window['ngRef'].destroy();
    }
    window['ngRef'] = ref;

    // Otherwise, log the boot error
}).catch(err => console.error(err));