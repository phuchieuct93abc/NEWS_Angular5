
import * as express from 'express';
import {join} from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
// Express server
const expressApp = express();

const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const {app} = require(`./dist/server/main`);

app();

export default expressApp;
