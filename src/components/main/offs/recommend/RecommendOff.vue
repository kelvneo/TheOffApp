<template>
  <div>
    <b-message type="is-info" role="alert" title="How To Recommend to Award Offs" :closable="false" size="is-small">
      Choose an <strong>Approving</strong> personnel, <strong>Expiry Date</strong>, and provide a <strong>Description</strong> for the off. <br/>
      Find the personnel to award offs, then key in the amount you wish to recommend, then scroll up and press <strong>"Recommend Off"</strong>.
    </b-message>
    <div class="columns is-gapless">
      <div class="field column">
        <b-switch v-model="branchOnly">
          Show Branch Only
        </b-switch>
      </div>
    </div>
    <form action="" v-on:submit.prevent>
      <div class="columns is-multiline">
        <div class="column is-half-desktop is-full-mobile">
          <b-field label="Approving" :type="awardOffForm.error ? 'is-danger' : ''"  :message="awardOffForm.error">
            <b-autocomplete
              v-model="approvingField" :disabled="loading" :loading="loading" placeholder="e.g. Anne"
              :open-on-focus="true" :data="filteredApproving" field="name" @select="option => awardOffForm.approving = option">
            </b-autocomplete>
          </b-field>
        </div>
        <div class="column is-half-desktop is-full-mobile">
          <b-field label="Description" :type="awardOffForm.error ? 'is-danger' : ''"  :message="awardOffForm.error">
            <b-input type="text" v-model="awardOffForm.description" placeholder="Jan Performance Off" required :disabled="loading" :loading="loading">
            </b-input>
          </b-field>
        </div>
        <div class="column is-full">
          <b-field label="Expiry Date">
            <b-datepicker placeholder="Click to select..." icon="calendar" v-model="awardOffForm.endDate" :min-date="new Date()" :disabled="loading" :loading="loading">
            </b-datepicker>
          </b-field>
        </div>
      </div>
      <div class="buttons">
        <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Recommend Off</b-button>
      </div>
      <b-table :data="filteredUsers" :loading="loading" :mobile-cards="!tableForm">
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
      </b-table>
      <div class="buttons">
        <b-button type="is-success" icon-left="check" expanded @click="submit()" :disabled="loading" :loading="loading">Recommend Off</b-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'recommend-off-component',
  props: {
    tableForm: Boolean,
    showDetails: Boolean
  },
  data () {
    return {
      loading: true,
      users: [],
      user: {},
      commanders: [],
      approvingField: '',
      branchOnly: true,
      awardOffForm: {
        approving: null,
        description: '',
        endDate: new Date(),
        error: ''
      }
    }
  },
  computed: {
    filteredApproving () {
      return this.commanders.map((val) => this.user[val]).filter((option) => {
        return option && option.name.toLowerCase().indexOf(this.approvingField.toLowerCase()) >= 0
      })
    },
    filteredUsers () {
      const branch = this.$store.state.user.currentUser.branch
      return this.branchOnly ? this.users.filter(val => val.branch === branch) : this.users
    }
  },
  methods: {
    submit () {
      this.awardOffForm.error = ''
      if (this.awardOffForm.description && this.awardOffForm.endDate) {
        this.loading = true
        const toCredit = this.users.filter((val) => val.count > 0)
        if (toCredit.length === 0) {
          this.loading = false
        } else {
          const recommenderID = this.$store.state.credentials.user.uid
          const payload = this.users.filter((val) => val.count > 0).map((val) => {
            return {
              'awardee': val.id,
              'awardDate': new Date(),
              'recommender': recommenderID,
              'description': this.awardOffForm.description,
              'approver': this.awardOffForm.approving.id,
              'count': Number(val.count),
              'endDate': new Date(
                this.awardOffForm.endDate.getFullYear(),
                this.awardOffForm.endDate.getMonth(),
                this.awardOffForm.endDate.getDate(),
                23, 59, 59
              )
            }
          })
          // console.log(payload)
          this.$store.dispatch('user/recommendOffAward', payload).then(() => {
            this.$buefy.notification.open({
              message: 'Offs have been recommended!',
              type: 'is-success'
            })
            this.loading = false
            this.reset()
          }).catch((err) => {
            this.$buefy.notification.open({
              message: 'Unable to recommend offs',
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
      this.awardOffForm = {
        description: '',
        endDate: new Date(),
        approving: null
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
        this.user = data
        this.loading = false
      })
    }
  },
  mounted () {
    this.$store.dispatch('common/getCommanders').then((data) => {
      this.commanders = data[this.$store.state.user.currentUser.depot]
      this.reset()
    })
  }
}
</script>
