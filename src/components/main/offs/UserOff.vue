<template>
  <div>
    <section class="section">
      <h2 class="title">Your Offs</h2>
      <b-notification type="is-warning" aria-close-label="Close notification" role="alert" :closable="false">
        You have been approved to use this site! Do check back soon as the features get implemented.
      </b-notification>
    </section>
  </div>
</template>

<script>
export default {
  name: 'UserOff',
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.$store.dispatch('user/getCurrentUserOffs').then((data) => {
      [...new Set(data.flatMap(val => [val.awardRecommended, val.awarded]))].forEach((val) => {
        this.$store.dispatch('common/getUser', val).then((userData) => {
          this.user[val] = userData
        })
      })
    })
  }
}
</script>
