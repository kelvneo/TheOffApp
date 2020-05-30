<template>
  <router-link :to="user ? { name: 'UserDetailsRoot', params: { id: user.id } } : { name: 'UserList' }">
    <div class="box">
      <div class="columns is-mobile is-vcentered">
        <div class="column">
          <p class="subtitle is-7">
            <template v-if="user">
              <b-taglist attached>
                <b-tag rounded type="is-danger" class="is-light" v-if="user.disabled"><b-icon type="is-white" icon="ban" size="is-small"></b-icon></b-tag>
                <b-tag rounded type="is-primary" class="is-light">{{ user.depot }}</b-tag>
                <b-tag rounded type="is-info" class="is-light">{{ user.branch }}</b-tag>
              </b-taglist>
            </template>
            <b-skeleton :active="!user"></b-skeleton>
          </p>
          <p class="title is-4 less-mb" :class="{
            'has-text-grey-lighter': user && user.disabled
          }">
            <template v-if="user">{{ user.name }}</template>
            <b-skeleton :active="!user"></b-skeleton>
          </p>
          <b-tag v-if="showDetails" type="is-grey" class="is-light" size="is-small">{{ user.id }}</b-tag>
        </div>
        <div class="column is-narrow">
          <div class="level-item has-text-centered">
            <div>
              <p class="title">
                <template v-if="user"><b-icon icon="chevron-right" size="is-small" type="is-grey-lighter"></b-icon></template>
                <b-skeleton :active="!user"></b-skeleton>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'UserListItemCard',
  props: {
    user: Object,
    showDetails: Boolean
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="sass">
.less-mb
  margin-bottom: 0.25rem !important
</style>
