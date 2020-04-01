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
        <b-tab-item label="To Recommend">
          <pending-recommendation :tableForm="tableForm" :showDetails="showDetails"></pending-recommendation>
        </b-tab-item>
        <b-tab-item label="Award Offs">
          <recommend-off-component :tableForm="tableForm" :showDetails="showDetails"></recommend-off-component>
        </b-tab-item>
        <b-tab-item label="Recommended">
          <recommended-offs :tableForm="tableForm" :showDetails="showDetails"></recommended-offs>
        </b-tab-item>
        <b-tab-item label="Awarded">
          <recommended-award :tableForm="tableForm" :showDetails="showDetails"></recommended-award>
        </b-tab-item>
        <b-tab-item label="Cancel" disabled>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import PendingRecommendation from '../../components/main/offs/recommend/PendingRecommendation.vue'
import RecommendOffComponent from '../../components/main/offs/recommend/RecommendOff.vue'
import RecommendedOffs from '../../components/main/offs/recommend/RecommendedOffs.vue'
import RecommendedAward from '../../components/main/offs/recommend/RecommendedAward.vue'

export default {
  name: 'RecommendOff',
  components: {
    PendingRecommendation,
    RecommendOffComponent,
    RecommendedOffs,
    RecommendedAward
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
