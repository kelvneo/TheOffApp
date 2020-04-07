<template>
  <div>
    <h4 class="title is-4">Off Passes</h4>
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
    <b-progress v-if="loading"></b-progress>
    <div class="columns is-multiline is-centered">
      <div class="column is-one-third" v-for="pass of offPass" :key="pass.id">
        <off-pass-card :user="details" :users="user" :offPass="pass" :class="{
          'has-background-white-ter':  pass.endDate.toMillis() < Date.now()
        }" :showDetails="showDetails"></off-pass-card>
      </div>
      <div class="column is-one-third">
        <div class="card" v-if="!offPass || !offPass.length">
          <div class="card-content">
            <div class="content has-text-grey has-text-centered">
              <p><b-icon icon="frown" size="is-large"></b-icon></p>
              <p>No Off Pass Found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <b-button type="is-success" icon-left="angle-down" expanded @click="loadMore()" :disabled="loading" :loading="loading" v-if="canLoadMore">Load More</b-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import firebase from 'firebase/app'
import 'firebase/firestore'

import OffPassCard from '../offs/OffPassCard.vue'

export default {
  name: 'UserOffPassRecords',
  components: {
    OffPassCard
  },
  props: {
    id: String
  },
  data () {
    return {
      loading: false,
      showDetails: false,
      user: {},
      offPass: [],
      offPassCursor: null,
      details: null
    }
  },
  computed: {
    canLoadMore () {
      return this.offPass.length && this.offPassCursor
    }
  },
  methods: {
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HH:mmA')
    },
    nextTotalOffPass (limit = 10) {
    },
    reset (reset) {
      if (reset) {
        this.offPass = []
        this.offPassCursor = null
      }
      if (!this.offPass.length) {
        this.loadMore()
      } else {
        const comds = new Set(this.offPass.flatMap(val => [val.recommender, val.approver]))
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

      const promise = this.offPassCursor ? this.offPassCursor
        : firebase.firestore().collection('users').doc(this.id).collection('off_pass').orderBy('endDate', 'desc').limit(10)

      if (this.offPass.length && !this.offPassCursor) {
        this.offPass = []
        return
      }

      promise.get().then((snapshot) => {
        this.loading = false
        if (snapshot.docs.length && snapshot.docs.length >= 10) {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1]
          this.offPassCursor = firebase.firestore().collection('users').doc(this.id)
            .collection('off_pass').orderBy('endDate', 'desc').startAfter(lastVisible).limit(10)
        } else {
          this.offPassCursor = null
        }

        if (snapshot.empty) {
          this.offPass = []
        } else {
          const ret = snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          })
          this.offPass.push(...ret)

          const comds = new Set(ret.flatMap(val => [val.recommender, val.approver]))
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
    this.$store.dispatch('common/getUser', this.id).then((val) => {
      this.details = val
      this.reset()
    })
  }
}
</script>
