<template>
  <div>
    <div class="columns user-buttons">
      <div class="column">
        <b-button tag="router-link" type="is-light" class="has-text-grey"
          :to="{ name: 'UserDetailsRoot', params: { id: this.id } }" icon-left="chevron-left">Back to Profile</b-button>
      </div>
    </div>
    <h4 class="title is-4">Edit User Details</h4>
    <div class="columns">
      <div class="column">
        <form action=""  v-on:submit.prevent class="box">
          <h5 class="title is-5 ">General</h5>
          <b-message type="is-info" size="is-small">
            Due to the backend restrictions, changing of phone numbers is not allowed. You can recreate an account, and delete the existing account to circumvent this.
          </b-message>
          <template v-if="details">
            <b-field :type="error ? 'is-danger' : ''"  :message="error" label="Name / Initials"  horizontal>
              <b-field class="columns is-mobile is-gapless">
                <!-- <b-autocomplete v-model="rank" placeholder="3SG" :open-on-focus="true" :data="filteredRankArray"
                @select="option => rank = option" :keep-first="true" :disabled="loading" :loading="loading" class="column is-4">
                </b-autocomplete> -->
                <b-input placeholder="John Tan" v-model="details.name" expanded focus :disabled="loading" :loading="loading" class="column is-7">
                </b-input>
                <b-input placeholder="A G Tan" v-model="details.initials" expanded focus :disabled="loading" :loading="loading" class="column is-5">
                </b-input>
              </b-field>
            </b-field>
            <b-field :type="error ? 'is-danger' : ''"  :message="error" label="Depot / Dept" horizontal>
              <b-field class="columns is-mobile is-gapless">
                <b-select placeholder="HQ GSAB" v-model="details.depot" :disabled="loading" class="column is-6" expanded v-on:input="onDepotSelect">
                  <option v-for="d in Object.keys(depots)" :key="d" :value="d">{{d}}</option>
                </b-select>
                <b-select placeholder="S3" v-model="details.branch" class="column is-6" expanded :disabled="!details.depot || loading">
                  <option v-for="b in depots[details.depot]" :key="b" :value="b">{{b}}</option>
                </b-select>
              </b-field>
            </b-field>
            <b-field horizontal>
              <b-field grouped>
                <p class="control">
                  <b-button type="is-warning" icon-left="edit" :disabled="loading" @click="submit()">
                    Update
                  </b-button>
                </p>
              </b-field>
            </b-field>
          </template>
          <b-skeleton size="is-large" :count="5" :active="!details"></b-skeleton>
        </form>
      </div>
      <div class="column">
        <form action="" v-on:submit.prevent class="box">
          <h5 class="title is-5 has-text-danger">Permissions</h5>
          <b-message type="is-danger" size="is-small" has-icon>
            Assigning "Approve / Edit Users" will allow the user to add permissions of their own.
          </b-message>
          <b-message type="is-warning" size="is-small" has-icon>
            "Approve Off / MAs" should be ticked with "Recommend Off / MAs", and both should be ticked with "View All Users"
          </b-message>
          <template v-if="userPerms">
            <div class="field" v-for="(display, key) in permissions" :key="key">
              <b-checkbox v-model="userPerms" :native-value="key" :disabled="loading || (isCurrentUser && key === 'approve_users')">
                {{ display }}
              </b-checkbox>
            </div>
          </template>
          <b-skeleton size="is-large" :count="Object.keys(permissions).length" :active="!userPerms"></b-skeleton>
          <p class="control">
            <b-button type="is-danger" icon-left="edit" :disabled="loading" @click="updatePerms()">
              Update
            </b-button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDetailsEdit',
  props: {
    id: String
  },
  data () {
    return {
      ranks: [
        'MR.', 'MRS.', 'MS.', 'MDM.', 'DR.', 'GEN', 'ADM', 'LG', 'VADM', 'MG', 'RADM2', 'BG', 'RADM1', 'ME8', 'COL', 'ME7', 'SLTC', 'LTC', 'ME6', 'MAJ', 'ME5',
        'CPT', 'ME4', 'LTA', '2LT', 'CWO', 'SWO', 'MWO', '1WO', 'ME3', '2WO', '3WO', 'MSG', 'ME2', 'SSG', '1SG', '2SG', 'ME1',
        '3SG', 'CFC', 'CPL', 'LCP', 'PFC', 'PTE', 'REC'
      ].reverse(),
      depots: {
        'HQ GSAB': ['MP/Logs', 'S3', 'CO/RSM', 'TAD']
        // 'PAD': ['TSU', 'Cluster', 'DCC', 'Orderly'],
        // 'PLAD': ['TASS', 'Storage', 'DCC', 'Orderly'],
        // 'PYAD': ['Storage', 'DCC', 'Orderly'],
        // 'RO': ['Hendon', 'Tekong', 'Nee Soon']
      },
      permissions: {
        'cos': 'View All Users',
        'recommend_off': 'Recommend Offs / MAs',
        'approve_off': 'Approve Offs / MAs',
        'approve_users': 'Approve / Edit User'
      },
      userPerms: null,
      clonedUserPerms: null,
      error: '',
      loading: true,
      details: null
    }
  },
  computed: {
    isCurrentUser () {
      return this.id === this.$store.getters['credentials/id']
    }
  },
  methods: {
    onDepotSelect () {
      this.details.branch = this.depots[this.details.depot][0]
    },
    submit () {
      if (!this.details.branch || !this.details.depot || !this.details.name || !this.details.initials) {
        this.$buefy.notification.open({
          message: 'Check the details again.',
          type: 'is-danger'
        })
        this.error = 'Check the details again.'
      } else {
        const payload = {
          id: this.id,
          data: this.details
        }
        this.loading = true
        this.$store.dispatch('user/updateUser', payload).then(() => {
          this.$buefy.notification.open({
            message: 'Updated user details!',
            type: 'is-success'
          })
          this.reset()
        }).catch((err) => {
          this.$buefy.notification.open({
            message: 'Failed to update user details.',
            type: 'is-danger'
          })
          console.error(err)
          this.reset()
        })
      }
    },
    updatePerms () {
      const promises = []
      const newUserPermSet = new Set(this.userPerms)
      const oldUserPermSet = new Set(this.clonedUserPerms)
      if (!newUserPermSet.has('cos') && this.userPerms.length) {
        this.$buefy.notification.open({
          message: 'View All Users is required!',
          type: 'is-danger'
        })
        return
      } else if (!newUserPermSet.has('recommend_off') && newUserPermSet.has('approve_off')) {
        this.$buefy.notification.open({
          message: 'Recommend Off / MA is required!',
          type: 'is-danger'
        })
        return
      }

      // Remove or add the user as a commander of a depot if they have been removed or assigned recommended_off permission.
      if (oldUserPermSet.has('recommend_off') && !newUserPermSet.has('recommend_off')) {
        promises.push(this.$store.dispatch('user/removeCommander', {
          id: this.id,
          depot: this.details.depot
        }))
      } else if (!oldUserPermSet.has('recommend_off') && newUserPermSet.has('recommend_off')) {
        promises.push(this.$store.dispatch('user/addCommander', {
          id: this.id,
          depot: this.details.depot
        }))
      }

      const toDelete = this.clonedUserPerms.filter((val) => {
        // Prevent the user from deleting their own approve_user permission
        if (newUserPermSet.has(val) || (val === 'approve_users' && this.isCurrentUser)) {
          return false
        } else {
          return true
        }
      }).map((val) => {
        return this.$store.dispatch('user/deleteUserPermission', {
          id: this.id,
          data: val
        })
      })
      const toAdd = this.userPerms.filter((val) => !oldUserPermSet.has(val)).map((val) => {
        return this.$store.dispatch('user/addUserPermission', {
          id: this.id,
          data: val
        })
      })
      promises.push(...toDelete, ...toAdd)
      if (promises.length) {
        this.loading = true
        Promise.all(promises).then((res) => {
          this.$buefy.notification.open({
            message: 'Updated user permissions!',
            type: 'is-success'
          })
          this.reset()
        }).catch((err) => {
          this.$buefy.notification.open({
            message: 'Unable to update permissions',
            type: 'is-danger'
          })
          console.error(err)
          this.reset()
        })
      }
    },
    reset () {
      this.loading = true
      this.userPerms = null
      this.clonedUserPerms = null
      this.$store.dispatch('common/getUser', this.id).then((val) => {
        if (val) {
          this.details = val
          this.$store.dispatch('user/getUserPermissions', this.id).then((permVal) => {
            this.loading = false
            if (permVal.empty) {
              this.userPerms = []
              this.clonedUserPerms = []
            } else {
              this.userPerms = permVal.docs.map((doc) => doc.id)
              this.clonedUserPerms = [...this.userPerms]
            }
          })
        } else {
          this.$buefy.notification.open({
            message: 'Unable to find user',
            type: 'is-danger'
          })
          this.$router.replace('/users')
        }
      }).catch((err) => {
        console.error(err)
        this.$buefy.notification.open({
          message: 'Unable to find user',
          type: 'is-danger'
        })
        this.$router.replace('/users')
      })
    }
  },
  mounted () {
    this.reset()
  }
}
</script>
