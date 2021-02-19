import * as functions from 'firebase-functions';
import api from "./api";
import app from "./app";


const function_name = process.env.FUNCTION_NAME || process.env.K_SERVICE;
if (!function_name || function_name === 'app') {
    exports.app = functions.runWith({
        timeoutSeconds: 20,
        memory: '1GB'
    }).https.onRequest(app);}
if (!function_name || function_name === 'apissr') {
    exports.apissr = functions.runWith({
        timeoutSeconds: 10,
        memory: '1GB'
    }).https.onRequest(api);}
if (!function_name || function_name === 'api') {
    exports.api = functions.runWith({
        timeoutSeconds: 10,
        memory: '1GB'
    }).region("asia-northeast1").https.onRequest(api);}









