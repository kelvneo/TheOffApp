<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Approve Offs</h2>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Awaiting Approval">
          <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
            Do check back as features get implemented.
          </b-message>
          <b-message type="is-info" role="alert" title="How To Approve Offs" :closable="false" size="is-small">
            Check the boxes to select the personnel to approve, and press "Approve Offs" below.
          </b-message>
          <div class="columns is-gapless">
            <div class="field column">
              <b-switch v-model="showDetails">
                Show Extra Details
              </b-switch>
            </div>
            <div class="field column">
              <b-switch v-model="tableForm">
                Table Mode
              </b-switch>
            </div>
          </div>
          <b-table :data="recommendedOffs" :loading="loading" default-sort="requestDate" checkable :checked-rows.sync="checkedRecommendedOffs" :mobile-cards="!tableForm">
            <template slot-scope="props">
              <b-table-column field="requester" label="Requester">
                <span v-if="user[props.row.requester]">{{ user[props.row.requester]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="useDate" label="Using On" sortable>
                {{ props.row.useDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="requestDate" label="Requested On" sortable :visible="showDetails">
                {{ props.row.requestDate.toDate().toLocaleString() }}
              </b-table-column>
              <b-table-column field="recommender" label="Recommender" :visible="showDetails">
                <span v-if="user[props.row.recommender]">{{ user[props.row.recommender]['name'] }}</span>
                <span v-else>...</span>
              </b-table-column>
              <b-table-column field="recommendedDate" label="Recommended On" sortable :visible="showDetails">
                {{ props.row.recommendedDate.toDate().toLocaleString() }}
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
        </b-tab-item>
        <b-tab-item label="Awaiting Award">
          <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
            Do check back as features get implemented.
          </b-message>
        </b-tab-item>
        <b-tab-item label="Award Off">
          <form action="" v-on:submit.prevent>
            <div class="columns">
              <div class="column is-half-desktop is-full-mobile">
                <b-field label="Description" :type="awardOffForm.error ? 'is-danger' : ''"  :message="awardOffForm.error">
                  <b-input type="text" v-model="awardOffForm.description" placeholder="Jan Performance Off" required :disabled="loading" :loading="loading">
                  </b-input>
                </b-field>
              </div>
              <div class="column is-half-desktop is-full-mobile">
                <b-field label="Expiry Date">
                  <b-datepicker placeholder="Click to select..." icon="calendar" v-model="awardOffForm.endDate" :min-date="new Date()" :disabled="loading" :loading="loading">
                  </b-datepicker>
                </b-field>
              </div>
            </div>
            <div class="field is-hidden-tablet">
                <b-switch v-model="tableForm">
                    Table Mode
                </b-switch>
            </div>
            <div class="buttons">
              <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Award Off</b-button>
            </div>
            <b-table :data="users" :loading="loading" :mobile-cards="!tableForm">
              <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable searchable>
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column field="depot" label="Depot" sortable searchable>
                  {{ props.row.depot }}
                </b-table-column>
                <b-table-column field="branch" label="Branch" sortable searchable>
                  {{ props.row.branch }}
                </b-table-column>
                <b-table-column field="id" label="To Award">
                  <b-input type="number" v-model="props.row.count" placeholder="" required>
                  </b-input>
                </b-table-column>
              </template>
              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="question-circle" size="is-large">
                      </b-icon>
                    </p>
                    <p>No temporary users found.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </form>
        </b-tab-item>
        <b-tab-item label="Cancel Off">
          <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
            Do check back as features get implemented.
          </b-message>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'ApproveOff',
  data () {
    return {
      loading: false,
      awardOffForm: {
        description: '',
        endDate: new Date(),
        error: ''
      },
      users: [],
      activeTab: 0,
      recommendedOffs: [],
      rawRecommendedOffs: {},
      checkedRecommendedOffs: [],
      tableForm: false,
      showDetails: false,
      user: {}
    }
  },
  methods: {
    populateUser () {
      const temp = []
      const data = this.$store.state.common.allUsers
      for (const key in data) {
        // Shallow clone the object, becuase you don't want to edit the master data
        const payload = Object.assign({}, data[key])
        payload['id'] = key
        payload['count'] = 0
        temp.push(payload)
      }
      this.users = temp
    },
    submit () {
      this.awardOffForm.error = ''
      if (this.awardOffForm.description && this.awardOffForm.endDate) {
        this.loading = true
        const toCredit = this.users.filter((val) => val.count > 0)
        if (toCredit.length === 0) {
          this.loading = false
        } else {
          const approverID = this.$store.state.credentials.user.uid
          const payload = {}
          const offPayload = {
            'awarded': approverID,
            'awardDate': new Date(),
            'awardRecommended': approverID,
            'description': this.awardOffForm.description,
            'endDate': new Date(
              this.awardOffForm.endDate.getFullYear(),
              this.awardOffForm.endDate.getMonth(),
              this.awardOffForm.endDate.getDate(),
              23, 59, 59
            )
          }
          for (var i = 0, n = toCredit.length; i < n; ++i) {
            payload[toCredit[i].id] = Array(Math.floor(toCredit[i].count * 2)).fill(offPayload)
          }
          this.$store.dispatch('user/awardOffs', payload).then(() => {
            this.$buefy.notification.open({
              message: 'Offs have been awarded!',
              type: 'is-success'
            })
            this.loading = false
            this.reset()
          }).catch((err) => {
            this.$buefy.notification.open({
              message: 'Unable to award offs',
              type: 'is-danger'
            })
            console.error(err)
            this.loading = false
          })
          console.log(payload)
        }
      } else {
        this.awardOffForm.error = 'All fields are required'
      }
    },
    deletePendingOffs (off) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Recommended Off',
        message: 'Are you sure you wish to delete ' + this.user[off.row.requester]['name'] +
          '\'s off on <strong>' + off.row.useDate.toDate().toLocaleString() + '</strong>?',
        onConfirm: () => {
          this.loading = true
          this.$store.dispatch('user/deleteUserPendingApprovalOff', off.row.id).then(() => {
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
    approveOffs () {
      this.loading = true
      const approvedDate = new Date()
      const ids1 = this.checkedRecommendedOffs.flatMap((val) => val.ids.map((val2) => { return { uid: val.requester, offId: val2 } }))
      const ids2 = this.checkedRecommendedOffs.map((val) => val.id)
      const payload = this.checkedRecommendedOffs.map((val) => {
        const count = val.ids.length / 2
        const halfday = val.ids.length % 2 === 1
        const isPM = val.useDate.toDate().getHours() > 11
        const passRecord = {
          id: val.requester,
          data: {
            requestDate: val.requestDate,
            recommendedDate: val.recommendedDate,
            recommender: val.recommender,
            approvedDate: approvedDate,
            approver: val.approver,
            startDate: val.useDate,
            endDate: new Date(val.useDate.toDate().getTime()),
            count: count
          }
        }
        if (halfday) {
          if (isPM) {
            passRecord.data.endDate.setHours(17, 30)
          } else {
            passRecord.data.endDate.setHours(12, 30)
          }
          passRecord.data.description = 'Half Day Off'
        } else {
          passRecord.data.endDate.setHours(17, 30)
          passRecord.data.description = 'Full Day Off'
        }
        return passRecord
      })
      this.$store.dispatch('user/addToOffPass', payload).then((val) => {
        return this.$store.dispatch('user/deleteUserPendingApprovalOffs', ids2).then(() => {
          return this.$store.dispatch('user/deleteOffs', ids1).then(() => {
            this.$buefy.notification.open({
              message: 'Successfully approved offs!',
              type: 'is-success'
            })
            this.reset(true)
          })
        })
      }).catch((err) => {
        console.error(err)
        this.reset(true)
        this.$buefy.notification.open({
          message: 'Unable to approve off: ' + err.message,
          type: 'is-danger'
        })
      })
      // console.log(ids)
      // console.log(payload)
      // const recommendedDate = new Date()
      // const payload = this.checkedRows.flatMap((val) => val.ids).map((val) => {
      //   this.rawPendingOff[val].recommendedDate = recommendedDate
      //   return this.rawPendingOff[val]
      // })
      // const ids = payload.map((val) => val.id)
      // this.$store.dispatch('user/approveOff', payload).then((val) => {
      //   return this.$store.dispatch('user/deleteUserRecommendedOffs', ids).then(() => {
      //     this.$buefy.notification.open({
      //       message: 'Successfully recommended offs!',
      //       type: 'is-success'
      //     })
      //     this.reset(true)
      //   })
      // }).catch((err) => {
      //   this.loading = false
      //   console.error(err)
      //   this.$buefy.notification.open({
      //     message: 'Unable to recommend off: ' + err.message,
      //     type: 'is-danger'
      //   })
      // })
    },
    reset (reset) {
      this.awardOffForm = {
        description: '',
        endDate: new Date()
      }
      this.populateUser()
      this.activeTab = 0
      this.$store.dispatch('user/getOffsToApprove', this.$store.getters['credentials/id']).then((val) => {
        this.loading = false
        // this.recommendedOffs = Object.values(val.docs.map(off => {
        //   const data = off.data()
        //   this.rawRecommendedOffs[off.id] = data
        //   data.id = off.id
        //   return data
        // }).reduce((l, c) => {
        //   const key = c.requester + c.requestDate.toLocaleString()
        //   l[key] = l[key] || {
        //     // description: c.description,
        //     count: 0,
        //     useDate: c.useDate,
        //     requester: c.requester,
        //     recommender: c.recommender,
        //     approver: c.approver,
        //     requestDate: c.requestDate,
        //     recommendedDate: c.recommendedDate,
        //     ids: []
        //   }
        //   l[key]['count'] += 0.5
        //   l[key]['ids'].push(c.id)
        //   return l
        // }, {}));
        this.recommendedOffs = Object.values(val.docs.map(off => {
          const data = off.data()
          this.rawRecommendedOffs[off.id] = data
          data.id = off.id
          data.count = data.ids.length / 2
          return data
        }));
        [...new Set(this.recommendedOffs.flatMap(data => [data.recommender, data.approver]))].forEach((id) => {
          this.$store.dispatch('common/getUser', id).then((userData) => {
            this.$set(this.user, id, userData)
          })
        })
      })
    }
  },
  mounted () {
    this.awardOffForm.endDate.setMonth(this.awardOffForm.endDate.getMonth() + 1)
    this.loading = true
    this.$store.dispatch('common/updateAllUsers').then((users) => {
      this.populateUser()
      this.reset()
      this.loading = false
    })
  }
}
</script>
