<template>
  <div>
    <router-view v-if="!loading"></router-view>
    <b-loading is-full-page :active.sync="loading" :can-cancel="false" ></b-loading>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // loading: true
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
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
$loading-background: rgba(#000, 0.9);
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
