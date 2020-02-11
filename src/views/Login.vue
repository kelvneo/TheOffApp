<template>
  <section class="hero is-fullheight is-info is-bold">
    <transition :name="transition">
      <router-view class="child-view"/>
    </transition>
  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data () {
    return {
      transition: 'slide-left'
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
.child-view {
  /* position: absolute; */
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>
