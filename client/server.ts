/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { join } from 'path';
import { existsSync } from 'fs';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';

import { APP_BASE_HREF } from '@angular/common';
import isMobile from 'ismobilejs';
import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export const ssrApp = (server: express.Express, distFolder) => {
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    const userAgent = req.headers['user-agent'];
    res.render(indexHtml, {
      req, providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: 'IS_MOBILE_SSR', useValue: isMobile(userAgent).any },
      ]});
  });
  return server;
};

const run = () => {
  const port = process.env.PORT || 4000;

  const distFolder = join(process.cwd(), './dist/browser');
  const baseServer = express();
  // Start up the Node server
  const server = ssrApp(baseServer, distFolder);
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
};

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
