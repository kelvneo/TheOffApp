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
          <h4 class="title is-5">Quick Links</h4>
          <div class="columns is-mobile is-multiline user-buttons is-variable is-1 mb">
            <div class="column is-half-mobile is-one-quarter-desktop" v-if="hasPerm('approve_off')">
              <b-button tag="router-link" type="is-info" outlined expanded icon-left="tag" :to="{ name: 'ApproveOff' }">Approve Off</b-button>
            </div>
            <div class="column is-half-mobile is-one-quarter-desktop" v-if="hasPerm('approve_off')">
              <b-button tag="router-link" type="is-info" outlined expanded icon-left="notes-medical" :to="{ name: 'ApproveMA' }">Approve MA</b-button>
            </div>
            <div class="column is-half-mobile is-one-quarter-desktop" v-if="hasPerm('recommend_off')">
              <b-button tag="router-link" type="is-success" outlined expanded icon-left="tag" :to="{ name: 'RecommendOff' }">Recommend Off</b-button>
            </div>
            <div class="column is-half-mobile is-one-quarter-desktop" v-if="hasPerm('recommend_off')">
              <b-button tag="router-link" type="is-success" outlined expanded icon-left="notes-medical" :to="{ name: 'RecommendMA' }">Recommend MA</b-button>
            </div>
            <div class="column is-half-mobile is-one-quarter-desktop">
              <b-button tag="router-link" expanded icon-left="list" :to="{ name: 'UserOff' }">Stockcard </b-button>
            </div>
            <div class="column is-half-mobile is-one-quarter-desktop">
              <b-button tag="router-link" expanded icon-left="address-card" :to="{ name: 'UserOffPass' }">Off Pass</b-button>
            </div>
          </div>
          <hr/>
          <div class="columns is-centered">
            <div class="column is-8 mb">
              <div class="level is-mobile">
                <h4 class="level-item title is-4">Your Offs / MAs</h4>
              </div>
              <OverallUserOffs></OverallUserOffs>
            </div>
            <div class="column is-4 mb">
              <div class="level is-mobile">
                <h4 class="level-item title is-4">Upcoming Off Pass</h4>
              </div>
              <div v-if="loadingOffPass">
                <off-pass-card :user="currentUser" :users="user" @deleted="reset()"></off-pass-card>
              </div>
              <div class="box" v-else-if="currentOffPass === null">
                <div class="">
                  <div class="content has-text-grey has-text-centered">
                    <p><b-icon icon="frown" size="is-large"></b-icon></p>
                    <p>No Off Pass Found</p>
                  </div>
                </div>
              </div>
              <div v-else>
                <off-pass-card :user="currentUser" :users="user" :offPass="currentOffPass" class="less-mb"></off-pass-card>
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
            <!-- <OverallUserMAs class="column"></OverallUserMAs> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import OverallUserOffs from './offs/OverallUserOffs.vue'
import OffPassCard from './offs/OffPassCard.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Root',
  components: {
    OverallUserOffs,
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
    loadingOffPass () {
      return this.$store.state.user.offPass === null
    },
    offPassCount () {
      return this.$store.state.user.offPass === null ? null : this.$store.state.user.offPass.length
    },
    timeOfDay () {
      const now = new Date()
      return now.getHours() > 17 || now.getHours() < 3 ? 'Evening' : (now.getHours() > 11 ? 'Afternoon' : 'Morning')
    },
    currentUser () {
      return this.$store.state.user.currentUser
    },
    ...mapGetters({
      hasPerm: 'user/hasPermission'
      // ...
    })
  },
  methods: {
    reset () {
      this.$store.dispatch('user/getCurrentUserOffPass').then((val) => {
        [...new Set(val.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
          this.$store.dispatch('common/getUser', val).then((userData) => {
            this.$set(this.user, val, userData)
          })
        })
      })
    }
  },
  mounted () {
    this.reset()
  },
  created () {
    // this.rank = this.$store.state.user.currentUser.rank
    this.name = this.$store.state.user.currentUser.name
    this.initials = this.$store.state.user.currentUser.initials
  }
}
</script>
