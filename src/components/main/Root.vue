<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Welcome
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
          <h4 class="title is-4">Off Pass</h4>
          <div class="card">
            <div class="card-content" v-if="currentOffPass === null">
              <div class="content has-text-grey has-text-centered">
                <p><b-icon icon="frown" size="is-large"></b-icon></p>
                <p>No Off Pass Found</p>
              </div>
            </div>
            <div class="card-content" v-else>
              <div class="content">
                <p class="has-text-centered">
                  <span class="title is-4">{{ name }}</span><br/>
                  <span class="subtitle is-6" :class="{
                    'has-text-info': currentOffPass.description === 'Full Day Off',
                    'has-text-primary': currentOffPass.description === 'Half Day Off',
                    'has-text-danger': currentOffPass.description.startsWith('MA'),
                  }">
                    {{ currentOffPass.description }}
                  </span><br/>
                </p>
                <p class="has-text-centered">
                  <span class="title is-6">{{ momentSeconds(currentOffPass.startDate.seconds) }}</span><br/>
                  <span class="subtitle is-6 has-text-grey-light">- To - </span><br/>
                  <span class="title is-6">{{ momentSeconds(currentOffPass.endDate.seconds) }}</span>
                </p>
                <hr/>
                <p class="has-text-grey">
                  Approved By: <span class="title is-6 has-text-grey">{{ safeUser(currentOffPass.approver) }}</span><br/>
                  Recommended By: <span class="title is-6 has-text-grey">{{ safeUser(currentOffPass.recommender) }}</span>
                </p>
              </div>
            </div>
            <footer class="card-footer">
              <div class="card-footer-item is-paddingless">
                <b-button expanded :disabled="!offPassCount || offPassIndex <= 0" @click="offPassIndex--">
                  <b-icon icon="chevron-left"></b-icon>
                </b-button>
              </div>
              <div class="card-footer-item is-paddingless">
                <b-button expanded :disabled="!offPassCount || offPassIndex + 1 >= offPassCount" @click="offPassIndex++">
                  <b-icon icon="chevron-right"></b-icon>
                </b-button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import OverallUserOffs from './offs/OverallUserOffs.vue'
import OverallUserMAs from './offs/OverallUserMAs.vue'
import moment from 'moment'

export default {
  name: 'Root',
  components: {
    OverallUserOffs,
    OverallUserMAs
  },
  data () {
    return {
      // rank: '',
      name: '',
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
    }
  },
  methods: {
    safeUser (val) {
      return this.user[val] ? this.user[val].name : '...'
    },
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HH:mmA')
    }
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
  }
}
</script>

<style lang="sass">
.mb
  margin-bottom: 2rem

</style>
