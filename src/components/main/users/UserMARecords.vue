<template>
  <div>
    <div class="columns user-buttons">
      <div class="column">
        <b-button tag="router-link" type="is-light" class="has-text-grey"
          :to="{ name: 'UserDetailsRoot', params: { id: this.id } }" icon-left="chevron-left">Back to Profile</b-button>
      </div>
    </div>
    <h4 class="title is-4">Pending MAs</h4>
    <div class="columns is-mobile is-multiline is-centered">
      <div class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
        @click="overallClick(0)">
        <div>
          <p class="heading">Recommending</p>
          <p class="title has-text-grey-light">
            <template v-if="!loading">{{ pendingMACount }}</template>
            <b-skeleton :active="loading" width="3rem"></b-skeleton>
          </p>
        </div>
      </div>
      <div class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
        @click="overallClick(1)">
        <div>
          <p class="heading">To Approve</p>
          <p class="title has-text-grey-light">
            <template v-if="!loading">{{ recommendedMACount }}</template>
            <b-skeleton :active="loading" width="3rem"></b-skeleton>
          </p>
        </div>
      </div>
    </div>
    <div class="columns is-gapless">
      <div class="field column">
        <b-switch v-model="showDetails">
          Show Extra Details
        </b-switch>
      </div>
    </div>
    <b-tabs v-model="activeTab" type="is-boxed">
      <b-tab-item label="MAs Recommending">
        <b-message type="is-info" role="alert" title="MAs Pending Recommendation" :closable="false" size="is-small">
          This section details all <strong>MAs pending recommendations</strong>
        </b-message>
        <b-table :data="pendingMA" :loading="loading" default-sort="requestDate">
          <template slot-scope="props">
            <b-table-column field="useDate" label="Using On" sortable>
              {{ momentUsingDate(props.row.useDate.seconds) }}
            </b-table-column>
            <b-table-column field="location" label="Location">
              {{ props.row.location }}
            </b-table-column>
            <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
              {{ momentUsingDate(props.row.requestDate.seconds) }}
            </b-table-column>
            <b-table-column field="recommender" label="To Recommend">
              <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
              <span v-else>...</span>
            </b-table-column>
            <b-table-column field="approver" label="To Approve" :visible="showDetails">
              <span v-if="user[props.row.approver]">{{ user[props.row.approver]['name'] }}</span>
              <span v-else>...</span>
            </b-table-column>
            <!-- <b-table-column field="ids" label="Actions">
              <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingMAs(props)">
                Cancel
              </b-button>
            </b-table-column> -->
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
        <b-message type="is-info" role="alert" title="MAs Pending Approval" :closable="false" size="is-small">
          This section details all <strong>MAs pending approval</strong>
        </b-message>
        <b-table :data="recommendedMA" :loading="loading" default-sort="requestDate">
          <template slot-scope="props">
            <b-table-column field="useDate" label="Using On" sortable>
              {{ momentUsingDate(props.row.useDate.seconds) }}
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
              {{ momentUsingDate(props.row.requestDate.seconds) }}
            </b-table-column>
            <!-- <b-table-column field="ids" label="Actions">
              <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deleteRecommendedMAs(props)">
                Cancel
              </b-button>
            </b-table-column> -->
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
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'UserMARecords',
  props: {
    id: String
  },
  data () {
    return {
      user: {},
      pendingMA: [],
      recommendedMA: [],
      showDetails: false,
      loading: true,
      activeTab: 0
    }
  },
  computed: {
    pendingMACount () {
      return this.pendingMA ? this.pendingMA.length : '...'
    },
    recommendedMACount () {
      return this.recommendedMA ? this.recommendedMA.length : '...'
    }
  },
  methods: {
    momentUsingDate (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HH:mmA')
    },
    overallClick (tab) {
      this.activeTab = tab
    },
    reset (reset) {
      this.loading = true
      const upm = this.$store.dispatch('user/getUserPendingMAs', this.id).then((snapshot) => {
        if (snapshot.empty) {
          this.pendingMA = []
        } else {
          this.pendingMA = snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          })
        }
        return new Set(this.pendingMA.flatMap(val => [val.recommender, val.approver]))
      })
      const urm = this.$store.dispatch('user/getUserPendingApprovalMAs', this.id).then((snapshot) => {
        if (snapshot.empty) {
          this.recommendedMA = []
        } else {
          this.recommendedMA = snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          })
        }
        return new Set(this.recommendedMA.flatMap(val => [val.recommender, val.approver]))
      })
      Promise.all([upm, urm]).then((val) => {
        this.loading = false
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
    }
  },
  mounted () {
    this.reset()
  }
}
</script>
