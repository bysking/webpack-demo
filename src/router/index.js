import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
Vue.use(VueRouter)

VueRouter.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
export const router = new VueRouter({
  routes: routers
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  next()
})
