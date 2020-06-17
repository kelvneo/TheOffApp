<template>
  <div>
    <form action="" v-on:submit.prevent>
      <b-steps v-model="activeStep" :has-navigation="false">
        <b-step-item icon="list" label="Details">
          <b-message type="is-info" role="alert" title="How To Award Offs" :closable="false" size="is-small">
            Give a name or description for awarding the off, and set the expiry date if needed.
          </b-message>
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
            <b-button type="is-success" icon-left="chevron-right" expanded @click="activeStep = 1" :disabled="loading || (!awardOffForm.description)" :loading="loading">Next</b-button>
          </div>
        </b-step-item>
        <b-step-item icon="users" label="Choose Personnel">
          <b-message type="is-info" role="alert" title="How To Award Offs" :closable="false" size="is-small">
            Press the checkbox on the users you wish to give offs to.
          </b-message>
          <div class="columns is-multiline">
            <div class="column is-full">
              <b-field label="Search">
                <b-input type="text" v-model="search" placeholder="Search a Name" :disabled="loading" :loading="loading">
                </b-input>
              </b-field>
            </div>
            <div class="column is-full">
              <b-field>
                <b-switch v-model="branchOnly">
                  Show Branch Only
                </b-switch>
              </b-field>
            </div>
          </div>
          <!-- <div class="buttons">
            <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Recommend Off</b-button>
          </div> -->
          <div class="columns is-multiline user-list">
            <div class="column is-half" v-for="user of filteredUsers" :key="user.id">
              <ToAwardOffCard :user.sync="user" :loading="loading"></ToAwardOffCard>
            </div>
            <div class="column" v-if="filteredUsers.length === 0 ">
              <div class="box">
                <h4 class="title is-4 has-text-centered has-text-grey">No Users Found</h4>
              </div>
            </div>
          </div>
          <div class="columns is-mobile">
            <div class="column is-narrow">
              <b-button @click="activeStep = 0" icon-right="chevron-left"></b-button>
            </div>
            <div class="column">
              <b-button type="is-success" icon-left="users" expanded @click="checkOffCount()" :disabled="loading" :loading="loading">Award Off</b-button>
            </div>
          </div>
        </b-step-item>
        <b-step-item icon="check" label="Award Offs">
          <b-message type="is-info" role="alert" title="How To Award Offs" :closable="false" size="is-small">
            State the amount of offs to award. The maximum each user can hold at a time is <strong>5</strong>.
          </b-message>
          <!-- <div class="buttons">
            <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Recommend Off</b-button>
          </div> -->
          <div class="columns is-multiline user-list">
            <div class="column is-half" v-for="user of chosenUsers" :key="user.id">
              <AwardOffFormCard :user.sync="user" :loading="loading"></AwardOffFormCard>
            </div>
            <div class="column" v-if="chosenUsers.length === 0 ">
              <div class="box">
                <h4 class="title is-4 has-text-centered has-text-grey">No Users Found</h4>
              </div>
            </div>
          </div>
          <div class="columns is-mobile">
            <div class="column is-narrow">
              <b-button @click="activeStep = 1" icon-right="chevron-left"></b-button>
            </div>
            <div class="column">
              <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Award Off</b-button>
            </div>
          </div>
        </b-step-item>
      </b-steps>
      <!-- Table of Users to Award Offs  -->
      <!-- <b-table :data="filteredUsers" :loading="loading" :mobile-cards="!tableForm">
        <template slot-scope="props">
          <b-table-column field="name" label="Name" sortable searchable>
            <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.id } }">{{ props.row.name }}</router-link>
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
      </b-table> -->
      <!-- <div class="buttons">
        <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Award Off</b-button>
      </div> -->
    </form>
  </div>
</template>

<script>
import ToAwardOffCard from '../ToAwardOffCard.vue'
import AwardOffFormCard from '../AwardOffFormCard.vue'

export default {
  name: 'AwardOff',
  components: {
    ToAwardOffCard,
    AwardOffFormCard
  },
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
      users: [],
      activeStep: 0,
      search: ''
    }
  },
  computed: {
    filteredUsers () {
      const branch = this.$store.state.user.currentUser.branch
      return this.users.filter(val => (!this.search || val.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) && (!this.branchOnly || val.branch === branch))
    },
    chosenUsers () {
      return this.users.filter(val => val.awarding)
    }
  },
  methods: {
    checkOffCount () {
      this.loading = true
      if (this.chosenUsers.length === 0) {
        this.loading = false
      } else {
        Promise.all(this.chosenUsers.map((x) => this.$store.dispatch('user/getUserAwardedOffs', x.id).then((snapshot) => {
          x.remaining = snapshot.size / 2
          return snapshot.size / 2
        }))).then((val) => {
          this.loading = false
          this.activeStep = 2
        }).catch((err) => {
          console.error(err)
          this.$buefy.notification.open({
            message: 'Unable to check user offs',
            type: 'is-danger'
          })
        })
      }
    },
    /**
     * Submit the form to award offs.
     */
    submit () {
      this.awardOffForm.error = ''
      // Check if the form is filled.
      if (this.awardOffForm.description && this.awardOffForm.endDate) {
        this.loading = true
        const toCredit = this.chosenUsers.filter((val) => val.count > 0)
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
      this.activeStep = 0
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
          payload['awarding'] = false
          payload['count'] = 0
          temp.push(payload)
        }
        const branch = this.$store.state.user.currentUser.branch
        this.users = temp.filter(val => !val.disabled).sort((a, b) => {
          if ((a.branch === branch && b.branch === branch)) {
            return a.name > b.name ? 1 : -1
          } else if (a.branch === branch) {
            return -1
          } else {
            return a.name > b.name ? 1 : -1
          }
        })
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
