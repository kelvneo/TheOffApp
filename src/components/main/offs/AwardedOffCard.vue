<template>
  <div class="box" :class="{'has-text-danger': expiring}">
    <div class="columns is-mobile is-vcentered">
      <div class="column">
        <p class="heading has-text-weight-bold is-size-6" :class="{'has-text-danger': expiring}">{{ offData.description }}</p>
        <p class="heading is-7 is-marginless" :class="{'has-text-danger': expiring}">Use By:
          <span class="heading is-inline has-text-weight-bold is-size-7 is-marginless">{{ momentSecondsDate(offData.endDate.seconds) }}</span>
        </p>
      </div>
      <div class="column is-narrow">
        <div class="level-item has-text-centered">
          <div>
            <p class="title" :class="{'has-text-danger': expiring}">{{ offData.count }}</p>
            <p class="heading">Off</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetails">
      <hr/>
      <p>
        <span class="is-size-7">Awarded On: {{ momentSeconds(offData.awardDate.seconds) }}</span><br/>
        <span class="is-size-7">
          Recommended By:
          <span v-if="users[offData.awardRecommended]">{{ users[offData.awardRecommended]['name'] }}</span>
          <span v-else>...</span>
        </span><br/>
        <span class="is-size-7">Awarded By:
          <span v-if="users[offData.awarded]">{{ users[offData.awarded]['name'] }}</span>
          <span v-else>...</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'AwardedOffCard',
  props: {
    offData: Object,
    users: Object,
    showDetails: Boolean
  },
  computed: {
    expiring () {
      const endDate = moment.unix(this.offData.endDate.seconds)
      return endDate.diff(moment(), 'days') <= 7
    }
  },
  methods: {
    momentSecondsDate (seconds) {
      return moment.unix(seconds).format('DD MMM YY')
    },
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HH:mmA')
    }
  }
}
</script>
