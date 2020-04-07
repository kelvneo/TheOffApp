<template>
  <div>
    <!-- <b-message type="is-warning" role="alert" title="Work In Progress" :closable="false" size="is-small">
      This page is a work-in-progress. Do check back for more details.
    </b-message>
    <div class="buttons" v-if="hasPerm('approve_users')">
      <b-button type="is-warning" expanded icon-left="edit" disabled>Edit Details</b-button>
      <b-button type="is-danger" expanded icon-left="user-slash" disabled>Delete User</b-button>
    </div>
    <h4 class="title is-4">View Details</h4>
    <div class="buttons">
      <b-button tag="router-link" :to="{ name: 'UserOffPassRecords', params: { id: this.id } }" icon-left="address-card" expanded>Off Passes</b-button>
      <b-button icon-left="tag" disabled expanded v-if="hasPerm('recommend_off')">Pending Offs</b-button>
      <b-button icon-left="notes-medical" disabled expanded v-if="hasPerm('recommend_off')">Pending MAs</b-button>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserDetailsRoot',
  props: {
    id: String
  },
  data () {
    return {
      loading: true,
      details: null
    }
  },
  computed: {
    ...mapGetters({
      hasPerm: 'user/hasPermission'
      // ...
    })
  },
  methods: {
    reset () {
    //   this.loading = true
    //   this.$store.dispatch('common/getUser', this.id).then((val) => {
    //     this.loading = false
    //     if (val) {
    //       this.details = val
    //     } else {
    //       this.$buefy.notification.open({
    //         message: 'Unable to find user',
    //         type: 'is-danger'
    //       })
    //       this.$router.replace('/users')
    //     }
    //   }).catch((err) => {
    //     console.error(err)
    //     this.$buefy.notification.open({
    //       message: 'Unable to find user',
    //       type: 'is-danger'
    //     })
    //     this.$router.replace('/users')
    //   })
    }
  },
  mounted () {
    this.reset()
  }
}
</script>

<style lang="sass" scoped>
.detail
  margin-left: 0.5rem
.id
  text-overflow: ellipsis
</style>
