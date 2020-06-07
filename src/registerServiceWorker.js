/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { ToastProgrammatic as Toast } from 'buefy'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready (registered) {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
      registered.addEventListener('notificationclick', function (event) {
        console.log('On notification click: ', event.notification.tag)
        event.notification.close()
        // This looks to see if the current is already open and
        // focuses if it is
        event.waitUntil(registered.clients.matchAll({
          type: 'window'
        }).then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i]
            if (registered.client.url === '/' && 'focus' in client) {
              return registered.client.focus()
            }
          }
          if (registered.clients.openWindow) {
            return registered.clients.openWindow('/')
          }
        }))
      })
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      Toast.open({
        message: 'Restart to finish update!',
        position: 'is-bottom'
      })
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
