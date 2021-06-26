import * as functions from 'firebase-functions';
import api from "./api";
import app from "./app";


const function_name = process.env.FUNCTION_NAME || process.env.K_SERVICE;
if (!function_name || function_name === 'app') {
    startApp();
   }
if (!function_name || function_name === 'apissr') {
    startApiSSR();
  }
if (!function_name || function_name === 'api') {
    startApi()
   }

    function startApp(){
        exports.app = functions.runWith({
            timeoutSeconds: 20,
            memory: '1GB'
        }).https.onRequest(app);
    }
    function startApiSSR(){
        
        exports.apissr = functions.runWith({
            timeoutSeconds: 10,
            memory: '1GB'
        }).https.onRequest(api);
    }

    function startApi(){
        exports.api = functions.runWith({
            timeoutSeconds: 10,
            memory: '1GB'
        }).region("asia-northeast1").https.onRequest(api);
    }








