<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Welcome
          </h2>
          <h1 class="title">
            {{rank}} {{name}}
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h5 class="title is-5">You have been approved to use the site!</h5>
        <div>
          Please check back here in a bit for more information.
        </div>
        <!-- <div class="buttons">
          <b-button tag="router-link" to="/approve" type="is-primary" outlined icon-left="users">
            Approve Users
          </b-button>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'Root',
  data () {
    return {
      rank: '',
      name: ''
    }
  },
  methods: {},
  created () {
    this.rank = this.$store.state.user.currentUser.rank
    this.name = this.$store.state.user.currentUser.name
  }
}
</script>
