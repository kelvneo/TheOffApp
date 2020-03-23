<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Recommend Offs</h2>
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
        <b-tab-item label="Awaiting Recommendation">
          <pending-recommendation :tableForm="tableForm" :showDetails="showDetails"></pending-recommendation>
        </b-tab-item>
        <b-tab-item label="Recommend Offs">
          <recommend-off-component :tableForm="tableForm" :showDetails="showDetails"></recommend-off-component>
        </b-tab-item>
        <b-tab-item label="Recommend Cancellation" disabled>
          <b-message type="is-warning" role="alert" :closable="false" title="Work in Progress" size="is-small">
            Do check back as features get implemented.
          </b-message>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import PendingRecommendation from '../../components/main/offs/recommend/PendingRecommendation.vue'
import RecommendOffComponent from '../../components/main/offs/recommend/RecommendOff.vue'

export default {
  name: 'RecommendOff',
  components: {
    PendingRecommendation,
    RecommendOffComponent
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
