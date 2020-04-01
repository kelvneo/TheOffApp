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
          <span class="detail">{{ details ? details.phoneNumber : '...' }}</span>
        </div>
      </div>
      <b-message type="is-warning" role="alert" title="Work In Progress" :closable="false" size="is-small">
        This page is a work-in-progress. Do check back for more details.
      </b-message>
      <h4 class="title is-4">View Details</h4>
      <div class="buttons">
        <b-button icon-left="address-card" disabled expanded>Off Passes</b-button>
        <b-button icon-left="tag" disabled expanded>Pending Offs</b-button>
        <b-button icon-left="notes-medical" disabled expanded>Pending MAs</b-button>
      </div>
      <!-- <b-loading :is-full-page="false" :active.sync="loading"></b-loading> -->
    </section>
  </div>
</template>

<script>
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
</style>
