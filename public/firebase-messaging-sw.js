// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyAQ9QTUwifPljmoyHwLFYIRK6o0-CPlIHU",
    authDomain: "senior-thesis-a5626.firebaseapp.com",
    projectId: "senior-thesis-a5626",
    storageBucket: "senior-thesis-a5626.appspot.com",
    messagingSenderId: "277988029521",
    appId: "1:277988029521:web:ea938a778f083124933470",
    measurementId: "G-9T0WCGN9LT"
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});