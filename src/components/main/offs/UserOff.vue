<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Your Off Stockcard</h2>
      <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
        This website is still under development and testing, apologies for the bugs!
      </b-message>
      <OverallUserOffs class="mb" v-on:off-applied="reset(true)"></OverallUserOffs>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Awarded Offs">
          <b-table :data="off" :loading="loading" default-sort="endDate">
            <template slot-scope="props">
              <b-table-column field="awardDate" label="Date Awarded" sortable>
                {{ props.row.awardDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="endDate" label="Expiry Date" sortable>
                {{ props.row.endDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="description" label="Description">
                {{ props.row.description }}
              </b-table-column>
              <b-table-column field="awardRecommended" label="Recommended By">
                <span v-if="user[props.row.awardRecommended]">{{ user[props.row.awardRecommended]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="awarded" label="Awarded By">
                <span v-if="user[props.row.awarded]">{{ user[props.row.awarded]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="count" label="Count">
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
          <b-table :data="pendingOff" :loading="loading" default-sort="requestDate">
            <template slot-scope="props">
              <b-table-column field="requestDate" label="Requested On" sortable>
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="recommender" label="To Recommend">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="approver" label="To Approve">
                <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="useDate" label="Using On" sortable>
                {{ props.row.useDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="count" label="Count">
                {{ props.row.count }}
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
          <b-table :data="recommendedOff" :loading="loading" default-sort="requestDate">
            <template slot-scope="props">
              <b-table-column field="requestDate" label="Requested On" sortable>
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="recommender" label="To Recommend">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="approver" label="To Approve">
                <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="useDate" label="Using On" sortable>
                {{ props.row.useDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="count" label="Count">
                {{ props.row.count }}
              </b-table-column>
              <b-table-column field="ids" label="Actions">
                <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deleteRecommendedOff(props)">
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
      </b-tabs>
    </section>
  </div>
</template>

<script>
import OverallUserOffs from './OverallUserOffs.vue'

export default {
  name: 'UserOff',
  components: {
    OverallUserOffs
  },
  data () {
    return {
      user: {},
      off: [],
      pendingOff: [],
      recommendedOff: [],
      loading: true,
      activeTab: 0
    }
  },
  mounted () {
    this.reset(false)
  },
  methods: {
    reset (reset) {
      this.$store.dispatch('user/getCurrentUserOffs', reset).then((data) => {
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
        }, {}));
        [...new Set(this.off.flatMap(val => [val.awardRecommended, val.awarded]))].forEach((val) => {
          this.$store.dispatch('common/getUser', val).then((userData) => {
            this.$set(this.user, val, userData)
          })
        })
      })
      this.$store.dispatch('user/getCurrentUserPendingOffs', reset).then((data) => {
        this.loading = false
        this.pendingOff = Object.values(data.reduce((l, c) => {
          l[c.requestDate] = l[c.requestDate] || {
            // description: c.description,
            count: 0,
            useDate: c.useDate,
            recommender: c.recommender,
            approver: c.approver,
            requestDate: c.requestDate,
            ids: []
          }
          l[c.requestDate]['count'] += 0.5
          l[c.requestDate]['ids'].push(c.id)
          return l
        }, {}));
        [...new Set(this.pendingOff.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
          this.$store.dispatch('common/getUser', val).then((userData) => {
            this.$set(this.user, val, userData)
          })
        })
      })
      this.$store.dispatch('user/getCurrentUserRecommendedOffs', reset).then((data) => {
        this.loading = false
        this.recommendedOff = Object.values(data.reduce((l, c) => {
          l[c.requestDate] = l[c.requestDate] || {
            // description: c.description,
            count: 0,
            useDate: c.useDate,
            recommender: c.recommender,
            approver: c.approver,
            requestDate: c.requestDate,
            ids: []
          }
          l[c.requestDate]['count'] += 0.5
          l[c.requestDate]['ids'].push(c.id)
          return l
        }, {}));
        [...new Set(this.recommendedOff.flatMap(val => [val.recommender, val.approver]))].forEach((val) => {
          this.$store.dispatch('common/getUser', val).then((userData) => {
            this.$set(this.user, val, userData)
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
          this.$store.dispatch('user/deleteUserPendingOffs', off.row.ids).then(() => {
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
          this.$store.dispatch('user/deleteUserPendingApprovalOffs', off.row.ids).then(() => {
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
    }
  }
}
</script>

<style lang="sass">
.mb
  margin-bottom: 2rem

</style>
