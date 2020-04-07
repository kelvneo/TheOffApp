<template>
  <section class="hero is-fullheight is-info is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
            Welcome!
        </h1>
        <h2 class="subtitle">
            Please login to continue.
        </h2>
        <form action="" v-on:submit.prevent>
          <b-field :type="error ? 'is-danger' : ''"  :message="error">
            <b-field>
              <p class="control">
                <span class="button is-static">+65</span>
              </p>
              <b-input placeholder="Phone Number" type="tel" v-model="phoneNo" expanded focus :disabled="loading" :loading="loading" @keyup.enter="login()">
              </b-input>
              <p class="control">
                <b-button type="is-info" inverted outlined icon-left="mobile-alt" id="phone-login" :disabled="loading" @click="login()">
                  Login
                </b-button>
              </p>
            </b-field>
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
  name: 'Phone',
  components: {
    // HelloWorld
  },
  data () {
    return {
      transition: 'slide-left',
      phoneNo: '',
      loading: false,
      recaptchaVerifier: null,
      error: ''
    }
  },
  methods: {
    login () {
      this.loading = true
      const finalNo = '+65' + this.phoneNo.replace(' ', '')
      this.$store.dispatch('credentials/sendOTP', finalNo)
        .then((confirm) => {
          this.loading = false
          this.$store.state.credentials.recaptchaVerifier.clear()
          if (this.$route.query.redirect) {
            this.$router.replace({ path: '/login/verify', query: { 'redirect': this.$route.query.redirect } })
          } else {
            this.$router.replace('/login/verify')
          }
        }).catch((err) => {
          this.loading = false
          switch (err.code) {
            case 'auth/captcha-check-failed':
              this.error = 'Invalid / Expired Captcha. Please refresh the page.'
              break
            case 'auth/invalid-phone-number':
              this.error = 'Invalid Phone Number'
              break
            case 'auth/missing-phone-number':
              this.error = 'Enter your phone number.'
              break
            case 'auth/quota-exceeded':
              this.error = 'Internal error occurred, please contact the administrator.'
              break
            case 'auth/user-disabled':
              this.error = 'Your account has been disabled.'
              break
            default:
              this.error = err.message
          }
          console.error(err)
        })
    }
  },
  created () {
    setTimeout(() => {
      this.recaptchaVerifier = this.$store.dispatch('credentials/initRecaptcha', 'phone-login')
    }, 1000)
  }
}
</script>
