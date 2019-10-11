<template>
  <div
    v-fixStatusBar
    class="container"
  >
    <div class="title">
      {{ name }}
    </div>
    <button @click="login">
      登录
    </button>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      name: 'home'
    }
  },
  methods: {
    login () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .title
    width: 100%
    height: 100px
    background: gray
  .container
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    border: 3px solid red
    width: 100%
    height: 100%
</style>
