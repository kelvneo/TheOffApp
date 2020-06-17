<template>
  <div class="box">
    <div class="less-mb">
      <h4 class="title is-4"><router-link :to="{ name: 'UserDetailsRoot', params: { id: user.id } }">{{ user.name }}</router-link></h4>
      <h6 class="subtitle is-6" :class="{
        'has-text-danger': user.remaining >= 5
      }">Max Awardable Offs: {{ 5 - user.remaining }} / 5</h6>
    </div>
    <!-- <hr/> -->
    <div class="columns is-mobile">
      <div class="column">
        <b-numberinput min="0" :max="5 - user.remaining" step="0.5" controls-position="compact" v-model="user.count" expanded :disabled="loading || user.remaining >= 5"></b-numberinput>
      </div>
      <div class="column is-narrow">
        <b-button type="is-warning" icon-right="undo" @click="() => {user.count = 0}" :disabled="loading || user.remaining >= 5"/>
      </div>
    </div>
    <!-- <div class="columns is-mobile is-vcentered">
      <div class="column">
      </div>
      <div class="column is-narrow">
        <div class="subtitle is-7 has-text-centered">Awarding</div>
        <div class="title is-3 has-text-centered less-mb " :class="{
            'has-text-primary':  user.count > 0,
            'has-text-grey-light': user.count === 0
          }" >{{ user.count }}</div>
        <div class="columns is-mobile is-1 is-variable">
          <div class="column">
            <b-button size="is-small" expanded :disabled="user.count <= 0" @click="user.count -= 0.5">
                <b-icon icon="minus"></b-icon>
            </b-button>
            </div>
            <div class="column">
            <b-button size="is-small" expanded :disabled="user.count + 0.5 > 5" @click="user.count += 0.5">
                <b-icon icon="plus"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'AwardOffFormCard',
  props: {
    user: Object,
    loading: Boolean
  },
  data () {
    return {
      userData: this.user
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
