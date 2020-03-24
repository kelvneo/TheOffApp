importScripts('/__/firebase/7.11.0/firebase-app.js');
importScripts('/__/firebase/7.11.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

firebase.messaging();

firebase.messaging().setBackgroundMessageHandler((payload) => {
  if (payload.notifcation) {
    const title = payload.notifcation.title
    const options = {
      body: payload.notifcation.body,
      icon: '../img/icons/android-chrome-192x192.png',
      vibrate: [200, 100, 200]
    }

    return self.registration.showNotification(title, options)
  }
})