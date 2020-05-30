<template>
  <div>
    <router-view v-if="!loading"></router-view>
    <b-loading is-full-page :active.sync="loading" :can-cancel="false">
      <div class="loading-icon"></div>
      <div class="has-text-light loading-text">{{ loadingText }}</div>
    </b-loading>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      // loading: true
      loadingText: 'Loading...'
    }
  },
  computed: {
    loading () {
      return this.$store.state.credentials.loading
    }
  },
  created () {
    // function loop (app) {
    //   setTimeout(() => {
    //     app.loading = app.$store.state.credentials.loading
    //     if (app.loading) {
    //       loop(app)
    //     }
    //   }, 100)
    // }

    // loop(this)
  },
  mounted () {
    // Check if the user is logged into firebase
    this.loadingText = 'Verifying your identity...'
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.commit('credentials/setLoading', true)
      this.$store.commit('credentials/setUser', user)
      this.loadingText = 'Getting your details...'
      // Check if the user exists in the database
      if (user) {
        this.$store.dispatch('user/getUser', user.uid).then((u) => {
          if (u.exists) {
            this.$store.commit('credentials/setLoading', false)
            const ud = u.data()
            ud.id = user.uid
            this.$store.commit('user/setCurrentUser', ud)
          } else { // If the user does not exist in the database, check if there is a temporary user.
            this.$store.dispatch('user/getTempUser', user.uid).then((tu) => {
              this.$store.commit('credentials/setLoading', false)
              this.$store.commit('user/setTempUser', tu.data())
            })
          }
        })
      } else {
        this.$store.commit('credentials/setLoading', false)
        this.$store.dispatch('credentials/logout')
      }
    })
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
$loading-background: rgba(#000, 0.9);
$loading-background-legacy: #000000;
@import "~bulma";
@import "~buefy/src/scss/buefy";

.loading-text {
  position: absolute;
  top: 60%;
  left: 50%;
  padding: 0.5em;
  text-align: center;
  transform: translate(-50%, -50%);
}

.mb {
  margin-bottom: 2rem !important;
}
.b-table {
  margin-bottom: 1.5rem;
}
.user-link {
  text-decoration: underline dotted;
  color: initial;
}
.user-buttons > .column {
  padding: 0.25rem 0.75rem;
}
</style>
