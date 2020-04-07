<template>
  <div class="container">
    <section class="section">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/users">Users</router-link></li>
          <li class="is-active"><a href="#" aria-current="page">{{ details ? details.name : '...' }}</a></li>
        </ul>
      </nav>
      <h2 class="title">
        {{ details ? details.name : '...' }}
      </h2>
      <h4 class="subtitle">
        {{ details ? details.depot + ' - ' + details.branch : '...' }}
        <b-tag>ID: {{ details ? details.id : '...' }}</b-tag>
      </h4>
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
      <b-message type="is-warning" role="alert" title="Work In Progress" :closable="false" size="is-small">
        This page is a work-in-progress. Do check back for more details.
      </b-message>
      <h4 class="title is-4">Information</h4>
      <div class="columns buttons" v-if="hasPerm('approve_users')">
        <div class="column">
          <b-button type="is-warning" expanded icon-left="edit" disabled>Edit Details</b-button>
        </div>
        <div class="column">
          <b-button type="is-danger" expanded icon-left="user-slash" disabled>Delete User</b-button>
        </div>
      </div>
      <div class="columns user-buttons">
        <div class="column">
          <b-button tag="router-link" :to="{ name: 'UserOffPassRecords', params: { id: this.id } }" icon-left="address-card" expanded>Off Passes</b-button>
        </div>
        <div class="column">
          <b-button icon-left="tag" disabled expanded v-if="hasPerm('recommend_off')">Pending Offs</b-button>
        </div>
        <div class="column">
          <b-button icon-left="notes-medical" disabled expanded v-if="hasPerm('recommend_off')">Pending MAs</b-button>
        </div>
      </div>
      <router-view/>
      <!-- <b-loading :is-full-page="false" :active.sync="loading"></b-loading> -->
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserDetails',
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
      this.loading = true
      this.$store.dispatch('common/getUser', this.id).then((val) => {
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
.user-buttons > .column
  padding: 0.25rem 0.75rem
</style>
