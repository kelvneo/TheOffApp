<template>
  <div>
    <section class="section">
      <h2 class="title">Approve Offs</h2>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Awaiting Approval">

        </b-tab-item>
        <b-tab-item label="Awaiting Award">

        </b-tab-item>
        <b-tab-item label="Award Off">
          <form action="" v-on:submit.prevent>
            <div class="columns">
              <div class="column is-half-desktop is-full-mobile">
                <b-field label="Description">
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
                <b-switch v-model="awardOffTable">
                    Switch to Table
                </b-switch>
            </div>
            <div class="buttons">
              <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Award Off</b-button>
            </div>
            <b-table :data="users" :loading="loading" :mobile-cards="!awardOffTable">
              <template slot-scope="props">
                <b-table-column field="rank" label="Rank" sortable searchable>
                  {{ props.row.rank }}
                </b-table-column>
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
        endDate: new Date()
      },
      awardOffTable: false,
      users: [],
      activeTab: 0
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
    reset () {
      this.awardOffForm = {
        description: '',
        endDate: new Date()
      }
      this.populateUser()
      this.activeTab = 0
    },
    submit () {
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
              type: 'is-warning'
            })
            console.error(err)
            this.loading = false
          })
          console.log(payload)
        }
      }
    }
  },
  created () {
    this.awardOffForm.endDate.setMonth(this.awardOffForm.endDate.getMonth() + 1)
    if (Object.keys(this.$store.state.common.allUsers).length === 0) {
      this.loading = true
      this.$store.dispatch('common/updateAllUsers').then((users) => {
        this.populateUser()
        this.loading = false
      })
    } else {
      this.populateUser()
    }
  }
}
</script>
