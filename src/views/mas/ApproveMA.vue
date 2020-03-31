<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Approve MAs</h2>
      <div class="columns is-gapless">
        <div class="field column">
          <b-switch v-model="showDetails">
            Show Extra Details
          </b-switch>
        </div>
        <div class="field column is-hidden-tablet">
          <b-switch v-model="tableForm">
            Table Mode
          </b-switch>
        </div>
      </div>
      <b-tabs v-model="activeTab" type="is-boxed">
        <b-tab-item label="To Approve">
          <PendingMAApproval :tableForm="tableForm" :showDetails="showDetails"></PendingMAApproval>
        </b-tab-item>
        <!-- <b-tab-item label="Awaiting Award">
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
        </b-tab-item> -->
        <b-tab-item label="Cancel" disabled>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'
import PendingMAApproval from '../../components/main/offs/approve/PendingMAApproval.vue'

export default {
  name: 'ApproveOff',
  components: {
    PendingMAApproval
  },
  data () {
    return {
      activeTab: 0,
      tableForm: false,
      showDetails: false
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
