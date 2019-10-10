
import '@/assets/main.styl'
import '@/assets/reset.styl'
import '@/assets/dialog.styl'

import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import { router } from './router/index'
Vue.use(router)
Vue.config.productionTip = false

// 适配iPhone X 状态栏
Vue.directive('fixStatusBar', {
  bind (el) {
    el.style.paddingTop = typeof api === 'undefined' ? '0px' : api.safeArea.top + 'px'
  }
})

// 适配iPhone X 底部栏
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
function initVue () {
  vm = new Vue({
    el: '#app',
    // store,
    router,
    render: h => h(App)
  })
}

window.apiready = function () {
  // setBrowserState(false)
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
