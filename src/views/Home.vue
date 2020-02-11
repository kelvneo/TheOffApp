<template>
  <div class="home">
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/main/Navbar.vue'

export default {
  name: 'home',
  components: {
    Navbar
  }
}
</script>
