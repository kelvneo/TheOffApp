import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import '@/firebase/'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/messaging'

Vue.config.productionTip = false
Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultDateFormatter: (date) => date.toLocaleDateString('en-GB')
})

// Check if the user is logged into firebase
firebase.auth().onAuthStateChanged((user) => {
  store.commit('credentials/setLoading', true)
  store.commit('credentials/setUser', user)
  // Check if the user exists in the database
  if (user) {
    store.dispatch('user/getUser', user.uid).then((u) => {
      if (u.exists) {
        store.commit('credentials/setLoading', false)
        store.commit('user/setCurrentUser', u.data())
        saveNotificationToken()
      } else { // If the user does not exist in the database, check if there is a temporary user.
        store.dispatch('user/getTempUser', user.uid).then((tu) => {
          store.commit('credentials/setLoading', false)
          store.commit('user/setTempUser', tu.data())
        })
      }
    })
  } else {
    store.commit('credentials/setLoading', false)
  }
})

function saveNotificationToken () {
  firebase.messaging().getToken().then((currentToken) => {
    if (currentToken) {
      store.dispatch('user/addNotificationToken', currentToken)
    } else {
      requestPermission()
    }
  }).catch((err) => {
    console.error('Unable to get messaging token', err)
    if (err.code === 'messaging/permission-default') {
      Notification.open({
        message: 'Notifications are disabled, please enable them to receive updates.',
        type: 'is-warning',
        closable: false
      })
      // this.fcmErrorContainer.innerText = 'You have not enabled notifications on this browser. To enable notifications reload the page and allow notifications using the permission dialog.';
    } else if (err.code === 'messaging/notifications-blocked') {
      Notification.open({
        message: 'Notifications are blocked. You will not be able to receive updates.',
        type: 'is-warning',
        closable: false
      })
      // this.fcmErrorContainer.innerHTML = 'You have blocked notifications on this browser. To enable notifications follow these instructions: <a href="https://support.google.com/chrome/answer/114662?visit_id=1-636150657126357237-2267048771&rd=1&co=GENIE.Platform%3DAndroid&oco=1">Android Chrome Instructions</a><a href="https://support.google.com/chrome/answer/6148059">Desktop Chrome Instructions</a>';
    }
  })
}

function requestPermission () {
  console.log('Requesting notification permission...')
  firebase.messaging().requestPermission().then(() => {
    console.log('Notification permission granted.')
    saveNotificationToken()
  }).catch((err) => {
    console.error('Unable to get permission to notify.', err)
  })
}

// store.dispatch('credentials/getUser')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
