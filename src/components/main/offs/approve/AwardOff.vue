<template>
  <div>
    <b-message type="is-info" role="alert" title="How To Award Offs" :closable="false" size="is-small">
      Provide an <strong>Expiry Date</strong>, and provide a <strong>Description</strong> for the off. <br/>
      Find the personnel to award offs, then key in the amount you wish to recommend, then scroll up and press <strong>"Award Off"</strong>.
    </b-message>
    <div class="columns is-gapless">
      <div class="field column">
        <b-switch v-model="branchOnly">
          Show Branch Only
        </b-switch>
      </div>
    </div>
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
      <div class="buttons">
        <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Award Off</b-button>
      </div>
      <!-- Table of Users to Award Offs  -->
      <b-table :data="filteredUsers" :loading="loading" :mobile-cards="!tableForm">
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
              <p>No users found.</p>
            </div>
          </section>
        </template>
      </b-table>
      <div class="buttons">
        <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Award Off</b-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AwardOff',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: false,
      branchOnly: true,
      awardOffForm: {
        description: '',
        endDate: new Date(),
        error: ''
      },
      users: []
    }
  },
  computed: {
    filteredUsers () {
      const branch = this.$store.state.user.currentUser.branch
      return this.branchOnly ? this.users.filter(val => val.branch === branch) : this.users
    }
  },
  methods: {
    /**
     * Submit the form to award offs.
     */
    submit () {
      this.awardOffForm.error = ''
      // Check if the form is filled.
      if (this.awardOffForm.description && this.awardOffForm.endDate) {
        this.loading = true
        const toCredit = this.users.filter((val) => val.count > 0)
        // Check if there are any offs to credit.
        if (toCredit.length === 0) {
          this.loading = false
        } else {
          const approverID = this.$store.state.credentials.user.uid
          const payload = {}
          // Create a common payload with same details.
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
          // Duplicate the number of payload depending on how much offs are award per user.
          // Since the unit per off is 0.5, the number the user keys in is multiplied by 2.
          // For example, if the user wishes to award User A 2 days off, the system will create 4 entries,
          // each entry representing 0.5 days of off, available for the user to use.
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
        }
      } else {
        this.awardOffForm.error = 'All fields are required'
      }
    },
    reset (reset) {
      this.loading = true
      this.awardOffForm = {
        description: '',
        endDate: new Date()
      }
      this.awardOffForm.endDate.setMonth(this.awardOffForm.endDate.getMonth() + 1)
      const temp = []
      this.$store.dispatch('common/updateAllUsers').then((data) => {
        for (const key in data) {
          // Shallow clone the object, becuase you don't want to edit the master data
          const payload = Object.assign({}, data[key])
          payload['id'] = key
          payload['count'] = 0
          temp.push(payload)
        }
        this.users = temp
        this.loading = false
      })
    }
  },
  mounted () {
    this.loading = true
    this.reset()
  }
}
</script>
