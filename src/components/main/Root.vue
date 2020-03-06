<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Welcome
          </h2>
          <h1 class="title">
            {{rank}} {{name}}
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <!-- <div class="columns">
          <div class="column is-6">
            <form class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Update Status
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <b-field horizontal label="AM">
                    <b-select placeholder="Select a status" expanded v-model="amStatus" v-on:input="onAMSelect" :loading="statusLoading" :disabled="statusLoading">
                      <option v-for="s in Object.keys(statusList)" :key="s" :value="s">{{s}}</option>
                    </b-select>
                    <b-input name="remarks" type="text" :placeholder="statusList[amStatus].remarks" expanded v-if="statusList[amStatus].remarks" v-model="amStatusRemarks" :loading="statusLoading" :disabled="statusLoading">
                    </b-input>
                    <b-select placeholder="Select an option" expanded v-model="amStatusRemarks" v-if="statusList[amStatus].selection" :loading="statusLoading" :disabled="statusLoading">
                      <option v-for="s in statusList[amStatus].selection" :key="s" :value="s">{{s}}</option>
                    </b-select>
                    <b-field v-if="statusList[amStatus].endDate">
                      <p class="control">
                        <span class="button is-static">End:</span>
                      </p>
                      <b-datepicker placeholder="Select End Date" v-model="amStatusRemarks" icon="calendar" :loading="statusLoading" :disabled="statusLoading">
                      </b-datepicker>
                    </b-field>
                  </b-field>
                  <b-field horizontal="">
                    <b-button type="is-info" outlined icon-left="copy" :disabled="statusLoading" @click="cloneToPM()" expanded>
                      Clone AM Status to PM
                    </b-button>
                  </b-field>
                  <b-field horizontal label="PM">
                    <b-select placeholder="Select a status" expanded v-model="pmStatus" v-on:input="onPMSelect" :loading="statusLoading" :disabled="statusLoading">
                      <option v-for="s in Object.keys(statusList)" :key="s" :value="s">{{s}}</option>
                    </b-select>
                    <b-input name="remarks" type="text" :placeholder="statusList[pmStatus].remarks" expanded v-if="statusList[pmStatus].remarks" v-model="pmStatusRemarks" :loading="statusLoading" :disabled="statusLoading">
                    </b-input>
                    <b-select placeholder="Select an option" expanded v-model="pmStatusRemarks" v-if="statusList[pmStatus].selection" :loading="statusLoading" :disabled="statusLoading">
                      <option v-for="s in statusList[pmStatus].selection" :key="s" :value="s">{{s}}</option>
                    </b-select>
                    <b-field v-if="statusList[pmStatus].endDate" :loading="statusLoading">
                      <p class="control">
                        <span class="button is-static">End:</span>
                      </p>
                      <b-datepicker placeholder="Select End Date" v-model="pmStatusRemarks" icon="calendar" :disabled="statusLoading">
                      </b-datepicker>
                    </b-field>
                  </b-field>
                </div>
              </div>
              <footer class="card-footer">
                <p class="card-footer-item">
                  <span class="tag is-light">Updated: {{ lastStatusUpdate.toLocaleString('en-GB') }}</span>
                </p>
                <a @click="cloneToPM" class="card-footer-item" :disabled="statusLoading">Update</a>
              </footer>
            </form>
          </div>
          <div class="column is-6">
            <form class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Update Temperature
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <b-field horizontal label="AM">
                    <b-field>
                      <b-input name="temperature" type="number" placeholder="36.5" expanded :loading="statusLoading">
                      </b-input>
                      <p class="control">
                        <span class="button is-static">°C</span>
                      </p>
                    </b-field>
                  </b-field>
                  <b-field horizontal label="PM">
                    <b-field>
                      <b-input name="temperature" type="number" placeholder="36.5" expanded :loading="statusLoading">
                      </b-input>
                      <p class="control">
                        <span class="button is-static">°C</span>
                      </p>
                    </b-field>
                  </b-field>
                </div>
              </div>
              <footer class="card-footer">
                <p class="card-footer-item">
                  <span class="tag is-light">Updated: {{ lastStatusUpdate.toLocaleString('en-GB') }}</span>
                </p>
                <a @click="cloneToPM" class="card-footer-item" :disabled="statusLoading">Update</a>
              </footer>
            </form>
          </div>
        </div> -->
        <div class="container">
          <b-notification type="is-warning" aria-close-label="Close notification" role="alert" :closable="false">
            You have been approved to use this site! Do check back soon as the features get implemented.
          </b-notification>
          <div class="level is-mobile">
            <div class="level-left">
              <h4 class="level-item title is-4">Your Offs</h4>
            </div>
            <div class="level-right">
              <b-button tag="router-link" class="level-item" :to="{ path: '/off' }">Details</b-button>
              <b-button tag="router-link" class="level-item" type="is-success" :to="{ path: '/off' }" disabled>Apply</b-button>
            </div>
          </div>
          <div class="columns is-mobile is-multiline">
            <div class="column is-one-quarter-tablet is-half-mobile has-text-centered">
              <div>
                <p class="heading">Total</p>
                <p class="title has-text-grey">{{ totalOffs }}</p>
              </div>
            </div>
            <div class="column is-one-quarter-tablet is-half-mobile has-text-centered">
              <div>
                <p class="heading">Usuable</p>
                <p class="title has-text-info">{{ totalOffs }}</p>
              </div>
            </div>
            <div class="column is-one-quarter-tablet is-half-mobile has-text-centered">
              <div>
                <p class="heading">Recommending</p>
                <p class="title has-text-grey-light">{{ pendingOffs }}</p>
              </div>
            </div>
            <div class="column is-one-quarter-tablet is-half-mobile has-text-centered">
              <div>
                <p class="heading">To Approve</p>
                <p class="title has-text-grey-light">{{ recommendedOffs }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="buttons">
          <b-button tag="router-link" to="/approve" type="is-primary" outlined icon-left="users">
            Approve Users
          </b-button>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'Root',
  data () {
    return {
      rank: '',
      name: ''
      // statusLoading: true,
      // statusList: {
      //   'Present': {
      //     selection: [
      //       'Falling In',
      //       'Not Falling In'
      //     ]
      //   },
      //   'Duty': {
      //     selection: [
      //       'IDS',
      //       'Ops',
      //       'NTM',
      //       'Duty Team',
      //       'Rest'
      //     ]
      //   },
      //   'Attached Out': {
      //     remarks: 'Location'
      //   },
      //   'RSO': {
      //     remarks: 'Location'
      //   },
      //   'RSI': {
      //     remarks: 'Location'
      //   },
      //   'MA': {
      //     remarks: 'Location'
      //   },
      //   'MC': {
      //     endDate: true
      //   },
      //   'Leave': {
      //     endDate: true
      //   },
      //   'Off': {
      //     endDate: true
      //   },
      //   'Course': {
      //     endDate: true
      //   },
      //   'Others': {
      //     remarks: 'Remarks'
      //   }
      // },
      // lastStatusUpdate: new Date(),
      // amStatus: 'Present',
      // amStatusRemarks: 'Falling In',
      // pmStatus: 'Present',
      // pmStatusRemarks: 'Falling In'
    }
  },
  computed: {
    totalOffs () {
      return this.$store.getters['user/totalOffCount'] === null ? '...' : this.$store.getters['user/totalOffCount']
    },
    availableOffs () {
      return this.$store.getters['user/availableOffCount'] === null ? '...' : this.$store.getters['user/availableOffCount']
    },
    pendingOffs () {
      return this.$store.getters['user/pendingOffCount'] === null ? '...' : this.$store.getters['user/pendingOffCount']
    },
    recommendedOffs () {
      return this.$store.getters['user/recommendedOffCount'] === null ? '...' : this.$store.getters['user/recommendedOffCount']
    }
  },
  methods: {
    // cloneToPM () {
    //   this.pmStatus = this.amStatus
    //   this.pmStatusRemarks = this.amStatusRemarks
    // },
    // onAMSelect (value) {
    //   if (this.statusList[value].selection) {
    //     this.amStatusRemarks = this.statusList[value].selection[0]
    //   } else if (this.statusList[value].endDate) {
    //     this.amStatusRemarks = new Date()
    //   } else {
    //     this.amStatusRemarks = ''
    //   }
    // },
    // onPMSelect (value) {
    //   if (this.statusList[value].selection) {
    //     this.pmStatusRemarks = this.statusList[value].selection[0]
    //   } else if (this.statusList[value].endDate) {
    //     this.pmStatusRemarks = new Date()
    //   } else {
    //     this.pmStatusRemarks = ''
    //   }
    // }
  },
  created () {
    this.rank = this.$store.state.user.currentUser.rank
    this.name = this.$store.state.user.currentUser.name
  },
  mounted () {
    this.$store.dispatch('user/getCurrentUserOffs')
    this.$store.dispatch('user/getCurrentUserPendingOffs')
    this.$store.dispatch('user/getCurrentUserRecommendedOffs')
  }
}
</script>
