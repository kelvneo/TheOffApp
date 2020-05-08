<template>
  <div class="container">
    <section class="section">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/users">Users</router-link></li>
          <li class="is-active">
            <router-link :to="{ name: 'UserDetailsRoot', params: { id: this.id } }" aria-current="page">
              <template v-if="details">{{ details.name }}</template>
              <b-skeleton :active="!details"></b-skeleton>
            </router-link>
          </li>
        </ul>
      </nav>
      <h2 class="title">
        <router-link :to="{ name: 'UserDetailsRoot', params: { id: this.id } }" aria-current="page" class="has-text-info">
          <template v-if="details">{{ details.name }}</template>
          <b-skeleton :active="!details"></b-skeleton>
        </router-link>
      </h2>
      <h4 class="subtitle">
        <template v-if="details">
          {{ details.depot + ' - ' + details.branch  }}
          <b-tag>ID: {{ details.id }}</b-tag>
        </template>
        <b-skeleton :active="!details"></b-skeleton>
      </h4>
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

<style lang="sass">
.detail
  margin-left: 0.5rem
.id
  text-overflow: ellipsis
.user-buttons > .column
  padding: 0.25rem 0.75rem
</style>
