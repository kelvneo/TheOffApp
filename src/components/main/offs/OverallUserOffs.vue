<template>
  <div>
    <div class="level is-mobile">
      <div class="level-left">
        <h4 class="level-item title is-4">Your Offs</h4>
      </div>
      <div class="level-right">
        <!-- <b-button tag="router-link" class="level-item" :to="{ path: '/off' }">Details</b-button> -->
        <b-button class="level-item" :disabled="availableOffs <= 0" aria-controls="contentIdForA11y1"
          :type="applyOffOpen ? 'is-danger' : 'is-success'"
          @click="applyOffOpen = !applyOffOpen">
            {{ applyOffOpen ? 'Hide' : 'Apply' }}
        </b-button>
      </div>
    </div>
    <div class="columns is-mobile is-multiline is-centered">
      <router-link :to="{ path: '/off', query: { t: 1 } }"  class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
        replace @click.native="overallClick(1)">
        <div>
          <p class="heading">Recommending</p>
          <p class="title has-text-grey-light">{{ pendingOffs }}</p>
        </div>
      </router-link>
      <router-link :to="{ path: '/off', query: { t: 2 } }" class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
        replace @click.native="overallClick(2)">
        <div>
          <p class="heading">To Approve</p>
          <p class="title has-text-grey-light">{{ recommendedOffs }}</p>
        </div>
      </router-link>
      <router-link :to="{ path: '/off' }" class="column is-half-tablet is-full-mobile has-text-centered"
        replace @click.native="overallClick(0)">
        <div>
          <p class="heading">Usable</p>
          <p class="title has-text-info">{{ availableOffs }}</p>
        </div>
      </router-link>
      <!-- <div class="column is-one-quarter-tablet is-half-mobile has-text-centered">
        <div>
          <p class="heading">Raw Total</p>
          <p class="title has-text-grey">{{ totalOffs }}</p>
        </div>
      </div> -->
    </div>
    <b-collapse :open.sync="applyOffOpen" position="is-bottom" aria-id="contentIdForA11y1">
      <form class="box">
        <h4 class="title is-5">Apply Off</h4>
        <div class="columns is-mobile is-multiline">
          <b-field class="column is-half-desktop is-full-mobile" label="Date" horizontal>
            <b-datepicker placeholder="Click to select..." icon="calendar" :mobile-native="false" :disabled="submitting"
              :min-date="minDate" v-model="startDate" :unselectable-days-of-week="[0, 6]" :events="blockedDates">
            </b-datepicker>
          </b-field>
          <b-field class="column is-half-desktop is-full-mobile" label="Time" horizontal>
            <b-radio-button v-model="startMeridies" :disabled="availableOffs < 1 || submitting || pmOnly"
              native-value="FD">
              <span>Full Day</span>
            </b-radio-button>
            <!-- <b-radio-button v-model="startMeridies" :disabled="submitting || pmOnly"
              native-value="AM">
              <span>AM Only</span>
            </b-radio-button>
            <b-radio-button v-model="startMeridies" :disabled="submitting"
              native-value="PM">
              <span>PM Only</span>
            </b-radio-button> -->
          </b-field>
          <b-field label="Recommending" class="column is-half-desktop is-full-mobile" horizontal>
            <b-autocomplete
              v-model="recommendingField" :disabled="commandersLoading || submitting" :loading="commandersLoading" placeholder="e.g. Anne"
              :open-on-focus="true" :data="filteredRecommending" field="name" @select="option => recommending = option">
            </b-autocomplete>
          </b-field>
          <b-field label="Approving" class="column is-half-desktop is-full-mobile" horizontal>
            <b-autocomplete
              v-model="approvingField" :disabled="commandersLoading || submitting" :loading="commandersLoading" placeholder="e.g. Anne"
              :open-on-focus="true" :data="filteredApproving" field="name" @select="option => approving = option">
            </b-autocomplete>
          </b-field>
          <b-field class="column is-full">
            <b-button type="is-primary" expanded icon-left="edit" @click="applyOff()"
              :disabled="!canApplyOff || submitting" :loading="submitting">
              Apply Off
            </b-button>
          </b-field>
          <!-- <b-field class="column is-half" label="Amount to Take" horizontal>
            <b-numberinput :editable="false" :step="0.5" :min="0" :max="availableOffs" v-model="count" expanded></b-numberinput>
          </b-field>
          <div class="column is-full">
          </div> -->
          <!-- <b-field class="column is-half-desktop is-full-mobile" label="End Date" horizontal v-if="!endDateDisabled">
            <b-datepicker placeholder="Click to select..." icon="calendar" :mobile-native="false"
              v-model="endDate" :disabled="endDateDisabled" :unselectable-days-of-week="[0, 6]"
              :min-date="endDateMin.toDate()" :max-date="endDateMax.toDate()">
            </b-datepicker>
          </b-field>
          <b-field class="column is-half-desktop is-full-mobile" label="End Time" horizontal v-if="!endDateDisabled">
            <b-radio-button v-model="endMeridies" :disabled="endMeridiesDisabled" expanded
              native-value="AM">
              <span>To 1230H</span>
            </b-radio-button>
            <b-radio-button v-model="endMeridies" :disabled="endMeridiesDisabled" expanded
              native-value="PM">
              <span>To 1730H</span>
            </b-radio-button>
          </b-field>
          <b-field class="column is-full-mobile is-half-desktop" label="Amount" horizontal>
            <b-input :disabled="true" v-model="count" expanded></b-input>
          </b-field>
          <div class="column is-full">
          </div> -->
        </div>
      </form>
    </b-collapse>
  </div>
</template>

<script>
// import moment from 'moment'

export default {
  name: 'OverallUserOffs',
  data () {
    return {
      applyOffOpen: false,
      startDate: null,
      startMeridies: 'FD',
      commanders: [],
      commandersLoading: true,
      recommendingField: '',
      recommending: null,
      approvingField: '',
      approving: null,
      submitting: false
      // endDate: null,
      // endDateMin: moment(),
      // endDateMax: moment(),
      // endMeridies: null
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
    },
    filteredRecommending () {
      return this.commanders.filter((option) => {
        return option.name.toLowerCase().indexOf(this.recommendingField.toLowerCase()) >= 0
      })
    },
    filteredApproving () {
      return this.commanders.filter((option) => {
        return option.name.toLowerCase().indexOf(this.approvingField.toLowerCase()) >= 0
      })
    },
    canApplyOff () {
      return this.startDate && this.startMeridies && this.recommending && this.approving
    },
    minDate () {
      const date = new Date()
      if (date.getHours() < 18) {
        date.setDate(date.getDate() - 1)
      }
      return date
    },
    pmOnly () {
      const date = new Date()
      return this.startDate && this.startDate.getDate() === date.getDate() && date.getHours() > 11
    },
    blockedDates () {
      return this.$store.getters['user/unavailableDates'].map((val) => {
        if (val.getHours() < 12) {
          return {
            date: val,
            type: 'is-link'
          }
        } else {
          return {
            date: val,
            type: 'is-danger'
          }
        }
      })
    }
    // endDateDisabled () {
    //   return !(!!this.startDate && !!this.startMeridies) || this.availableOffs < 1
    // },
    // endMeridiesDisabled () {
    //   return this.endDateDisabled || this.endDate === null
    // },
    // count () {
    //   if (this.startDate && this.startMeridies && this.endDate && this.endMeridies) {
    //     return this.calcBusinessDays(this.startDate, this.endDate)
    //   }
    //   return null
    // }
    // endDate () {
    //   const endDate = new Date()
    //   const meridiesOffset = this.count % 1 === 0 && this.startMeridies === 'AM' ? 0.5 : 0
    //   endDate.setDate(this.startDate.getDate() + Math.max(this.count - meridiesOffset, 0))
    //   return endDate
    // },
    // endMeridies () {
    //   if (this.count === 0 || this.count % 1) {
    //     return this.startMeridies
    //   } else if (this.startMeridies === 'AM') {
    //     return 'PM'
    //   } else {
    //     return 'AM'
    //   }
    // }
  },
  created () {
    // this.startDate.setDate(this.startDate.getDate() + 1)
    // this.endDate.setDate(this.endDate.getDate() + 1)
  },
  mounted () {
    this.reset(false)
    this.$store.dispatch('common/getCommanders').then((data) => {
      Promise.all(data[this.$store.state.user.currentUser.depot].map((val) => {
        return this.$store.dispatch('common/getUser', val)
      })).then((val) => {
        this.commanders = val
        this.commandersLoading = false
      })
    })
  },
  methods: {
    reset (reset) {
      this.$store.dispatch('user/getCurrentUserOffs', reset)
      this.$store.dispatch('user/getCurrentUserPendingOffs', reset)
      this.$store.dispatch('user/getCurrentUserRecommendedOffs', reset)
      this.$store.dispatch('user/getCurrentUserOffPass', reset)
      this.applyOffOpen = false
      this.startDate = null
      this.startMeridies = 'FD'
      this.recommendingField = ''
      this.recommending = null
      this.approvingField = ''
      this.submitting = false
      this.approving = null
    },
    applyOff () {
      this.submitting = true

      const availableOffs = this.$store.getters['user/availableOffs']
      // const payload = [Object.assign({}, availableOffs[0])]
      // payload[0].requester = this.$store.state.credentials.user.uid
      // payload[0].recommender = this.recommending.id
      // payload[0].approver = this.approving.id
      // payload[0].requestDate = new Date()

      const payload = {
        requester: this.$store.state.credentials.user.uid,
        recommender: this.recommending.id,
        approver: this.approving.id,
        requestDate: new Date(),
        endDate: availableOffs[0].endDate
      }

      if (this.startMeridies === 'AM') {
        const date = new Date(this.startDate.getTime())
        date.setHours(8, 0)
        // payload[0].useDate = date
        payload.useDate = date
        payload.ids = [availableOffs[0].id]
      } else if (this.startMeridies === 'PM') {
        const date = new Date(this.startDate.getTime())
        date.setHours(12, 30)
        // payload[0].useDate = date
        payload.useDate = date
        payload.ids = [availableOffs[0].id]
      } else {
        const date1 = new Date(this.startDate.getTime())
        date1.setHours(8, 0)
        // payload[0].useDate = date1
        payload.useDate = date1
        payload.ids = [availableOffs[0].id, availableOffs[1].id]

        // // Create second off
        // payload.push(Object.assign({}, availableOffs[1]))
        // payload[1].recommender = this.recommending.id
        // payload[1].requester = this.$store.state.credentials.user.uid
        // payload[1].approver = this.approving.id
        // payload[1].requestDate = payload[0].requestDate
        // const date2 = new Date(this.startDate.getTime())
        // date2.setHours(12, 30)
        // payload[1].useDate = date2
      }
      // console.log(payload)
      this.$store.dispatch('user/applyOff', payload).then(() => {
        this.$buefy.notification.open({
          message: 'Successfully Applied Off!',
          type: 'is-success'
        })
        this.reset(true)
        this.$emit('off-applied')
      }).catch((err) => {
        this.$buefy.notification.open({
          message: 'Unable to apply off: ' + err.message,
          type: 'is-danger'
        })
        console.error(err)
      })
    },
    overallClick (val) {
      this.$emit('click-item', val)
    }
    // onStartUpdate () {
    //   this.endDate = null
    //   this.endMeridies = null
    //   this.endDateMin = moment(this.startDate)
    //   this.endDateMax = moment(this.startDate).add(this.availableOffs, 'd')
    //   if (this.availableOffs < 1) {
    //     this.endDate = this.startDate
    //     this.endMeridies = this.startMeridies
    //   }
    // },
    // calcBusinessDays (dDate1, dDate2) {
    //   const duration = moment(this.endDate).diff(moment(this.startDate), 'days')
    //   return duration
    // }
  }
}
</script>
