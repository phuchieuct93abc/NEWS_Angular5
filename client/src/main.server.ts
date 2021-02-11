
import { enableProdMode } from '@angular/core';
import CONFIG from './environments/environment';


if (CONFIG.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
