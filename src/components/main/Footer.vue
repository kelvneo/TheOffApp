<template>
<footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>The Off App</strong>
    </p>
    <p><router-link :to="{ path: '/about' }">About</router-link></p>
    <p>
      <span class="has-text-grey-light">21.05.03.1-beta</span>
    </p>
  </div>
</footer>
</template>

<script>

export default {
  name: 'Footer'
}
</script>
