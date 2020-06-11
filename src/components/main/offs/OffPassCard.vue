<template>
  <div class="box">
    <div class="">
      <div class="content">
        <p class="has-text-centered">
          <span class="title is-4">
            <template v-if="user">{{ initials }}</template>
            <b-skeleton :active="!user"></b-skeleton>
          </span><br/>
          <span class="subtitle is-6" :class="{
              'has-text-info': offPass && offPass.description === 'Full Day Off',
              'has-text-primary': offPass && offPass.description === 'Half Day Off',
              'has-text-danger': offPass && offPass.description.startsWith('MA'),
            }">
            <template v-if="offPass">{{ offPass.description }}</template>
            <b-skeleton :active="!offPass"></b-skeleton>
          </span><br/>
        </p>
        <p class="has-text-centered">
          <template v-if="offPass">
            <span class="title is-6">{{ momentSeconds(offPass.startDate.seconds) }}</span><br/>
            <span class="subtitle is-6 has-text-grey-light">- To - </span><br/>
            <span class="title is-6">{{ momentSeconds(offPass.endDate.seconds) }}</span>
          </template>
          <b-skeleton :active="!offPass" :count="3"></b-skeleton>
        </p>
        <hr/>
        <p class="has-text-grey">
          <template v-if="offPass">
            <span>
              <template v-if="users[offPass.approver]">
                Approved By: <span class="title is-6 has-text-grey">{{ safeUser(offPass.approver) }}</span>
              </template>
              <b-skeleton :active="!users[offPass.approver]"></b-skeleton>
            </span><br/>
            <span class="is-size-7" v-if="showDetails">Approved Date: <span class="title is-7 has-text-grey">{{ momentSeconds(offPass.approvedDate.seconds) }}</span><br/><br/></span>
            <span>
              <template v-if="users[offPass.recommender]">
              Recommended By: <span class="title is-6 has-text-grey">{{ safeUser(offPass.recommender) }}</span>
              </template>
              <b-skeleton :active="!users[offPass.recommender]"></b-skeleton>
            </span><br/>
            <span class="is-size-7" v-if="showDetails">Recommended Date: <span class="title is-7 has-text-grey">{{ momentSeconds(offPass.recommendedDate.seconds) }}</span><br/></span>
            <span class="is-size-7" v-if="showDetails">Request Date: <span class="title is-7 has-text-grey">{{ momentSeconds(offPass.requestDate.seconds) }}</span><br/></span>
          </template>
          <b-skeleton :active="!offPass" :count="showDetails ? 5 : 2"></b-skeleton>
        </p>
        <div v-if="isApprover">
          <template v-if="offPass">
            <div class="columns buttons">
              <div class="column" v-if="!offPass.description.startsWith('MA')">
                <b-button type="is-success" outlined size="is-small" expanded icon-left="donate" disabled>Cancel & Refund</b-button>
              </div>
              <div class="column">
                <b-button type="is-danger" outlined size="is-small" expanded icon-left="trash" disabled>Delete Off Pass</b-button>
              </div>
            </div>
          </template>
          <b-skeleton :active="!offPass" :count="1"></b-skeleton>
        </div>
        <div v-else-if="isUser">
          <template v-if="offPass">
            <b-button type="is-danger" outlined size="is-small" expanded icon-left="times" disabled>Cancel Off Pass</b-button>
          </template>
          <b-skeleton :active="!offPass" :count="1"></b-skeleton>
        </div>
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
    },
    isUser () {
      return this.offPass && this.user && (this.user.id === this.$store.getters['credentials/id'])
    },
    isApprover () {
      return this.offPass && this.offPass.approver === this.$store.getters['credentials/id']
    }
  },
  methods: {
    safeUser (val) {
      return this.users[val] ? this.users[val].initials : '...'
    },
    momentSeconds (seconds) {
      return moment.unix(seconds).format('DD MMM YY, HHmm\\h\\r\\s')
    }
  }
}
</script>
