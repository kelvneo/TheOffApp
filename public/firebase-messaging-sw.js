importScripts('/__/firebase/7.11.0/firebase-app.js');
importScripts('/__/firebase/7.11.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

firebase.messaging();

firebase.messaging().setBackgroundMessageHandler((payload) => {
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
})

self.addEventListener('notificationclick', function (event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow('/');
  }));
})
