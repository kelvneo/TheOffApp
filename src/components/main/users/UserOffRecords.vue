<template>
  <div>
    <div class="columns user-buttons">
      <div class="column">
        <b-button tag="router-link" type="is-light" class="has-text-grey"
          :to="{ name: 'UserDetailsRoot', params: { id: this.id } }" icon-left="chevron-left">Back to Profile</b-button>
      </div>
    </div>
    <h4 class="title is-4">Off Records</h4>
    <div class="mb">
      <div class="columns is-mobile is-multiline is-centered">
        <div class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
          @click="overallClick(1)">
          <div>
            <p class="heading">Recommending</p>
            <p class="title has-text-grey-light">
              <template v-if="!loading">{{ pendingOffCount }}</template>
              <b-skeleton :active="loading" width="3rem"></b-skeleton>
            </p>
          </div>
        </div>
        <div class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
          @click="overallClick(2)">
          <div>
            <p class="heading">To Approve</p>
            <p class="title has-text-grey-light">
              <template v-if="!loading">{{ recommendedOffCount }}</template>
              <b-skeleton :active="loading" width="3rem"></b-skeleton>
            </p>
          </div>
        </div>
        <div class="column is-half-tablet is-full-mobile has-text-centered"
          @click="overallClick(0)">
          <div>
            <p class="heading">Usable</p>
            <p class="title has-text-info">
              <template v-if="!loading">{{ availableOffCount }}</template>
              <b-skeleton :active="loading" width="3rem"></b-skeleton>
            </p>
          </div>
        </div>
        <!-- <div class="column is-one-quarter-tablet is-half-mobile has-text-centered">
          <div>
            <p class="heading">Raw Total</p>
            <p class="title has-text-grey">{{ totalOffs }}</p>
          </div>
        </div> -->
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
      <b-tab-item label="Awarded Offs">
        <b-message type="is-info" role="alert" title="Your Awarded Offs" :closable="false" size="is-small">
          This section details all <strong>Unexpired Offs</strong>, grouped by their <strong>Expiry Date</strong>.<br/>
          Click <strong>Show Extra Details</strong> above for more information.
        </b-message>
        <div class="columns is-multiline user-list">
          <div class="column is-half" v-for="o of offDisplay" :key="o.awardDate.seconds">
            <awarded-off-card :users="user" :offData="o" :showDetails="showDetails"></awarded-off-card>
          </div>
          <div class="column" v-if="offDisplay.length === 0 ">
            <div class="box">
              <h4 class="title is-4 has-text-centered has-text-grey">No Offs Found</h4>
            </div>
          </div>
        </div>
        <!-- <b-table :data="offDisplay" :loading="loading" default-sort="endDate">
          <template slot-scope="props">
            <b-table-column field="description" label="Description">
              {{ props.row.description }}
            </b-table-column>
            <b-table-column field="endDate" label="Expiry Date" sortable>
              {{ momentUsingDate(props.row.endDate.seconds) }}
            </b-table-column>
            <b-table-column field="awardDate" label="Date Awarded" sortable :visible="showDetails">
              {{ momentUsingDate(props.row.awardDate.seconds) }}
            </b-table-column>
            <b-table-column field="awardRecommended" label="Recommended By" :visible="showDetails">
              <span v-if="user[props.row.awardRecommended]">{{ user[props.row.awardRecommended]['name'] }}</span>
              <span v-else>...</span>
            </b-table-column>
            <b-table-column field="awarded" label="Awarded By" :visible="showDetails">
              <span v-if="user[props.row.awarded]">{{ user[props.row.awarded]['name'] }}</span>
              <span v-else>...</span>
            </b-table-column>
            <b-table-column field="count" label="Off Remaining">
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
        </b-table> -->
      </b-tab-item>
      <b-tab-item label="Offs Recommending">
        <b-message type="is-info" role="alert" title="Offs Pending Recommendation" :closable="false" size="is-small">
          This section details all <strong>offs pending recommendations</strong>
        </b-message>
        <b-table :data="pendingOff" :loading="loading" default-sort="requestDate">
          <template slot-scope="props">
            <b-table-column field="useDate" label="Using On" sortable>
              {{ momentUsingDate(props.row.useDate.seconds) }}
            </b-table-column>
            <b-table-column field="count" label="Half / Full Day">
              {{ props.row.count === 1 ? 'Full Day' : 'Half Day '}}
            </b-table-column>
            <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
              {{ props.row.requestDate.toDate().toLocaleString() }}
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
              <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deletePendingOffs(props)">
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
                <p>No Pending Offs</p>
              </div>
            </section>
          </template>
        </b-table>
      </b-tab-item>
      <b-tab-item label="Offs to Approve">
        <b-message type="is-info" role="alert" title="Offs Pending Approval" :closable="false" size="is-small">
          This section details all <strong>offs pending approval</strong>
        </b-message>
        <b-table :data="recommendedOff" :loading="loading" default-sort="requestDate">
          <template slot-scope="props">
            <b-table-column field="useDate" label="Using On" sortable>
              {{ momentUsingDate(props.row.useDate.seconds) }}
            </b-table-column>
            <b-table-column field="count" label="Half / Full Day">
              {{ props.row.count === 1 ? 'Full Day' : 'Half Day' }}
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
              {{ props.row.requestDate.toDate().toLocaleString() }}
            </b-table-column>
            <!-- <b-table-column field="ids" label="Actions">
              <b-button type="is-danger" size="is-small" icon-left="times" :disabled="loading" @click="deleteRecommendedOffs(props)">
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
                <p>No Pending Offs to Approve</p>
              </div>
            </section>
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import AwardedOffCard from '../offs/AwardedOffCard.vue'
// import firebase from 'firebase/app'
// import 'firebase/firestore'

export default {
  name: 'UserOffRecords',
  components: {
    AwardedOffCard
  },
  props: {
    id: String
  },
  data () {
    return {
      showDetails: false,
      user: {},
      off: [],
      offDisplay: [],
      pendingOff: [],
      recommendedOff: [],
      loading: true,
      activeTab: 0
    }
  },
  computed: {
    pendingOffCount () {
      return !this.loading ? this.pendingOff.reduce((a, b) => a + b.ids.length, 0) / 2 : '...'
    },
    recommendedOffCount () {
      return !this.loading ? this.recommendedOff.reduce((a, b) => a + b.ids.length, 0) / 2 : '...'
    },
    availableOffCount () {
      return !this.loading
        ? (this.off.length / 2 - this.pendingOffCount - this.recommendedOffCount)
        : '...'
    }
  },
  methods: {
    momentUsingDate (seconds) {
      return dayjs.unix(seconds).format('DD MMM YY, hhmm[hrs]')
    },
    overallClick (tab) {
      this.activeTab = tab
    },
    reset (reset) {
      const uo = this.$store.dispatch('user/getUserAwardedOffs', this.id).then((snapshot) => {
        this.loading = false
        if (snapshot.empty) {
          this.off = []
        } else {
          this.off = snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          })
          this.offDisplay = Object.values(this.off.reduce((l, c) => {
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
          }, {}))
        }
        return new Set(this.offDisplay.flatMap(val => [val.awardRecommended, val.awarded]))
      })
      const upo = this.$store.dispatch('user/getUserPendingOffs', this.id).then((snapshot) => {
        if (snapshot.empty) {
          this.pendingOff = []
        } else {
          this.pendingOff = snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            data.count = data.ids.length / 2
            return data
          })
        }
        return new Set(this.pendingOff.flatMap(val => [val.recommender, val.approver]))
      })
      const uro = this.$store.dispatch('user/getUserPendingApprovalOffs', this.id).then((snapshot) => {
        if (snapshot.empty) {
          this.recommendedOff = []
        } else {
          this.recommendedOff = snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            data.count = data.ids.length / 2
            return data
          })
        }
        return new Set(this.recommendedOff.flatMap(val => [val.recommender, val.approver]))
      })
      Promise.all([uo, upo, uro]).then(val => {
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
