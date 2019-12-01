/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// tslint:disable:no-console

// self.addEventListener('install', event => { self.skipWaiting(); });
//
// self.addEventListener('activate', event => {
//     event.waitUntil(self.clients.claim());
//     console.log('article loader service loaded')
//     self.registration.unregister().then(
//         () => { console.log('article loader service worker unregister'); });
// });
self.addEventListener('message', function (event) {
    console.log(event)
    var data = event.data;
    if(data.command === 'preload'){
        console.log("Message from the Page : ", data.payload);

        fetch(data.payload)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        console.log(data);
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    }


});
