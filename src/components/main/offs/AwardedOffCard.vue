<template>
  <div class="box" :class="{'has-text-danger': expiring}">
    <div class="columns is-mobile is-vcentered">
      <div class="column">
        <p class="heading has-text-weight-bold is-size-6" :class="{'has-text-danger': expiring}">
          <template v-if="offData">{{ offData.description }}</template>
          <b-skeleton :active="!offData"></b-skeleton>
        </p>
        <p class="heading is-7 is-marginless" :class="{'has-text-danger': expiring}">
          <template v-if="offData">
            Use By:
            <span class="heading is-inline has-text-weight-bold is-size-7 is-marginless">
              {{ momentSecondsDate(offData.endDate.seconds) }}
            </span>
          </template>
          <b-skeleton :active="!offData"></b-skeleton>
        </p>
      </div>
      <div class="column is-narrow">
        <div class="level-item has-text-centered">
          <div>
            <p class="title" :class="{'has-text-danger': expiring}">
              <template v-if="offData">{{ offData.count }}</template>
              <b-skeleton :active="!offData"></b-skeleton>
            </p>
            <p class="heading">Off</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="offData && showDetails">
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
import dayjs from 'dayjs'

export default {
  name: 'AwardedOffCard',
  props: {
    offData: Object,
    users: Object,
    showDetails: Boolean
  },
  computed: {
    expiring () {
      if (!this.offData) {
        return false
      }
      const endDate = dayjs.unix(this.offData.endDate.seconds)
      return endDate.diff(dayjs(), 'days') <= 7
    }
  },
  methods: {
    momentSecondsDate (seconds) {
      return dayjs.unix(seconds).format('DD MMM YY')
    },
    momentSeconds (seconds) {
      return dayjs.unix(seconds).format('DD MMM YY, hhmm\\h\\r\\s')
    }
  }
}
</script>
