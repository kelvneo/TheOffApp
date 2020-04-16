<template>
  <div class="home" v-if="!loading">
    <Navbar></Navbar>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/main/Navbar.vue'
import Footer from '@/components/main/Footer.vue'

export default {
  name: 'home',
  components: {
    Navbar,
    Footer
  },
  computed: {
    loading () {
      return this.$store.state.credentials.loading
    }
  }
}
</script>
