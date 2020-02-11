<template>
  <section class="hero is-fullheight is-info is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
          Check your Phone
      </h1>
      <h2 class="subtitle">
          Please check your phone and key in the 6 digit OTP sent to you.
      </h2>
      <form>
        <b-field :type="error ? 'is-danger' : ''"  :message="error" horizontal>
          <b-input placeholder="OTP" type="number" v-model="otp" expanded focus :disabled="loading" :loading="loading" maxlength="6">
          </b-input>
          <p class="control">
            <b-button type="is-info" inverted outlined icon-left="check" id="phone-login" :disabled="loading" @click="login()">
              Verify
            </b-button>
          </p>
        </b-field>
      </form>
    </div>
  </div>
  </section>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'VerifyPhone',
  components: {
    // HelloWorld
  },
  data () {
    return {
      transition: 'slide-left',
      otp: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    login () {
      this.loading = true
      const store = this.$store
      this.$store.dispatch('credentials/confirmOTP', this.otp).then(() => {
        store.dispatch('credentials/setLoading', true).then(() => {
          this.$router.replace('/')
        })
      }).catch((err) => {
        this.loading = false
        this.error = err.message
        console.error(err)
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    function checkLoading (app) {
      // console.log(store.state.credentials.loading)
      if (!app.$store.state.credentials.loading) next()
      else {
        setTimeout(checkLoading, 100, app)
      }
    }
    checkLoading(this)
  },
  created () {

  }
}
</script>
