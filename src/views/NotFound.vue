<template>
  <section class="hero is-fullheight is-warning is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          404
        </h1>
        <h2 class="subtitle">
          We can't find anything here.
        </h2>
        <b-button type="is-white" inverted outlined icon-left="backward" @click="back()">
          Back
        </b-button>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'NotFound',
  data () {
    return {
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
