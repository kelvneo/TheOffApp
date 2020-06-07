importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  if (payload.notifcation) {
    const title = payload.notifcation.title
    const options = {
      body: payload.notifcation.body,
      icon: '/img/icons/android-chrome-192x192.png',
      badge: '/img/icons/android-chrome-192x192.png',
      image: '/img/icons/android-chrome-192x192.png',
      vibrate: [200, 100, 200]
    }

    return self.registration.showNotification(title, options)
  }
});
