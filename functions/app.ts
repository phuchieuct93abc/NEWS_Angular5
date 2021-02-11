import {enableProdMode} from '@angular/core';

import * as express from 'express';
import {join} from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();
// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const universal = require(`${process.cwd()}/dist/server`).app;

universal(app,DIST_FOLDER)

export default app;
