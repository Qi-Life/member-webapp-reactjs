importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCbUGKXwhP5zGgtQ295UH_qSgF_3Vbkv2s",
    authDomain: "qicoil-1627102579298.firebaseapp.com",
    projectId: "qicoil-1627102579298",
    storageBucket: "qicoil-1627102579298.appspot.com",
    messagingSenderId: "942446389344",
    appId: "1:942446389344:web:2cae4618f54e7c38e5bb05",
    measurementId: "G-L90LL6211Z"
}


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});