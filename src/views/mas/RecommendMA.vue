<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Recommend MAs</h2>
      <div class="columns is-gapless">
        <div class="field column">
          <b-switch v-model="showDetails">
            Show Extra Details
          </b-switch>
        </div>
        <div class="field column is-hidden-tablet">
          <b-switch v-model="tableForm">
            Table Mode
          </b-switch>
        </div>
      </div>
      <b-tabs v-model="activeTab" type="is-boxed">
        <b-tab-item label="To Recommend">
          <pending-m-a-recommendation :tableForm="tableForm" :showDetails="showDetails"></pending-m-a-recommendation>
        </b-tab-item>
        <b-tab-item label="Recommended">
          <recommended-m-as :tableForm="tableForm" :showDetails="showDetails"></recommended-m-as>
        </b-tab-item>
        <b-tab-item label="Cancel" disabled>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import PendingMARecommendation from '../../components/main/offs/recommend/PendingMARecommendation.vue'
import RecommendedMAs from '../../components/main/offs/recommend/RecommendedMAs.vue'

export default {
  name: 'RecommendOff',
  components: {
    PendingMARecommendation,
    RecommendedMAs
  },
  data () {
    return {
      activeTab: 0,
      tableForm: false,
      showDetails: false
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
