<template>
  <b-navbar type="is-dark" :fixed-top="true">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <h2 class="title is-4 has-text-light">GSAB</h2>
      </b-navbar-item>
    </template>
    <template slot="start">
      <!-- <b-navbar-item tag="router-link" :to="{ path: '/cos' }" v-if="hasPerm('cos')">
        COS
      </b-navbar-item> -->
      <b-navbar-item tag="router-link" :to="{ path: '/off' }">
        Your Offs
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/off/recommend' }" v-if="hasPerm('recommend_off')">
        Recommend Offs
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/off/approve' }" v-if="hasPerm('approve_off')">
        Approve Offs
      </b-navbar-item>
      <!-- <b-navbar-item href="#">
        Home
      </b-navbar-item> -->
      <!-- <b-navbar-dropdown label="Info">
        <b-navbar-item href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="#">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown> -->
    </template>

    <template slot="end">
      <b-navbar-item tag="router-link" :to="{ path: '/approve' }" v-if="hasPerm('approve_users')">
        Approve Users
      </b-navbar-item>
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
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      hasPerm: 'user/hasPermission'
      // ...
    })
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
