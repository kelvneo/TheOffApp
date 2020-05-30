<template>
  <div>
    <div class="columns is-mobile is-multiline">
      <div class="column">
        <b-icon icon="id-badge"></b-icon>
        <span class="detail">{{ details ? details.initials : '...' }}</span>
      </div>
      <div class="column">
        <b-icon icon="phone"></b-icon>
        <span class="detail" v-if="!details">...</span>
        <a :href="'tel:' + details.phoneNumber" class="detail" v-else>{{ details.phoneNumber }}</a>
      </div>
    </div>
    <!-- <h4 class="title is-4">Actions</h4> -->
    <div class="columns buttons" v-if="hasPerm('approve_users')">
      <div class="column">
        <b-button type="is-warning" tag="router-link" expanded icon-left="edit" :to="{ name: 'UserDetailsEdit', params: { id: this.id } }">Edit Details</b-button>
      </div>
      <div class="column">
        <b-button type="is-danger" :disabled="loading || isCurrentUser" :loading="loading" expanded icon-left="user-slash" v-if="details && !details.disabled" @click="changeUserStatus">Disable User</b-button>
        <b-button type="is-success" :disabled="loading || isCurrentUser" :loading="loading" expanded icon-left="user" v-else-if="details" @click="changeUserStatus">Enable User</b-button>
      </div>
    </div>
    <div class="columns user-buttons">
      <div class="column">
        <b-button tag="router-link" :to="{ name: 'UserOffPassRecords', params: { id: this.id } }" icon-left="address-card" expanded>Off Passes</b-button>
      </div>
      <div class="column">
        <b-button icon-left="tag" tag="router-link" :to="{ name: 'UserOffRecords', params: { id: this.id } }" expanded v-if="hasPerm('recommend_off')">Pending Offs</b-button>
      </div>
      <div class="column">
        <b-button icon-left="notes-medical" tag="router-link" :to="{ name: 'UserMARecords', params: { id: this.id } }" expanded v-if="hasPerm('recommend_off')">Pending MAs</b-button>
      </div>
    </div>
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
    isCurrentUser () {
      return this.id === this.$store.getters['credentials/id']
    },
    ...mapGetters({
      hasPerm: 'user/hasPermission'
      // ...
    })
  },
  methods: {
    changeUserStatus () {
      this.loading = true
      this.$store.dispatch('user/changeUserStatus', {
        id: this.id,
        disabled: !this.details.disabled
      }).then((val) => {
        if (val.data.success === false) {
          this.$buefy.notification.open({
            message: 'Unable to change user status',
            type: 'is-danger'
          })
          console.error(val)
        } else {
          this.$buefy.notification.open({
            message: 'Successfully changed user status',
            type: 'is-success'
          })
        }
        this.reset(true)
      }).catch((err) => {
        console.error(err)
        this.$buefy.notification.open({
          message: 'Unable to change user status',
          type: 'is-danger'
        })
        this.reset()
      })
    },
    reset (reset) {
      this.loading = true
      this.$store.dispatch(reset ? 'common/updateUser' : 'common/getUser', this.id).then((val) => {
        this.loading = false
        if (val) {
          this.details = val
        } else {
          this.$buefy.notification.open({
            message: 'Unable to find user',
            type: 'is-danger'
          })
          this.$router.replace('/users')
        }
      }).catch((err) => {
        console.error(err)
        this.$buefy.notification.open({
          message: 'Unable to find user',
          type: 'is-danger'
        })
        this.$router.replace('/users')
      })
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
