<template>
  <section class="hero is-fullheight is-info is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Thanks for signing up!
      </h1>
      <h2 class="subtitle">
        You will be informed when you are able to log into the site.
      </h2>
        <b-button type="is-info" inverted outlined icon-left="sign-out-alt" @click="logout()">
        Logout
        </b-button>
    </div>
  </div>
  </section>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'WaitForApproval',
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$store.dispatch('credentials/logout').then(() => {
        this.$router.replace('/login')
      })
    }
  },
  created () {}
}
</script>
