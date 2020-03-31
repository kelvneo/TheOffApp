<template>
  <div>
    <b-message type="is-info" role="alert" title="How To Approve Offs" :closable="false" size="is-small">
      Check the boxes to select the personnel to approve, and press <strong>"Approve Offs"</strong> below.
    </b-message>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRecommendedOffs.length === 0" @click="approveOffs()">
        Approve Offs
      </b-button>
    </div>
    <!-- Table of Offs Awaiting Approval  -->
    <b-table :data="recommendedOffs" :loading="loading" default-sort="requestDate" checkable :checked-rows.sync="checkedRecommendedOffs" :mobile-cards="!tableForm">
      <template slot-scope="props">
        <b-table-column field="requester" label="Requester">
          <span v-if="user[props.row.requester]">{{ user[props.row.requester]['name'] }}</span>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="useDate" label="Using On" sortable>
          {{ momentUsingDate(props.row.useDate.seconds) }}
        </b-table-column>
        <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
          {{ props.row.requestDate.toDate().toLocaleString() }}
        </b-table-column>
        <b-table-column field="recommender" label="Recommender" :visible="showDetails">
          <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="recommendedDate" label="Recommended On" sortable :visible="showDetails">
          {{ props.row.recommendedDate ? props.row.recommendedDate.toDate().toLocaleString() : '-' }}
        </b-table-column>
        <b-table-column field="count" label="Count">
          {{ props.row.count }} Day(s)
        </b-table-column>
        <b-table-column field="ids" label="Actions">
          <div class="buttons">
            <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingOffs(props)">
              Cancel
            </b-button>
          </div>
        </b-table-column>
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="check-circle" size="is-large">
              </b-icon>
            </p>
            <p>No Pending Offs</p>
          </div>
        </section>
      </template>
    </b-table>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRecommendedOffs.length === 0" @click="approveOffs()">
        Approve Offs
      </b-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PendingApproval',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      recommendedOffs: [],
      rawRecommendedOffs: {},
      checkedRecommendedOffs: [],
      user: {}
    }
  },
  computed: {
  },
  methods: {
    momentUsingDate (seconds) {
      return moment.unix(seconds).format('DD MMM YY / A')
    },
    /**
     * Approve the use of the off, creating an off pass entry.
     */
    approveOffs () {
      this.loading = true
      const approvedDate = new Date()
      const userIds = this.checkedRecommendedOffs.flatMap((val) => val.ids.map((val2) => { return { uid: val.requester, offId: val2 } }))
      const recommendedIds = this.checkedRecommendedOffs.filter((val) => val.recommendedDate).map((val) => val.id)
      const pendingIds = this.checkedRecommendedOffs.filter((val) => !val.recommendedDate).map((val) => val.id)
      // Generate the off pass entry for all the selected offs.
      const payload = this.checkedRecommendedOffs.map((val) => {
        const count = val.ids.length / 2
        const halfday = val.ids.length % 2 === 1
        const isPM = val.useDate.toDate().getHours() > 11
        const passRecord = {
          id: val.requester,
          data: {
            requestDate: val.requestDate,
            // Make sure that the recommended date is set, in case the off hasn't been recommended yet.
            recommendedDate: val.recommendedDate ? val.recommendedDate : approvedDate,
            recommender: val.recommender,
            approvedDate: approvedDate,
            approver: val.approver,
            startDate: val.useDate,
            endDate: new Date(val.useDate.toDate().getTime()),
            count: count
          }
        }
        if (halfday) {
          if (isPM) {
            passRecord.data.endDate.setHours(17, 30)
          } else {
            passRecord.data.endDate.setHours(12, 30)
          }
          passRecord.data.description = 'Half Day Off'
        } else {
          passRecord.data.endDate.setHours(17, 30)
          passRecord.data.description = 'Full Day Off'
        }
        return passRecord
      })
      // console.log(userIds)
      // console.log(recommendedIds)
      // console.log(pendingIds)
      // console.log(payload)
      this.$store.dispatch('user/addToOffPass', payload).then((val) => {
        return Promise.all([
          this.$store.dispatch('user/deleteUserPendingApprovalOffs', recommendedIds),
          this.$store.dispatch('user/deleteUserPendingOffs', pendingIds)
        ]).then((val) => {
          return this.$store.dispatch('user/deleteOffs', userIds).then(() => {
            this.$buefy.notification.open({
              message: 'Successfully approved offs!',
              type: 'is-success'
            })
            this.reset(true)
          })
        })
      }).catch((err) => {
        console.error(err)
        this.reset(true)
        this.$buefy.notification.open({
          message: 'Unable to approve off: ' + err.message,
          type: 'is-danger'
        })
      })
    },
    /**
     * Delete a recommended off.
     */
    deletePendingOffs (off) {
      // Prevent accidental deletion by re-confirming with the user.
      this.$buefy.dialog.confirm({
        title: 'Deleting Recommended Off',
        message: 'Are you sure you wish to delete ' + this.user[off.row.requester]['name'] +
          '\'s off on <strong>' + off.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          var promise
          // Check if the off is still pending recommendation, as the recommender could be the same
          // as the approver.
          if (off.row.recommendedDate) {
            promise = this.$store.dispatch('user/deleteUserPendingApprovalOff', off.row.id)
          } else {
            promise = this.$store.dispatch('user/deleteUserPendingOff', off.row.id)
          }
          promise.then(() => {
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
    reset (reset) {
      this.loading = true
      this.$store.dispatch('user/getOffsToApprove', this.$store.getters['credentials/id']).then((val) => {
        this.recommendedOffs = Object.values(val.docs.map(off => {
          const data = off.data()
          this.rawRecommendedOffs[off.id] = data
          data.id = off.id
          data.count = data.ids.length / 2
          return data
        }))
        this.$store.dispatch('user/getOffsToRecommendAndApprove', this.$store.getters['credentials/id']).then((val2) => {
          this.loading = false
          this.recommendedOffs.push(...val2.docs.map(off => {
            const data = off.data()
            this.rawRecommendedOffs[off.id] = data
            data.id = off.id
            data.count = data.ids.length / 2
            return data
          }))
        })
      })
    }
  },
  mounted () {
    this.$store.dispatch('common/updateAllUsers').then((users) => {
      this.user = users
      this.reset()
    })
  }
}
</script>
