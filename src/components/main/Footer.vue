<template>
<footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>GSAB Admin</strong> by <a href="https://github.com/kelvneo">Kelvin Neo</a>.
    </p>
    <p>
      <router-link :to="{ path: '/about' }">About</router-link>
    </p>
  </div>
</footer>
</template>

<script>

export default {
  name: 'Footer'
}
</script>
