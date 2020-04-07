<template>
  <div>
    <b-message type="is-info" role="alert" title="Your Recommended Offs" :closable="false" size="is-small">
      The table details all your <strong>Offs You Recommended</strong> that are pending approval.
    </b-message>
    <!-- Table of Offs Awaiting Approval  -->
    <b-table :data="recommendedOffs" :loading="loading" default-sort="requestDate" :mobile-cards="!tableForm">
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
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RecommendedOffs',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      recommendedOffs: [],
      rawRecommendedOffs: {},
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
      this.$store.dispatch('user/getOffsRecommended', this.$store.getters['credentials/id']).then((val) => {
        this.recommendedOffs = Object.values(val.docs.map(off => {
          const data = off.data()
          this.rawRecommendedOffs[off.id] = data
          data.id = off.id
          data.count = data.ids.length / 2
          return data
        }))
        this.loading = false
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
