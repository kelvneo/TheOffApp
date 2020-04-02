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
      <b-table :data="offPass" :loading="loading" :row-class="(row, index) => row.endDate.toMillis() < Date.now() && 'has-text-grey-light'">
        <template slot-scope="props">
          <b-table-column field="description" label="Description" :class="{
            'has-text-info': props.row.description === 'Full Day Off',
            'has-text-primary': props.row.description === 'Half Day Off',
            'has-text-danger': props.row.description.startsWith('MA'),
          }">
            {{ props.row.description }}
          </b-table-column>
          <b-table-column field="startDate" label="Start Date">
            {{ momentSeconds(props.row.startDate.seconds) }}
          </b-table-column>
          <b-table-column field="endDate" label="End Date">
            {{ momentSeconds(props.row.endDate.seconds) }}
          </b-table-column>
          <b-table-column field="recommender" label="Recommender">
            <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
            <span v-else>...</span>
          </b-table-column>
          <b-table-column field="recommendedDate" label="Recommend Date" :visible="showDetails">
            {{ momentSeconds(props.row.recommendedDate.seconds) }}
          </b-table-column>
          <b-table-column field="approver" label="Approver">
            <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
            <span v-else>...</span>
          </b-table-column>
          <b-table-column field="approvedDate" label="Approve Date" :visible="showDetails">
            {{ momentSeconds(props.row.approvedDate.seconds) }}
          </b-table-column>
          <b-table-column field="requestDate" label="Request Date" :visible="showDetails">
           {{ momentSeconds(props.row.requestDate.seconds) }}
          </b-table-column>
          <b-table-column field="id" label="Actions">
            <div class="buttons">
              <b-button type="is-info" icon-left="eye" size="is-small" :disabled="loading" @click="viewOffPassCard(props)">
                View Off Pass
              </b-button>
            </div>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="question-circle" size="is-large">
                </b-icon>
              </p>
              <p>No Off Passes Found.</p>
            </div>
          </section>
        </template>
      </b-table>
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
    }
  },
  methods: {
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HH:mmA')
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
    },
    viewOffPassCard (row) {
      this.$buefy.modal.open({
        parent: this,
        component: OffPassCard,
        props: {
          user: this.user,
          offPass: row.row
        }
      })
    }
  },
  mounted () {
    this.reset()
  }
}
</script>
