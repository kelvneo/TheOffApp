<template>
  <div>
    <b-message type="is-info" role="alert" title="Your Recommended MAs" :closable="false" size="is-small">
      The table details all your <strong>Medical Appointments You Recommended</strong> that are pending approval.
    </b-message>
    <!-- Table of MAs Awaiting Approval  -->
    <b-table :data="recommendedMAs" :loading="loading" default-sort="requestDate" :mobile-cards="!tableForm">
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
        <b-table-column field="approver" label="Approver" :visible="showDetails">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.approver } }" v-if="user[props.row.approver]">
            {{ user[props.row.approver]['name'] }}
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
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RecommendedMAs',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      recommendedMAs: [],
      rawRecommendedMAs: {},
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
        this.loading = false
        this.recommendedMAs = Object.values(val.docs.map(MA => {
          const data = MA.data()
          this.rawRecommendedMAs[MA.id] = data
          data.id = MA.id
          return data
        }))
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
