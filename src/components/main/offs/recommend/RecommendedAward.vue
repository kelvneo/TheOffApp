<template>
  <div>
    <b-message type="is-info" role="alert" title="Awarded Offs" :closable="false" size="is-small">
      The table details all your <strong>Offs You Awarded</strong> that are pending approval.
    </b-message>
    <!-- Table of Offs Awaiting Awarding  -->
    <b-table :data="recommendedOffs" :loading="loading" default-sort="awardDate" :mobile-cards="!tableForm">
      <template slot-scope="props">
        <b-table-column field="awardee" label="Awardee">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.awardee } }" v-if="user[props.row.awardee]">
            {{ user[props.row.awardee]['name'] }}
          </router-link>
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
        <b-table-column field="approver" label="Approver" :visible="showDetails">
          <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.approver } }" v-if="user[props.row.approver]">
            {{ user[props.row.approver]['name'] }}
          </router-link>
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
  </div>
</template>

<script>
export default {
  name: 'RecommendedAward',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      user: {},
      recommendedOffs: [],
      rawRecommendedOffs: {}
    }
  },
  methods: {
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
      this.loading = true
      this.$store.dispatch('user/getOffAwardRecommended', this.$store.getters['credentials/id']).then((val) => {
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
