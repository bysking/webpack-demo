<template>
  <div>
    {{ name }}8888888888888
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
