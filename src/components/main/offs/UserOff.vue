<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Your Off Stockcard</h2>
      <OverallUserOffs class="mb" v-on:off-applied="reset(true)" v-on:click-item="activeTab = $event"></OverallUserOffs>
      <OverallUserMAs class="mb" v-on:ma-applied="reset(true)" v-on:click-item="activeTab = $event"></OverallUserMAs>
      <div class="columns is-gapless">
        <div class="field column">
          <b-switch v-model="showDetails">
            Show Extra Details
          </b-switch>
        </div>
      </div>
      <b-tabs v-model="activeTab" type="is-boxed">
        <b-tab-item label="Awarded Offs">
          <b-message type="is-info" role="alert" title="Your Awarded Offs" :closable="false" size="is-small">
            This section details all your <strong>Unexpired Offs</strong>, grouped by their <strong>Expiry Date</strong>.
          </b-message>
          <b-table :data="off" :loading="loading" default-sort="endDate">
            <template slot-scope="props">
              <b-table-column field="description" label="Description">
                {{ props.row.description }}
              </b-table-column>
              <b-table-column field="endDate" label="Expiry Date" sortable>
                {{ props.row.endDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="awardDate" label="Date Awarded" sortable :visible="showDetails">
                {{ props.row.awardDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="awardRecommended" label="Recommended By" :visible="showDetails">
                <span v-if="user[props.row.awardRecommended]">{{ user[props.row.awardRecommended]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="awarded" label="Awarded By" :visible="showDetails">
                <span v-if="user[props.row.awarded]">{{ user[props.row.awarded]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="count" label="Off Remaining">
                {{ props.row.count }}
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="frown" size="is-large">
                    </b-icon>
                  </p>
                  <p>No Awarded Offs</p>
                </div>
              </section>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="Offs Recommending">
          <b-message type="is-info" role="alert" title="Your Offs Pending Recommendation" :closable="false" size="is-small">
            This section details all your <strong>offs pending recommendations</strong>
          </b-message>
          <b-table :data="pendingOff" :loading="loading" default-sort="requestDate">
            <template slot-scope="props">
              <b-table-column field="useDate" label="Using On" sortable>
                {{ momentUsingDate(props.row.useDate.toDate()) }}
              </b-table-column>
              <b-table-column field="count" label="Half / Full Day">
                {{ props.row.count === 1 ? 'Full Day' : 'Half Day '}}
              </b-table-column>
              <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="recommender" label="To Recommend">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="approver" label="To Approve" :visible="showDetails">
                <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="ids" label="Actions">
                <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingOffs(props)">
                  Cancel
                </b-button>
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="frown" size="is-large">
                    </b-icon>
                  </p>
                  <p>No Pending Offs</p>
                </div>
              </section>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="Offs to Approve">
          <b-message type="is-info" role="alert" title="Your Offs Pending Approval" :closable="false" size="is-small">
            This section details all your <strong>offs pending approval</strong>
          </b-message>
          <b-table :data="recommendedOff" :loading="loading" default-sort="requestDate">
            <template slot-scope="props">
              <b-table-column field="useDate" label="Using On" sortable>
                {{ momentUsingDate(props.row.useDate.toDate()) }}
              </b-table-column>
              <b-table-column field="count" label="Half / Full Day">
                {{ props.row.count === 1 ? 'Full Day' : 'Half Day' }}
              </b-table-column>
              <b-table-column field="recommender" label="To Recommend" :visible="showDetails">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="approver" label="To Approve">
                <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="ids" label="Actions">
                <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deleteRecommendedOffs(props)">
                  Cancel
                </b-button>
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="frown" size="is-large">
                    </b-icon>
                  </p>
                  <p>No Pending Offs to Approve</p>
                </div>
              </section>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="MAs Recommending">
          <b-message type="is-info" role="alert" title="Your MAs Pending Recommendation" :closable="false" size="is-small">
            This section details all your <strong>MAs pending recommendations</strong>
          </b-message>
          <b-table :data="pendingMA" :loading="loading" default-sort="requestDate">
            <template slot-scope="props">
              <b-table-column field="useDate" label="Using On" sortable>
                {{ momentUsingDate(props.row.useDate.toDate()) }}
              </b-table-column>
              <b-table-column field="location" label="Location">
                {{ props.row.location }}
              </b-table-column>
              <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="recommender" label="To Recommend">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="approver" label="To Approve" :visible="showDetails">
                <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="ids" label="Actions">
                <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingMAs(props)">
                  Cancel
                </b-button>
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="frown" size="is-large">
                    </b-icon>
                  </p>
                  <p>No Pending MAs</p>
                </div>
              </section>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="MAs to Approve">
          <b-message type="is-info" role="alert" title="Your MAs Pending Approval" :closable="false" size="is-small">
            This section details all your <strong>MAs pending approval</strong>
          </b-message>
          <b-table :data="recommendedMA" :loading="loading" default-sort="requestDate">
            <template slot-scope="props">
              <b-table-column field="useDate" label="Using On" sortable>
                {{ momentUsingDate(props.row.useDate.toDate()) }}
              </b-table-column>
              <b-table-column field="location" label="Location">
                {{ props.row.location }}
              </b-table-column>
              <b-table-column field="recommender" label="To Recommend" :visible="showDetails">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="approver" label="To Approve">
                <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="ids" label="Actions">
                <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deleteRecommendedMAs(props)">
                  Cancel
                </b-button>
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="frown" size="is-large">
                    </b-icon>
                  </p>
                  <p>No Pending MAs to Approve</p>
                </div>
              </section>
            </template>
          </b-table>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import OverallUserOffs from './OverallUserOffs.vue'
import OverallUserMAs from './OverallUserMAs.vue'

export default {
  name: 'UserOff',
  components: {
    OverallUserOffs,
    OverallUserMAs
  },
  data () {
    return {
      user: {},
      off: [],
      pendingOff: [],
      recommendedOff: [],
      pendingMA: [],
      recommendedMA: [],
      loading: true,
      activeTab: 0,
      showDetails: false
    }
  },
  mounted () {
    if (this.$route.query.t && Number.isSafeInteger(this.$route.query.t)) {
      this.activeTab = Number(this.$route.query.t)
    }
    this.reset(false)
  },
  methods: {
    momentUsingDate (seconds) {
      return moment.unix(seconds).format('DD MMM YY / A')
    },
    reset (reset) {
      const cuo = this.$store.dispatch('user/getCurrentUserOffs', reset).then((data) => {
        this.loading = false
        this.off = Object.values(data.reduce((l, c) => {
          l[c.awardDate] = l[c.awardDate] || {
            description: c.description,
            count: 0,
            endDate: c.endDate,
            awardRecommended: c.awardRecommended,
            awarded: c.awarded,
            awardDate: c.awardDate
          }
          l[c.awardDate]['count'] += 0.5
          return l
        }, {}))
        // [...new Set(this.off.flatMap(val => [val.awardRecommended, val.awarded]))].forEach((val) => {
        //   this.$store.dispatch('common/getUser', val).then((userData) => {
        //     this.$set(this.user, val, userData)
        //   })
        // })
        return new Set(this.off.flatMap(val => [val.awardRecommended, val.awarded]))
      })
      const cupo = this.$store.dispatch('user/getCurrentUserPendingOffs', reset).then((data) => {
        this.loading = false
        this.pendingOff = data.map((val) => {
          val.count = val.ids.length / 2
          return val
        })
        // [...new Set(this.pendingOff.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
        //   this.$store.dispatch('common/getUser', val).then((userData) => {
        //     this.$set(this.user, val, userData)
        //   })
        // })
        return new Set(this.off.flatMap(val => [val.recommender, val.approver]))
      })
      const curo = this.$store.dispatch('user/getCurrentUserRecommendedOffs', reset).then((data) => {
        this.loading = false
        this.recommendedOff = data.map((val) => {
          val.count = val.ids.length / 2
          return val
        })
        // [...new Set(this.recommendedOff.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
        //   this.$store.dispatch('common/getUser', val).then((userData) => {
        //     this.$set(this.user, val, userData)
        //   })
        // })
        return new Set(this.off.flatMap(val => [val.recommender, val.approver]))
      })
      const cupm = this.$store.dispatch('user/getCurrentUserPendingMAs', reset).then((data) => {
        this.loading = false
        this.pendingMA = data
        // [...new Set(this.pendingMA.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
        //   this.$store.dispatch('common/getUser', val).then((userData) => {
        //     this.$set(this.user, val, userData)
        //   })
        // })
        return new Set(this.off.flatMap(val => [val.recommender, val.approver]))
      })
      const curm = this.$store.dispatch('user/getCurrentUserRecommendedMAs', reset).then((data) => {
        this.loading = false
        this.recommendedMA = data
        // [...new Set(this.pendingMA.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
        //   this.$store.dispatch('common/getUser', val).then((userData) => {
        //     this.$set(this.user, val, userData)
        //   })
        // })
        return new Set(this.off.flatMap(val => [val.recommender, val.approver]))
      })
      Promise.all([cuo, cupo, curo, cupm, curm]).then((val) => {
        const comdSet = new Set()
        val.forEach((cval) => {
          cval.forEach((cval2) => {
            if (cval2) {
              comdSet.add(cval2)
            }
          })
        })
        comdSet.forEach((cval) => {
          this.$store.dispatch('common/getUser', cval).then((userData) => {
            this.$set(this.user, cval, userData)
          })
        })
      })
    },
    deletePendingOffs (off) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Pending Off',
        message: 'Are you sure you wish to delete the off on <strong>' + off.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteUserPendingOff', off.row.id).then(() => {
            this.$buefy.notification.open({
              message: 'Successfully Cancelled Off!',
              type: 'is-success'
            })
            this.reset(true)
          }).catch((err) => {
            console.error(err)
            this.$buefy.notification.open({
              message: 'Unable to cancel off: ' + err.message,
              type: 'is-danger'
            })
            this.reset(true)
          })
        }
      })
    },
    deleteRecommendedOffs (off) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Recommended Off',
        message: 'Are you sure you wish to delete the off on <strong>' + off.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteUserPendingApprovalOff', off.row.id).then(() => {
            this.$buefy.notification.open({
              message: 'Successfully Cancelled Off!',
              type: 'is-success'
            })
            this.reset(true)
          }).catch((err) => {
            console.error(err)
            this.$buefy.notification.open({
              message: 'Unable to cancel off: ' + err.message,
              type: 'is-danger'
            })
            this.reset(true)
          })
        }
      })
    },
    deletePendingMAs (ma) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Pending MA',
        message: 'Are you sure you wish to delete the MA on <strong>' + ma.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteUserPendingMA', ma.row.id).then(() => {
            this.$buefy.notification.open({
              message: 'Successfully Cancelled MA!',
              type: 'is-success'
            })
            this.reset(true)
          }).catch((err) => {
            console.error(err)
            this.$buefy.notification.open({
              message: 'Unable to cancel MA: ' + err.message,
              type: 'is-danger'
            })
            this.reset(true)
          })
        }
      })
    },
    deleteRecommendedMAs (ma) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Recommended MA',
        message: 'Are you sure you wish to delete the MA on <strong>' + ma.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteUserPendingApprovalMA', ma.row.id).then(() => {
            this.$buefy.notification.open({
              message: 'Successfully Cancelled MA!',
              type: 'is-success'
            })
            this.reset(true)
          }).catch((err) => {
            console.error(err)
            this.$buefy.notification.open({
              message: 'Unable to cancel MA: ' + err.message,
              type: 'is-danger'
            })
            this.reset(true)
          })
        }
      })
    }
  }
}
</script>

<style lang="sass">
.mb
  margin-bottom: 2rem

</style>
