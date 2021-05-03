<template>
  <div>
    <b-message type="is-info" role="alert" title="How To Approve MAs" :closable="false" size="is-small">
      Check the boxes to select the personnel to approve, and press <strong>"Approve MAs"</strong> below.
    </b-message>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRecommendedMAs.length === 0" @click="approveMAs()">
        Approve MAs
      </b-button>
    </div>
    <!-- Table of MAs Awaiting Approval  -->
    <b-table :data="recommendedMAs" :loading="loading" default-sort="requestDate" checkable :checked-rows.sync="checkedRecommendedMAs" :mobile-cards="!tableForm">
      <template slot-scope="props">
        <b-table-column field="requester" label="Requester">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.requester } }" v-if="user[props.row.requester]">
            {{ user[props.row.requester]['name'] }}
          </router-link>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="useDate" label="Using On" sortable>
          {{ momentUsingDate(props.row.useDate.seconds) }}
        </b-table-column>
        <b-table-column field="location" label="Location">
          {{ props.row.location }}
        </b-table-column>
        <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
          {{ props.row.requestDate.toDate().toLocaleString() }}
        </b-table-column>
        <b-table-column field="recommender" label="Recommender" :visible="showDetails">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.recommender } }" v-if="user[props.row.recommender]">
            {{ user[props.row.recommender]['name'] }}
          </router-link>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="recommendedDate" label="Recommended On" sortable :visible="showDetails">
          {{ props.row.recommendedDate ? props.row.recommendedDate.toDate().toLocaleString() : '-' }}
        </b-table-column>
        <b-table-column field="ids" label="Actions">
          <div class="buttons">
            <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingMAs(props)">
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
            <p>No Pending MAs</p>
          </div>
        </section>
      </template>
    </b-table>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRecommendedMAs.length === 0" @click="approveMAs()">
        Approve MAs
      </b-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'PendingMAApproval',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      recommendedMAs: [],
      rawRecommendedMAs: {},
      checkedRecommendedMAs: [],
      user: {}
    }
  },
  computed: {
  },
  methods: {
    momentUsingDate (seconds) {
      return dayjs.unix(seconds).format('DD MMM YY / A')
    },
    /**
     * Approve the use of the MA, creating an MA pass entry.
     */
    approveMAs () {
      this.loading = true
      const approvedDate = new Date()
      const recommendedIds = this.checkedRecommendedMAs.filter((val) => val.recommendedDate).map((val) => val.id)
      const pendingIds = this.checkedRecommendedMAs.filter((val) => !val.recommendedDate).map((val) => val.id)
      // Generate the MA pass entry for all the selected MAs.
      const payload = this.checkedRecommendedMAs.map((val) => {
        const isPM = val.useDate.toDate().getHours() > 11
        const passRecord = {
          id: val.requester,
          data: {
            requestDate: val.requestDate,
            // Make sure that the recommended date is set, in case the MA hasn't been recommended yet.
            recommendedDate: val.recommendedDate ? val.recommendedDate : approvedDate,
            recommender: val.recommender,
            approvedDate: approvedDate,
            approver: val.approver,
            startDate: val.useDate,
            endDate: new Date(val.useDate.toDate().getTime()),
            description: 'MA @ ' + val.location
          }
        }
        if (isPM) {
          passRecord.data.endDate.setHours(17, 30)
        } else {
          passRecord.data.endDate.setHours(12, 30)
        }
        return passRecord
      })
      // console.log(userIds)
      // console.log(recommendedIds)
      // console.log(pendingIds)
      // console.log(payload)
      this.$store.dispatch('user/addToOffPass', payload).then((val) => {
        return Promise.all([
          this.$store.dispatch('user/deleteUserPendingApprovalMAs', recommendedIds),
          this.$store.dispatch('user/deleteUserPendingMAs', pendingIds)
        ]).then((val) => {
          this.$buefy.notification.open({
            message: 'Successfully approved MAs!',
            type: 'is-success'
          })
          this.reset(true)
        })
      }).catch((err) => {
        console.error(err)
        this.reset(true)
        this.$buefy.notification.open({
          message: 'Unable to approve MA: ' + err.message,
          type: 'is-danger'
        })
      })
    },
    /**
     * Delete a recommended MA.
     */
    deletePendingMAs (MA) {
      // Prevent accidental deletion by re-confirming with the user.
      this.$buefy.dialog.confirm({
        title: 'Deleting Recommended MA',
        message: 'Are you sure you wish to delete ' + this.user[MA.row.requester]['name'] +
          '\'s MA on <strong>' + MA.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          var promise
          // Check if the MA is still pending recommendation, as the recommender could be the same
          // as the approver.
          if (MA.row.recommendedDate) {
            promise = this.$store.dispatch('user/deleteUserPendingApprovalMA', MA.row.id)
          } else {
            promise = this.$store.dispatch('user/deleteUserPendingMA', MA.row.id)
          }
          promise.then(() => {
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
    reset (reset) {
      this.loading = true
      this.$store.dispatch('user/getMAsToApprove', this.$store.getters['credentials/id']).then((val) => {
        this.recommendedMAs = Object.values(val.docs.map(MA => {
          const data = MA.data()
          this.rawRecommendedMAs[MA.id] = data
          data.id = MA.id
          return data
        }))
        this.$store.dispatch('user/getMAsToRecommendAndApprove', this.$store.getters['credentials/id']).then((val2) => {
          this.loading = false
          this.recommendedMAs.push(...val2.docs.map(MA => {
            const data = MA.data()
            this.rawRecommendedMAs[MA.id] = data
            data.id = MA.id
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
