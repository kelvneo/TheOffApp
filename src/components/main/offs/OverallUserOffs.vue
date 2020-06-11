<template>
  <div>
    <div class="box">
      <div class="columns is-centered no-mb">
        <div class="column is-7">
          <div class="columns is-mobile is-vcentered no-mb">
            <div @click="overallClick(0)" class="column">
              <p class="heading has-text-weight-semibold is-size-5 has-text-grey-dark">
                Available
              </p>
            </div>
            <router-link :to="{ path: '/off' }" @click.native="overallClick(0)" class="column is-narrow">
              <div class="level-item has-text-centered">
                <div>
                  <p class="title has-text-weight-bold is-size-2" :class="{
                    'has-text-success': availableOffs,
                    'has-text-grey-light': !availableOffs
                  }">
                    <template v-if="availableOffs !== null">{{ availableOffs ? (availableOffs + "").padStart(2, "0") : 0 }}</template>
                    <b-skeleton :active="availableOffs === null" width="3rem"></b-skeleton>
                  </p>
                  <p class="heading has-text-weight-semibold" :class="{
                    'has-text-success': availableOffs,
                    'has-text-grey-light': !availableOffs
                  }">Off</p>
                </div>
              </div>
            </router-link>
          </div>
          <b-button class="level-item" aria-controls="contentIdForA11y1" outlined
            :type="applyOffOpen ? 'is-danger' : 'is-primary'" :icon-left="applyOffOpen ? 'chevron-up' : 'chevron-down'"
            @click="applyOffOpen = !applyOffOpen" expanded>
              {{ applyOffOpen ? 'Hide' : 'Apply Off / MA' }}
          </b-button>
        </div>
      </div>
      <b-collapse :open.sync="applyOffOpen" position="is-bottom" aria-id="contentIdForA11y1">
        <hr class="no-mt"/>
        <form>
          <p class="heading has-text-weight-bold is-size-6 has-text-centered mb">
            Apply Off / MA
          </p>
          <div class="columns is-mobile is-multiline">
            <b-field class="column is-full" horizontal label="OFF / MA">
              <b-radio-button v-model="selection" :disabled="availableOffs <= 0 || submitting"
                native-value="off">
                <span>Off</span>
              </b-radio-button>
              <b-radio-button v-model="selection" :disabled="submitting"
                native-value="ma" @input="(val) => {val ? startMeridies = 'AM' : null}">
                <span>Medical Appointment</span>
              </b-radio-button>
            </b-field>
            <b-field class="column is-full" label="Date" horizontal>
              <b-datepicker placeholder="Click to select..." icon="calendar" :mobile-native="false" :disabled="submitting"
                :min-date="minDate" v-model="startDate" :unselectable-days-of-week="[0, 6]" :events="blockedDates">
              </b-datepicker>
            </b-field>
            <b-field class="column is-full" label="Time" horizontal>
              <b-radio-button v-model="startMeridies" :disabled="availableOffs < 1 || selection !== 'off' || submitting || pmOnly"
                native-value="FD">
                <span>Full Day</span>
              </b-radio-button>
              <b-radio-button v-model="startMeridies" :disabled="submitting || pmOnly"
                native-value="AM">
                <span>AM Only</span>
              </b-radio-button>
              <b-radio-button v-model="startMeridies" :disabled="submitting"
                native-value="PM">
                <span>PM Only</span>
              </b-radio-button>
            </b-field>
            <b-field label="Location" class="column is-full" horizontal>
              <b-input v-model="location" :disabled="selection !== 'ma' || submitting" placeholder="Changi General Hospital"></b-input>
            </b-field>
            <b-field label="Recommending" class="column is-full" horizontal>
              <b-autocomplete
                v-model="recommendingField" :disabled="commandersLoading || submitting" :loading="commandersLoading" placeholder="e.g. Anne"
                :open-on-focus="true" :data="filteredRecommending" field="name" @select="option => recommending = option">
              </b-autocomplete>
            </b-field>
            <b-field label="Approving" class="column is-full" horizontal>
              <b-autocomplete
                v-model="approvingField" :disabled="commandersLoading || submitting" :loading="commandersLoading" placeholder="e.g. Anne"
                :open-on-focus="true" :data="filteredApproving" field="name" @select="option => approving = option">
              </b-autocomplete>
            </b-field>
            <b-field class="column is-full">
              <b-button type="is-primary" expanded icon-left="edit" @click="apply()"
                :disabled="!canApply || submitting" :loading="submitting">
                Apply
              </b-button>
            </b-field>
          </div>
        </form>
      </b-collapse>
      <hr/>
      <div class="columns is-mobile is-multiline is-centered">
        <div class="column is-full">
          <p class="heading has-text-weight-bold is-size-6 has-text-centered has-text-grey-dark">
            Pending Approval
          </p>
        </div>
        <router-link :to="{ path: '/off', query: { t: 1 } }" class="column is-half has-text-centered has-text-grey level-item"
          replace @click.native="overallClick(1)">
          <div>
            <p class="title has-text-grey-light">
              <template v-if="pendingOffs !== null">{{ pendingOffs }}</template>
              <b-skeleton :active="pendingOffs === null" width="3rem"></b-skeleton>
            </p>
            <p class="heading">Off</p>
          </div>
        </router-link>
        <router-link :to="{ path: '/off', query: { t: 3 } }" class="column is-half has-text-centered has-text-grey level-item"
          replace @click.native="overallClick(3)">
          <div>
            <p class="title has-text-grey-light">
              <template v-if="pendingMAs !== null">{{ pendingMAs }}</template>
              <b-skeleton :active="pendingMAs === null" width="3rem"></b-skeleton>
            </p>
            <p class="heading">MA</p>
          </div>
        </router-link>
      </div>
    </div>
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
      startMeridies: null,
      commanders: [],
      commandersLoading: true,
      recommendingField: '',
      recommending: null,
      approvingField: '',
      approving: null,
      submitting: false,
      selection: null,
      location: null
      // endDate: null,
      // endDateMin: moment(),
      // endDateMax: moment(),
      // endMeridies: null
    }
  },
  computed: {
    totalOffs () {
      return this.$store.getters['user/totalOffCount']
    },
    availableOffs () {
      return this.$store.getters['user/availableOffCount']
    },
    pendingOffs () {
      return (this.$store.getters['user/pendingOffCount'] === null || this.$store.getters['user/recommendedOffCount'] === null) ? null : this.$store.getters['user/pendingOffCount'] + this.$store.getters['user/recommendedOffCount']
    },
    pendingMAs () {
      return (this.$store.getters['user/pendingMACount'] === null || this.$store.getters['user/recommendedMACount'] === null) ? null : this.$store.getters['user/pendingMACount'] + this.$store.getters['user/recommendedMACount']
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
    canApply () {
      return this.startDate && this.startMeridies && this.recommending && this.approving && (this.selection === 'off' || (this.selection === 'ma' && this.location))
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
      this.$store.dispatch('user/getCurrentUserPendingMAs', reset)
      this.$store.dispatch('user/getCurrentUserRecommendedMAs', reset)
      this.applyOffOpen = false
      this.startDate = null
      this.startMeridies = null
      this.recommendingField = ''
      this.recommending = null
      this.approvingField = ''
      this.submitting = false
      this.approving = null
      this.selection = null
      this.location = null
    },
    apply () {
      if (this.selection === 'off') {
        this.applyOff()
      } else if (this.selection === 'ma') {
        this.applyMA()
      }
    },
    applyOff () {
      this.submitting = true

      const availableOffs = this.$store.getters['user/availableOffs']

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
      }

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
    applyMA () {
      if (this.location) {
        this.submitting = true

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
          this.$emit('off-applied')
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

<style lang="sass">
.no-mb
  margin-bottom: 0 !important
</style>
