<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Welcome
          </h2>
          <h1 class="title">
            {{name}}
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
          <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
            This website is still under development and testing, apologies for the bugs!
          </b-message>
          <OverallUserOffs class="mb"></OverallUserOffs>
          <h4 class="title is-4">Upcoming Off Pass</h4>
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ name }}</p>
                  <p class="subtitle is-6">Off Pass</p>
                </div>
              </div>
              <div class="content has-text-grey has-text-centered">
                <p><b-icon icon="frown" size="is-large"></b-icon></p>
                <p>No Off Pass Found</p>
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
import OverallUserOffs from './offs/OverallUserOffs.vue'

export default {
  name: 'Root',
  components: {
    OverallUserOffs
  },
  data () {
    return {
      // rank: '',
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
    // this.rank = this.$store.state.user.currentUser.rank
    this.name = this.$store.state.user.currentUser.name
  }
}
</script>

<style lang="sass">
.mb
  margin-bottom: 2rem

</style>
