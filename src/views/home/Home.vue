<template>
  <div>
    <div>
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
<style scoped>

</style>
