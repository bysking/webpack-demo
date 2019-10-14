<template>
  <div
    v-fixStatusBar
    class="container"
  >
    <div class="title">
      webpack vue apicloud cube-ui 三端脚手架
    </div>
    <h1>路由测试</h1>
    <div class="wrapper">
      <button @click="login">
        路由测试：页面切换（更改token测试路由守卫）
      </button>
    </div>
    <h1>数据测试</h1>
    <div class="wrapper">
      <button @click="setData">
        测试：保存数据到本地
      </button>
      <button @click="getData">
        测试：获取保存的数据
      </button>
      <button @click="clearData">
        清除保存的数据
      </button>
    </div>

    <h1>全局通信测试</h1>
    <div class="wrapper">
      <button @click="testStore">
        vuex测试:store dispatch
      </button>
      <button @click="testStoreAction">
        vuex测试:mapAction
      </button>
    </div>

    <h1>网络接口通信测试</h1>
    <div class="wrapper">
      <button @click="testSaas">
        测试http请求：api
      </button>
      <button @click="testPass">
        测试第三方请求：sdk
      </button>
    </div>

    <h1>测试结果展示</h1>
    <div class="wrapper">
      <div class="text">
        测试设置获取数据：mydata: {{ mydata }}
      </div>
      <div class="text">
        mapGetters-userInfo: {{ userInfo }}
      </div>
      <div class="text">
        mapGetters-token: {{ token }}
      </div>
    </div>
    <h1 style="background-color: gray; color: white">
      bysking
    </h1>
  </div>
</template>
<script>
// import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { mapActions, mapGetters } from 'vuex'
import astore from '@/libs/astore'
import { saasApi, passApi } from '@/libs/api'
import { reqSaas, reqPass } from '@/libs/http'
import aui from '@/libs/aui'
export default {
  name: 'Home',
  data () {
    return {
      name: 'home',
      mydata: ''
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo'])
  },
  methods: {
    async testSaas () {
      console.log('测试saas')
      const params = {
        // code: 'utf-8',
        // q: '卫衣',
        // callback: 'cb'
        name: 0
      }
      const res = await reqSaas(saasApi.bysking, [], params)
      console.log(res)
      aui.showToast('saas')
    },
    async testPass () {
      console.log('测试pass')
      const params = {
        code: 'utf-8',
        q: '鞋',
        callback: 'cb'
      }
      const res = await reqPass(passApi.baidu, [], params)
      console.log(res)
      aui.showToast('paas')
    },
    ...mapActions(['setToken', 'setUser']), // mapAction的使用
    async testStore () {
      console.log('测试dispatch')
      await this.$store.dispatch('setToken', 'dispatch-token')
      await this.$store.dispatch('setUser', 'dispatch-bysking')
    },
    testStoreAction () {
      console.log('测试mapActions')
      this.setToken('mapActions-token')
      this.setUser('mapActions-bysking')
    },
    setData () {
      console.log('setData userInfo')
      astore.setData('mydata', { name: 'bc', test: '123' })
    },
    getData () {
      const mydata = astore.getData('mydata')
      console.log('userInfo', mydata)
      this.mydata = mydata
    },
    clearData () {
      astore.clearLoginData()
      const mydata = astore.getData('mydata')
      console.log('重新获取---', mydata)
      astore.clearData('mydata')
      this.mydata = astore.getData('mydata')
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
    text-align center
    line-height 100px
    // background: gray
  .container
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
  h1
    background green
    color white
    padding 20px 10px
    text-align center
  .wrapper
    display flex
    justify-content space-around
    flex-direction column
    margin: 20px 10px
  .text
    margin: 10px auto
  .text:last-child
    width: 100%
    text-align center
    border-bottom: 1px solid gray
</style>
