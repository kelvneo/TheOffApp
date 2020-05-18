<template>
  <div>
    <div class="columns user-buttons">
      <div class="column">
        <b-button tag="router-link" type="is-light" class="has-text-grey"
          :to="{ name: 'UserDetailsRoot', params: { id: this.id } }" icon-left="chevron-left">Back to Profile</b-button>
      </div>
    </div>
    <h4 class="title is-4">Edit User Details</h4>
    <form action=""  v-on:submit.prevent class="mb">
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
              <b-button type="is-warning" icon-left="edit" id="phone-login" :disabled="loading" @click="submit()">
                Update
              </b-button>
            </p>
          </b-field>
        </b-field>
      </template>
      <b-skeleton size="is-large" :count="5" :active="!details"></b-skeleton>
    </form>
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
      error: '',
      loading: true,
      details: null
    }
  },
  computed: {
  },
  methods: {
    onDepotSelect () {
      this.details.branch = this.depots[this.depot][0]
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
          this.loading = false
        }).catch((err) => {
          this.$buefy.notification.open({
            message: 'Failed to update user details.',
            type: 'is-danger'
          })
          console.error(err)
          this.loading = false
        })
      }
    },
    reset () {
      this.loading = true
      this.$store.dispatch('common/getUser', this.id).then((val) => {
        this.loading = false
        if (val) {
          this.details = val
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
