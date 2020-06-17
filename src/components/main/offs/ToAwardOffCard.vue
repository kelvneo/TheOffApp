<template>
  <div class="box">
    <div class="columns is-mobile is-vcentered">
      <div class="column">
        <p class="heading has-text-weight-bold is-size-6">
          <template v-if="!loading"><router-link :to="{ name: 'UserDetailsRoot', params: { id: user.id } }">{{ user.name }}</router-link></template>
          <b-skeleton :active="loading"></b-skeleton>
        </p>
        <p class="heading is-7 is-marginless">
          <template v-if="!loading">
            {{ user.depot }} / {{ user.branch }}
          </template>
          <b-skeleton :active="loading"></b-skeleton>
        </p>
      </div>
      <div class="column is-narrow">
        <div class="level-item">
          <div class="field">
            <b-checkbox size="is-medium" v-model="user.awarding" :disabled="loading"></b-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToAwardOffCard',
  props: {
    user: Object,
    loading: Boolean
  },
  computed: {
  },
  methods: {
  }
}
</script>
