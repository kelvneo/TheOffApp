<template>
  <div class="home" v-if="!loading">
    <Navbar></Navbar>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase/app'
import 'firebase/messaging'

import Navbar from '@/components/main/Navbar.vue'
import Footer from '@/components/main/Footer.vue'
import store from '@/store/'

export default {
  name: 'home',
  components: {
    Navbar,
    Footer
  },
  computed: {
    loading () {
      return this.$store.state.credentials.loading
    }
  },
  methods: {
    saveNotificationToken () {
      firebase.messaging().getToken().then((currentToken) => {
        if (currentToken) {
          this.$store.dispatch('user/addNotificationToken', currentToken)
        } else {
          this.requestPermission()
        }
      }).catch((err) => {
        console.error('Unable to get messaging token', err)
        if (err.code === 'messaging/permission-default') {
          this.$buefy.notification.open({
            message: 'Notifications are disabled, please enable them to receive updates.',
            type: 'is-warning',
            closable: false
          })
          // this.fcmErrorContainer.innerText = 'You have not enabled notifications on this browser. To enable notifications reload the page and allow notifications using the permission dialog.';
        } else if (err.code === 'messaging/notifications-blocked') {
          this.$buefy.notification.open({
            message: 'Notifications are blocked. You will not be able to receive updates.',
            type: 'is-warning',
            closable: false
          })
          // this.fcmErrorContainer.innerHTML = 'You have blocked notifications on this browser. To enable notifications follow these instructions: <a href="https://support.google.com/chrome/answer/114662?visit_id=1-636150657126357237-2267048771&rd=1&co=GENIE.Platform%3DAndroid&oco=1">Android Chrome Instructions</a><a href="https://support.google.com/chrome/answer/6148059">Desktop Chrome Instructions</a>';
        }
      })
    },
    requestPermission () {
      console.log('Requesting notification permission...')
      firebase.messaging().requestPermission().then(() => {
        console.log('Notification permission granted.')
        this.saveNotificationToken()
      }).catch((err) => {
        console.error('Unable to get permission to notify.', err)
      })
    }
  },
  mounted () {
    this.saveNotificationToken()
  },
  beforeRouteEnter (to, from, next) {
    if (!store.state.user.currentUser) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      store.dispatch('user/getUserPermissions', store.state.credentials.user.uid).then((snapshot) => {
        const payload = {}
        snapshot.forEach((doc) => {
          payload[doc.id] = doc.data()
        })
        store.commit('user/setPermissions', payload)
      })
      next()
    }
  }
}
</script>
