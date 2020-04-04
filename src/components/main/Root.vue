<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Good {{ timeOfDay }}
          </h2>
          <h1 class="title">
            {{name}}
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="container">
          <OverallUserOffs class="mb"></OverallUserOffs>
          <OverallUserMAs class="mb"></OverallUserMAs>
          <div class="level is-mobile">
            <div class="level-left">
              <h4 class="level-item title is-4">Off Pass</h4>
            </div>
            <div class="level-right">
              <b-button type="is-info" tag="router-link" class="level-item" :to="{ path: '/off/pass' }">Details</b-button>
            </div>
          </div>
          <div class="card" v-if="currentOffPass === null">
            <div class="card-content">
              <div class="content has-text-grey has-text-centered">
                <p><b-icon icon="frown" size="is-large"></b-icon></p>
                <p>No Off Pass Found</p>
              </div>
            </div>
          </div>
          <div v-else>
            <off-pass-card :user="user" :offPass="currentOffPass" ></off-pass-card>
            <div class="columns is-mobile is-gapless">
              <div class="column">
                <b-button expanded :disabled="!offPassCount || offPassIndex <= 0" @click="offPassIndex--">
                  <b-icon icon="chevron-left"></b-icon>
                </b-button>
              </div>
              <div class="column">
                <b-button expanded :disabled="!offPassCount || offPassIndex + 1 >= offPassCount" @click="offPassIndex++">
                  <b-icon icon="chevron-right"></b-icon>
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import OverallUserOffs from './offs/OverallUserOffs.vue'
import OverallUserMAs from './offs/OverallUserMAs.vue'
import OffPassCard from './offs/OffPassCard.vue'

export default {
  name: 'Root',
  components: {
    OverallUserOffs,
    OverallUserMAs,
    OffPassCard
  },
  data () {
    return {
      // rank: '',
      name: '',
      initials: '',
      offPassIndex: 0,
      user: {}
    }
  },
  computed: {
    currentOffPass () {
      return this.$store.state.user.offPass === null || this.$store.state.user.offPass.length === 0 ? null : this.$store.state.user.offPass[this.offPassIndex]
    },
    offPassCount () {
      return this.$store.state.user.offPass === null ? null : this.$store.state.user.offPass.length
    },
    timeOfDay () {
      const now = new Date()
      return now.getHours() > 17 || now.getHours() < 3 ? 'Evening' : (now.getHours() > 11 ? 'Afternoon' : 'Morning')
    }
  },
  methods: {
  },
  mounted () {
    this.$store.dispatch('user/getCurrentUserOffPass').then((val) => {
      [...new Set(val.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
        this.$store.dispatch('common/getUser', val).then((userData) => {
          this.$set(this.user, val, userData)
        })
      })
    })
  },
  created () {
    // this.rank = this.$store.state.user.currentUser.rank
    this.name = this.$store.state.user.currentUser.name
    this.initials = this.$store.state.user.currentUser.initials
  }
}
</script>

<style lang="sass">
.mb
  margin-bottom: 2rem
.b-table
  margin-bottom: 1.5rem
.user-link
  text-decoration: underline dotted
  color: initial
</style>
