<template>
  <div>
    <b-message type="is-info" role="alert" title="How To Recommend MAs" :closable="false" size="is-small">
      Check the boxes to select the personnel to recommend, and press <strong>"Recommend MAs"</strong> below.
    </b-message>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRows.length === 0" @click="recommendMAs()">
        Recommend MAs
      </b-button>
    </div>
    <b-table :data="pendingMA" :loading="loading" default-sort="requestDate" checkable :checked-rows.sync="checkedRows" :mobile-cards="!tableForm">
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
        <b-table-column field="approver" label="To Approve" :visible="showDetails">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.approver } }" v-if="user[props.row.approver]">
            {{ user[props.row.approver]['name'] }}
          </router-link>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
          {{ props.row.requestDate.toDate().toLocaleString() }}
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
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRows.length === 0" @click="recommendMAs()">
        Recommend MAs
      </b-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'pending-ma-recommendation',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      checkedRows: [],
      pendingMA: [],
      rawPendingMA: {},
      user: {}
    }
  },
  methods: {
    momentUsingDate (seconds) {
      return moment.unix(seconds).format('DD MMM YY / A')
    },
    deletePendingMAs (MA) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Pending MA',
        message: 'Are you sure you wish to delete ' + this.user[MA.row.requester]['name'] +
          '\'s MA on <strong>' + MA.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteUserPendingMA', MA.row.id).then(() => {
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
    recommendMAs () {
      this.loading = true
      const recommendedDate = new Date()
      const payload = this.checkedRows.map((val) => {
        this.rawPendingMA[val.id].recommendedDate = recommendedDate
        return this.rawPendingMA[val.id]
      })
      const ids = payload.map((val) => val.id)
      this.$store.dispatch('user/recommendMAs', payload).then((val) => {
        return this.$store.dispatch('user/deleteUserPendingMAs', ids).then(() => {
          this.$buefy.notification.open({
            message: 'Successfully recommended MA!',
            type: 'is-success'
          })
          this.reset(true)
        })
      }).catch((err) => {
        this.loading = false
        console.error(err)
        this.$buefy.notification.open({
          message: 'Unable to recommend MA: ' + err.message,
          type: 'is-danger'
        })
      })
    },
    reset (reset) {
      this.loading = true
      this.$store.dispatch('user/getMAsToRecommend', this.$store.getters['credentials/id']).then((val) => {
        this.loading = false
        this.pendingMA = Object.values(val.docs.map(MA => {
          const data = MA.data()
          this.rawPendingMA[MA.id] = data
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
