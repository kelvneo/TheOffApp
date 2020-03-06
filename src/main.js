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

// store.dispatch('credentials/getUser')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
