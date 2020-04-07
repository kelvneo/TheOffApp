<template>
<footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>The Off App</strong> by <a href="https://github.com/kelvneo">Kelvin Neo</a>.
    </p>
    <p>
      <router-link :to="{ path: '/about' }">About</router-link> - <span class="has-text-grey-light">20.04.07.1-alpha</span>
    </p>
  </div>
</footer>
</template>

<script>

export default {
  name: 'Footer'
}
</script>
