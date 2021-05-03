<template>
  <div>
    <b-message type="is-info" role="alert" title="How To Recommend Offs" :closable="false" size="is-small">
      Check the boxes to select the personnel to recommend, and press <strong>"Recommend Offs"</strong> below.
    </b-message>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRows.length === 0" @click="recommendOffs()">
        Recommend Offs
      </b-button>
    </div>
    <b-table :data="pendingOff" :loading="loading" default-sort="requestDate" checkable :checked-rows.sync="checkedRows" :mobile-cards="!tableForm">
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
        <b-table-column field="approver" label="To Approve" :visible="showDetails">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.approver } }" v-if="user[props.row.approver]">
            {{ user[props.row.approver]['name'] }}
          </router-link>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
          {{ props.row.requestDate.toDate().toLocaleString() }}
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
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRows.length === 0" @click="recommendOffs()">
        Recommend Offs
      </b-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'pending-recommendation',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      checkedRows: [],
      pendingOff: [],
      rawPendingOff: {},
      user: {}
    }
  },
  methods: {
    momentUsingDate (seconds) {
      return dayjs.unix(seconds).format('DD MMM YY / A')
    },
    deletePendingOffs (off) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Pending Off',
        message: 'Are you sure you wish to delete ' + this.user[off.row.requester]['name'] +
          '\'s off on <strong>' + off.row.useDate.toDate().toLocaleString() + '</strong>?',
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
    recommendOffs () {
      this.loading = true
      const recommendedDate = new Date()
      const payload = this.checkedRows.map((val) => {
        this.rawPendingOff[val.id].recommendedDate = recommendedDate
        return this.rawPendingOff[val.id]
      })
      const ids = payload.map((val) => val.id)
      this.$store.dispatch('user/recommendOffs', payload).then((val) => {
        return this.$store.dispatch('user/deleteUserPendingOffs', ids).then(() => {
          this.$buefy.notification.open({
            message: 'Successfully recommended offs!',
            type: 'is-success'
          })
          this.reset(true)
        })
      }).catch((err) => {
        this.loading = false
        console.error(err)
        this.$buefy.notification.open({
          message: 'Unable to recommend off: ' + err.message,
          type: 'is-danger'
        })
      })
    },
    reset (reset) {
      this.loading = true
      this.$store.dispatch('user/getOffsToRecommend', this.$store.getters['credentials/id']).then((val) => {
        this.loading = false
        this.pendingOff = Object.values(val.docs.map(off => {
          const data = off.data()
          this.rawPendingOff[off.id] = data
          data.id = off.id
          data.count = data.ids.length / 2
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
