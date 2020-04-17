import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import '@/firebase/'

Vue.config.productionTip = false
Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultDateFormatter: (date) => date.toLocaleDateString('en-GB')
})

// store.dispatch('credentials/getUser')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
