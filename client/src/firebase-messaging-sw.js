// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '17159897246'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    // Customize notification here
    var data = payload.data;
    var notificationTitle = data.title;
    var notificationOptions = {
        body: data.body,
        url: data.url,
        data: {url: data.url},
        actions: [{action: "open_url", title: "Read Now"}]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    clients.openWindow(event.notification.data.url); //which we got from above

}, false);
