import * as functions from 'firebase-functions';
import api from "./api";
import app from "./app";


exports.app = functions.runWith({
    timeoutSeconds: 15,
    memory: '512MB'

}).https.onRequest(app);


exports.api = functions.runWith({
    timeoutSeconds: 300,
    memory: '1GB'

}).region("asia-northeast1").https.onRequest(api);


