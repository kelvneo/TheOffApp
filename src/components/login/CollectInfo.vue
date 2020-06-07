<template>
  <section class="hero is-fullheight is-info is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
            Looks like you are new!
        </h1>
        <h2 class="subtitle">
            Please fill in some information for us.
        </h2>
        <form action=""  v-on:submit.prevent>
          <b-field :type="error ? 'is-danger' : ''"  :message="error" label="Name / Initials" custom-class="has-text-light" horizontal>
            <b-field class="columns is-mobile is-gapless">
              <!-- <b-autocomplete v-model="rank" placeholder="3SG" :open-on-focus="true" :data="filteredRankArray"
              @select="option => rank = option" :keep-first="true" :disabled="loading" :loading="loading" class="column is-4">
              </b-autocomplete> -->
              <b-input placeholder="John Tan" v-model="name" expanded focus :disabled="loading" :loading="loading" class="column is-7">
              </b-input>
              <b-input placeholder="A G Tan" v-model="initials" expanded focus :disabled="loading" :loading="loading" class="column is-5">
              </b-input>
            </b-field>
          </b-field>
          <b-field :type="error ? 'is-danger' : ''"  :message="error" label="Depot / Dept" custom-class="has-text-light" horizontal>
            <b-field class="columns is-mobile is-gapless">
              <b-select placeholder="HQ GSAB" v-model="depot" :disabled="loading" class="column is-6" expanded v-on:input="onDepotSelect">
                <option v-for="d in Object.keys(depots)" :key="d" :value="d">{{d}}</option>
              </b-select>
              <b-select placeholder="S3" v-model="branch" class="column is-6" expanded :disabled="!depot || loading">
                <option v-for="b in depots[depot]" :key="b" :value="b">{{b}}</option>
              </b-select>
            </b-field>
          </b-field>
          <b-field horizontal>
            <b-field grouped>
              <p class="control">
                <b-button type="is-info" inverted outlined icon-left="user-check" id="phone-login" :disabled="loading" @click="submit()">
                  Submit
                </b-button>
              </p>
              <p class="control">
                <b-button type="is-primary" inverted outlined icon-left="sign-out-alt" :disabled="loading" @click="logout()">
                  Logout
                </b-button>
              </p>
            </b-field>
          </b-field>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'CollectInfo',
  components: {
    // HelloWorld
  },
  data () {
    return {
      // ranks: [
      //   'MR.', 'MRS.', 'MS.', 'MDM.', 'DR.', 'GEN', 'ADM', 'LG', 'VADM', 'MG', 'RADM2', 'BG', 'RADM1', 'ME8', 'COL', 'ME7', 'SLTC', 'LTC', 'ME6', 'MAJ', 'ME5',
      //   'CPT', 'ME4', 'LTA', '2LT', 'CWO', 'SWO', 'MWO', '1WO', 'ME3', '2WO', '3WO', 'MSG', 'ME2', 'SSG', '1SG', '2SG', 'ME1',
      //   '3SG', 'CFC', 'CPL', 'LCP', 'PFC', 'PTE', 'REC'
      // ].reverse(),
      depots: {
        'HQ GSAB': ['MP/Logs', 'S3', 'CO/RSM', 'TAD']
        // 'PAD': ['TSU', 'Cluster', 'DCC', 'Orderly'],
        // 'PLAD': ['TASS', 'Storage', 'DCC', 'Orderly'],
        // 'PYAD': ['Storage', 'DCC', 'Orderly'],
        // 'RO': ['Hendon', 'Tekong', 'Nee Soon']
      },
      // rank: '',
      name: '',
      initials: '',
      depot: '',
      branch: '',
      loading: false,
      error: ''
    }
  },
  computed: {
    // filteredRankArray () {
    //   return this.ranks.filter(option => !this.rank || option
    //     .toString()
    //     .toUpperCase()
    //     .indexOf(this.rank.toUpperCase()) >= 0)
    // }
  },
  methods: {
    submit () {
      this.loading = true
      this.error = ''
      if (this.initials && this.name && this.depot && this.branch) {
        this.$store.dispatch('user/createTempUser', {
          id: this.$store.state.credentials.user.uid,
          data: {
            initials: this.initials,
            name: this.name,
            depot: this.depot,
            branch: this.branch,
            phoneNumber: this.$store.state.credentials.user.phoneNumber
          }
        }).then(() => {
          this.$store.dispatch('user/getTempUser', this.$store.state.credentials.user.uid).then((tu) => {
            this.loading = false
            this.$store.commit('user/setTempUser', tu.data())
            this.$router.replace('/login/wait')
          })
        }).catch((err) => {
          console.error(err)
          this.loading = false
          this.error = err.message
        })
      } else {
        this.loading = false
        this.error = 'Check your fields again'
      }
    },
    onDepotSelect () {
      this.branch = this.depots[this.depot][0]
    },
    logout () {
      this.$store.dispatch('credentials/logout').then(() => {
        this.$router.push('/login')
      })
    }
  },
  created () {

  }
}
</script>
