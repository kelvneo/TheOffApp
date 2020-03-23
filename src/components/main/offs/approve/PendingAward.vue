<template>
  <div>
    <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
      Do check back as features get implemented.
    </b-message>
    <b-message type="is-info" role="alert" title="How To Approve Offs" :closable="false" size="is-small">
      Check the boxes to select the personnel to approve, and press "Approve Offs" below.
    </b-message>
    <!-- Table of Offs Awaiting Awarding  -->
    <b-table :data="recommendedOffs" :loading="loading" default-sort="awardDate" checkable :checked-rows.sync="checkedRecommendedOffs" :mobile-cards="!tableForm">
      <template slot-scope="props">
        <b-table-column field="awardee" label="Awardee">
          <span v-if="user[props.row.awardee]">{{ user[props.row.awardee]['name'] }}</span>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="description" label="Description" sortable>
          {{ props.row.description }}
        </b-table-column>
        <b-table-column field="endDate" label="Expires On" sortable :visible="showDetails">
          {{ props.row.awardDate.toDate().toLocaleString() }}
        </b-table-column>
        <b-table-column field="awardDate" label="Recommended On" sortable :visible="showDetails">
          {{ props.row.awardDate.toDate().toLocaleString() }}
        </b-table-column>
        <b-table-column field="recommender" label="Recommender" :visible="showDetails">
          <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
          <span v-else>...</span>
        </b-table-column>
        <b-table-column field="count" label="Count">
          {{ props.row.count }} Day(s)
        </b-table-column>
        <b-table-column field="ids" label="Actions">
          <div class="buttons">
            <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingAward(props)">
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
            <p>No Pending Offs to Award</p>
          </div>
        </section>
      </template>
    </b-table>
    <div class="buttons">
      <b-button type="is-success" icon-left="check" expanded :disabled="loading || checkedRecommendedOffs.length === 0" @click="awardOffs()">
        Approve Offs
      </b-button>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
export default {
  name: 'PendingAward',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      user: {},
      recommendedOffs: [],
      checkedRecommendedOffs: [],
      rawRecommendedOffs: {}
    }
  },
  methods: {
    awardOffs () {
      this.loading = true
      const payload = {}
      const awardDate = new Date()
      const ids = this.checkedRecommendedOffs.map((val) => val.id)
      for (const off of this.checkedRecommendedOffs) {
        const offPayload = {
          'awarded': off.approver,
          'awardDate': awardDate,
          'awardRecommended': off.recommender,
          'description': off.description,
          'endDate': off.endDate
        }
        payload[off.awardee] = Array(Math.floor(off.count * 2)).fill(offPayload)
      }
      // console.log(payload)
      this.$store.dispatch('user/awardOffs', payload).then(() => {
        return this.$store.dispatch('user/deleteOffsToAward', ids).then(() => {
          this.$buefy.notification.open({
            message: 'Offs have been awarded!',
            type: 'is-success'
          })
          this.loading = false
          this.reset()
        })
      }).catch((err) => {
        this.$buefy.notification.open({
          message: 'Unable to award offs',
          type: 'is-danger'
        })
        console.error(err)
        this.loading = false
      })
    },
    deletePendingAward (off) {
      // Prevent accidental deletion by re-confirming with the user.
      this.$buefy.dialog.confirm({
        title: 'Deleting Recommended Off',
        message: 'Are you sure you wish to remove ' + this.user[off.row.awardee]['name'] +
          '\'s off?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteOffToAward', off.row.id).then(() => {
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
      this.$store.dispatch('user/getOffsToAward', this.$store.getters['credentials/id']).then((val) => {
        this.recommendedOffs = Object.values(val.docs.map(off => {
          const data = off.data()
          this.rawRecommendedOffs[off.id] = data
          data.id = off.id
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
