
import * as express from 'express';
import {join} from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const {ssrApp} = require(`./dist/server/main`);

ssrApp(app,DIST_FOLDER);

export default app;
