<template>
  <div>
    <div class="level is-mobile">
      <div class="level-left">
        <h4 class="level-item title is-4">Your MAs</h4>
      </div>
      <div class="level-right">
        <!-- <b-button tag="router-link" class="level-item" :to="{ path: '/off' }">Details</b-button> -->
        <b-button class="level-item" aria-controls="contentIdForA11y1"
          :type="applyMAOpen ? 'is-danger' : 'is-success'"
          @click="applyMAOpen = !applyMAOpen">
            {{ applyMAOpen ? 'Hide' : 'Apply' }}
        </b-button>
      </div>
    </div>
    <div class="columns is-mobile is-multiline is-centered">
      <router-link :to="{ path: '/off', query: { t: 3 } }"  class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
        replace @click.native="overallClick(3)">
        <div>
          <p class="heading">Recommending</p>
          <p class="title has-text-grey-light">{{ pendingMAs }}</p>
        </div>
      </router-link>
      <router-link :to="{ path: '/off', query: { t: 3 } }" class="column is-one-quarter-tablet is-half-mobile has-text-centered has-text-grey"
        replace @click.native="overallClick(4)">
        <div>
          <p class="heading">To Approve</p>
          <p class="title has-text-grey-light">{{ recommendedMAs }}</p>
        </div>
      </router-link>
    </div>
    <b-collapse :open.sync="applyMAOpen" position="is-bottom" aria-id="contentIdForA11y1">
      <form class="box">
        <h4 class="title is-5">Apply MA</h4>
        <div class="columns is-mobile is-multiline">
          <b-field class="column is-half-desktop is-full-mobile" label="Date" horizontal>
            <b-datepicker placeholder="Click to select..." icon="calendar" :mobile-native="false" :disabled="submitting"
              :min-date="minDate" v-model="startDate" :unselectable-days-of-week="[0, 6]" :events="blockedDates">
            </b-datepicker>
          </b-field>
          <b-field class="column is-half-desktop is-full-mobile" label="Time" horizontal>
            <b-radio-button v-model="startMeridies" :disabled="submitting || pmOnly"
              native-value="AM">
              <span>AM Only</span>
            </b-radio-button>
            <b-radio-button v-model="startMeridies" :disabled="submitting"
              native-value="PM">
              <span>PM Only</span>
            </b-radio-button>
          </b-field>
          <b-field label="Location" class="column is-half-desktop is-full-mobile" horizontal>
            <b-input v-model="location" :disabled="submitting || pmOnly" placeholder="Changi General Hospital"></b-input>
          </b-field>
          <div class="column is-hidden-mobile is-half-desktop"></div>
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
            <b-button type="is-primary" expanded icon-left="edit" @click="applyMA()"
              :disabled="!canApplyMA || submitting" :loading="submitting">
              Apply MA
            </b-button>
          </b-field>
        </div>
      </form>
    </b-collapse>
  </div>
</template>

<script>
// import moment from 'moment'

export default {
  name: 'OverallUserMAs',
  data () {
    return {
      applyMAOpen: false,
      startDate: null,
      startMeridies: null,
      commanders: [],
      commandersLoading: true,
      recommendingField: '',
      recommending: null,
      approvingField: '',
      approving: null,
      location: null,
      submitting: false
      // endDate: null,
      // endDateMin: moment(),
      // endDateMax: moment(),
      // endMeridies: null
    }
  },
  computed: {
    pendingMAs () {
      return this.$store.getters['user/pendingMACount'] === null ? '...' : this.$store.getters['user/pendingMACount']
    },
    recommendedMAs () {
      return this.$store.getters['user/recommendedMACount'] === null ? '...' : this.$store.getters['user/recommendedMACount']
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
    canApplyMA () {
      return this.startDate && this.startMeridies && this.recommending && this.approving && this.location
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
      const sameDay = this.startDate && this.startDate.getDate() === date.getDate() && this.startDate.getMonth() === date.getMonth() &&
        this.startDate.getYear() === date.getYear()
      return sameDay && date.getHours() > 11
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
      this.$store.dispatch('user/getCurrentUserPendingMAs', reset)
      this.$store.dispatch('user/getCurrentUserRecommendedMAs', reset)
      this.applyMAOpen = false
      this.startDate = null
      this.startMeridies = null
      this.recommendingField = ''
      this.recommending = null
      this.approvingField = ''
      this.submitting = false
      this.approving = null
      this.location = null
    },
    applyMA () {
      if (this.location) {
        this.submitting = true

        // const availableMAs = this.$store.getters['user/availableOffs']
        // const payload = [Object.assign({}, availableMAs[0])]
        // payload[0].requester = this.$store.state.credentials.user.uid
        // payload[0].recommender = this.recommending.id
        // payload[0].approver = this.approving.id
        // payload[0].requestDate = new Date()

        const payload = {
          requester: this.$store.state.credentials.user.uid,
          recommender: this.recommending.id,
          approver: this.approving.id,
          requestDate: new Date(),
          // endDate: availableMAs[0].endDate,
          location: this.location
        }

        if (this.startMeridies === 'AM') {
          const date = new Date(this.startDate.getTime())
          date.setHours(8, 0)
          // payload[0].useDate = date
          payload.useDate = date
        } else if (this.startMeridies === 'PM') {
          const date = new Date(this.startDate.getTime())
          date.setHours(12, 30)
          // payload[0].useDate = date
          payload.useDate = date
        }
        // console.log(payload)
        this.$store.dispatch('user/applyMA', payload).then(() => {
          this.$buefy.notification.open({
            message: 'Successfully Applied MA!',
            type: 'is-success'
          })
          this.reset(true)
          this.$emit('ma-applied')
        }).catch((err) => {
          this.$buefy.notification.open({
            message: 'Unable to apply MA: ' + err.message,
            type: 'is-danger'
          })
          console.error(err)
        })
      } else {
        this.$buefy.notification.open({
          message: 'Please fill in your location of MA.',
          type: 'is-danger'
        })
      }
    },
    overallClick (val) {
      this.$emit('click-item', val)
    }
    // onStartUpdate () {
    //   this.endDate = null
    //   this.endMeridies = null
    //   this.endDateMin = moment(this.startDate)
    //   this.endDateMax = moment(this.startDate).add(this.availableMAs, 'd')
    //   if (this.availableMAs < 1) {
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
