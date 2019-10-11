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
    <button @click="setData">
      测试设置数据
    </button>
    <button @click="getData">
      测试获取数据
    </button>
    <button @click="clearData">
      清除数据
    </button>
  </div>
</template>
<script>
import astore from '@/libs/astore'
export default {
  name: 'Home',
  data () {
    return {
      name: 'home'
    }
  },
  methods: {
    setData () {
      console.log('setData userInfo')
      astore.setData('userInfo', { name: 'bc', test: '123' })
    },
    getData () {
      const data = astore.getData('userInfo')
      console.log('userInfo', data)
    },
    clearData () {
      astore.clearLoginData()
      const data = astore.getData('userInfo')
      console.log('重新获取---', data)
    },
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
