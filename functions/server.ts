import * as functions from 'firebase-functions';
import api from './api';
import app from './app';

exports.app = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onRequest(app);

exports.apissr = functions
  .runWith({
    timeoutSeconds: 10,
    memory: '1GB',
  })
  .https.onRequest(api);

exports.api = functions
  .runWith({
    timeoutSeconds: 10,
    memory: '1GB',
  })
  .region('asia-northeast1')
  .https.onRequest(api);
