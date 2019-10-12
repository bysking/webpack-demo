// 现在有一个问题，浏览器端无法使用vue-devtool调试页面
import '@/assets/main.styl'
import '@/assets/reset.styl'
import '@/assets/dialog.styl'

import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import fastclick from 'fastclick'
import { router } from './router/index'
import { setBrowserState } from '@/libs/enum'
import store from './store'
Vue.use(router)
Vue.config.productionTip = false

Vue.directive('fixStatusBar', {
  bind (el) {
    el.style.paddingTop = typeof api === 'undefined' ? '0px' : api.safeArea.top + 'px'
  }
})

Vue.directive('fixTabBar', {
  bind (el) {
    el.style.paddingBottom = typeof api === 'undefined' ? '0px' : api.safeArea.bottom + 'px'
  }
})

const addMobileListener = () => {
  api.addEventListener(
    {
      name: 'keyback'
    },
    (ret, err) => {
      const { meta } = vm.$route

      if (meta.quitApp) { // 需要在某个点击返回然后退出的页面路由添加路由元信息quitApp
        api.closeWidget({})
      } else {
        vm.$router.goBack() // 需要挂载一个路由返回
      }
    }
  )
}
var vm
setBrowserState(true) // 一开始默认设置运行在浏览器上
function initVue () {
  vm = new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}

window.apiready = function () {
  setBrowserState(false) // 此处设置运行设备在手机端，修改enum的设备状态值用来区分数据持久化的调用接口
  fastclick.attach(document.body)
  initVue()
  addMobileListener()
}

// 此处是为方便在PC调试页面
setTimeout(function () {
  if (!vm) {
    fastclick.attach(document.body)
    initVue()
  }
}, 2000)
