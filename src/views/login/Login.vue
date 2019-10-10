<template>
  <div
    v-fixStatusBar
    v-fixTabBar
  >
    <div>{{ name }}</div>
    <button @click="index">
      主页
    </button>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      name: 'login'
    }
  },
  methods: {
    index () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
<style scoped>

</style>
