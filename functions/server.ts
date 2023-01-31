import * as functions from 'firebase-functions';
import router from './api';
import app from './app';

exports.app = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .region('asia-east2')
  .https.onRequest(app);

exports.apissr = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '1GB',
  })
  .region('asia-east2')
  .https.onRequest(router);

exports.api = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '1GB',
  })
  .region('asia-east2')
  .https.onRequest(router);
