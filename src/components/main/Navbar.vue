<template>
  <b-navbar type="is-dark">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <h1 class="subtitle has-text-light">GSAB</h1>
      </b-navbar-item>
    </template>
    <template slot="start">
      <!-- <b-navbar-item href="#">
        Home
      </b-navbar-item>
      <b-navbar-item href="#">
        Documentation
      </b-navbar-item>
      <b-navbar-dropdown label="Info">
      <b-navbar-item href="#">
        About
      </b-navbar-item>
      <b-navbar-item href="#">
        Contact
      </b-navbar-item>
    </b-navbar-dropdown> -->
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button type="is-danger" class="has-background-dark" inverted outlined icon-left="sign-out-alt" @click="logout()">
          Logout
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'Navbar',
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
