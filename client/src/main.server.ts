import { enableProdMode } from '@angular/core';

import CONFIG from './environments/environment';

if (CONFIG.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
