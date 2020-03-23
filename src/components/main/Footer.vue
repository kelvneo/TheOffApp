<template>
<footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>GSAB Admin</strong> by <a href="https://github.com/kelvneo">Kelvin Neo</a>.
    </p>
    <p>
      <router-link :to="{ path: '/about' }">About</router-link> - <span class="has-text-grey-light">20.03.23.2-alpha</span>
    </p>
  </div>
</footer>
</template>

<script>

export default {
  name: 'Footer'
}
</script>
