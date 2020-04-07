<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <p class="has-text-centered">
          <span class="title is-4">{{ initials }}</span><br/>
          <span class="subtitle is-6" :class="{
            'has-text-info': offPass.description === 'Full Day Off',
            'has-text-primary': offPass.description === 'Half Day Off',
            'has-text-danger': offPass.description.startsWith('MA'),
          }">
            {{ offPass.description }}
          </span><br/>
        </p>
        <p class="has-text-centered">
          <span class="title is-6">{{ momentSeconds(offPass.startDate.seconds) }}</span><br/>
          <span class="subtitle is-6 has-text-grey-light">- To - </span><br/>
          <span class="title is-6">{{ momentSeconds(offPass.endDate.seconds) }}</span>
        </p>
        <hr/>
        <p class="has-text-grey">
          Approved By: <span class="title is-6 has-text-grey">{{ safeUser(offPass.approver) }}</span><br/>
          <span class="is-size-7" v-if="showDetails">Approved Date: <span class="title is-7 has-text-grey">{{ momentSeconds(offPass.approvedDate.seconds) }}</span><br/><br/></span>
          Recommended By: <span class="title is-6 has-text-grey">{{ safeUser(offPass.recommender) }}</span><br/>
          <span class="is-size-7" v-if="showDetails">Recommended Date: <span class="title is-7 has-text-grey">{{ momentSeconds(offPass.recommendedDate.seconds) }}</span><br/></span>
          <span class="is-size-7" v-if="showDetails">Request Date: <span class="title is-7 has-text-grey">{{ momentSeconds(offPass.requestDate.seconds) }}</span><br/></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'OffPassCard',
  props: {
    user: Object,
    users: Object,
    offPass: Object,
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    name () {
      return this.user.name
    },
    initials () {
      return this.user.initials
    }
  },
  methods: {
    safeUser (val) {
      return this.users[val] ? this.users[val].initials : '...'
    },
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HH:mmA')
    }
  }
}
</script>
