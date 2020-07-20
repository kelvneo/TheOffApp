<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Your Off Passes</h2>
      <b-message type="is-warning" role="alert" title="Work In Progress" :closable="false" size="is-small">
        This page is a work-in-progress. Do check back for more details.
      </b-message>
      <div class="columns is-gapless">
        <div class="field column">
          <b-switch v-model="showDetails">
            Show Extra Details
          </b-switch>
        </div>
        <!-- <div class="field column is-hidden-tablet">
          <b-switch v-model="tableForm">
            Table Mode
          </b-switch>
        </div> -->
      </div>
      <!-- <b-progress v-if="loading"></b-progress> -->
      <div class="columns is-multiline is-centered">
        <div class="column is-one-third" v-if="loading">
          <off-pass-card :users="user" :showDetails="showDetails"></off-pass-card>
        </div>
        <div class="column is-one-third" v-else-if="!offPass.length">
          <div class="box">
            <div class="">
              <div class="content has-text-grey has-text-centered">
                <p><b-icon icon="frown" size="is-large"></b-icon></p>
                <p>No Off Pass Found</p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-one-third" v-else v-for="pass of offPass" :key="pass.id">
          <off-pass-card :user="currentUser" :users="user" :offPass="pass" :class="{
            'has-background-white-ter':  pass.endDate.toMillis() < Date.now()
          }" :showDetails="showDetails" @deleted="reset(true)"></off-pass-card>
        </div>
      </div>
      <div class="buttons">
        <b-button type="is-success" icon-left="angle-down" expanded @click="loadMore()" :disabled="loading" :loading="loading" v-if="canLoadMore">Load More</b-button>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import OffPassCard from './OffPassCard.vue'

export default {
  name: 'UserOffPass',
  components: {
    OffPassCard
  },
  data () {
    return {
      loading: false,
      showDetails: false,
      user: {}
    }
  },
  computed: {
    offPass () {
      return this.$store.state.user.totalOffPass
    },
    canLoadMore () {
      return this.$store.state.user.totalOffPass.length && this.$store.state.user.totalOffPassCursor
    },
    currentUser () {
      return this.$store.state.user.currentUser
    }
  },
  methods: {
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, hh:mmA')
    },
    reset (reset) {
      if (reset) {
        this.$store.commit('user/setTotalOffPass', [])
        this.$store.commit('user/setTotalOffPassCursor', null)
      }
      if (!this.$store.state.user.totalOffPass.length) {
        this.loadMore()
      } else {
        const comds = new Set(this.$store.state.user.totalOffPass.flatMap(val => [val.recommender, val.approver]))
        comds.forEach((cval) => {
          if (!this.user[cval]) {
            this.$store.dispatch('common/getUser', cval).then((userData) => {
              this.$set(this.user, cval, userData)
            })
          }
        })
      }
    },
    loadMore () {
      this.loading = true
      this.$store.dispatch('user/nextTotalOffPass').then((data) => {
        this.loading = false
        if (data.length) {
          const comds = new Set(data.flatMap(val => [val.recommender, val.approver]))
          comds.forEach((cval) => {
            if (!this.user[cval]) {
              this.$store.dispatch('common/getUser', cval).then((userData) => {
                this.$set(this.user, cval, userData)
              })
            }
          })
        }
      })
    }
  },
  mounted () {
    this.reset()
  }
}
</script>
