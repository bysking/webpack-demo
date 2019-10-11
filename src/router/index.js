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

// 不需要token的路由
const NoNeedTokens = [
  'login',
  'forgot',
  'env'
]

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 路由跳转前先获取token
  const token = '这里需要获取token'
  // 下面两种情况需要跳转到登录页（没有token，不需要token的页面，可以事先定义一个数组包含不需要token的页面）
  if (!token && NoNeedTokens.indexOf(to.name) === -1) {
    next({
      name: 'login'
    })
  } else if (token && to.name === 'login') { // 已经存在token，再次登陆时直接进主页
    next({
      name: 'home'
    })
  } else { // 已经存在token 想去其他页面
    // 常规做法是这里直接跳转下一步路由就好了 next()
    // 但是我们想自己处理路由尤其是跳转的路由不存在或者跳转的路由拥有子路由，它自身并不对应页面，都需要处理
    // 于是调用自己的方法处理路由
    toDefaultPage(routers, to.name, router, next)
  }
  //
  // console.log('to', to)
  // console.log('from', from)
  // next()
})

// routers自定义的路由数组
// router 路由模块实例
// name: 即将跳转的路由名字
// next 路由跳转执行的最后方法
function toDefaultPage (routers, name, router, next) {
  // 思路： 在路由列表中判断name存在与否，否-》跳转自定义的404页面， 是-》{ 判断该路由下是否有子路由，如果没有就跳转next否则递归 }
  // 遍历路由
  const len = routers.length // 遍历的路由长度
  let i = 0 // 遍历的临时量
  let notHandle = true
  while (i < len) { // 处理有子路由的路由
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) { // 匹配到路由，但是路由有子路由，并且路由未设置重定向
      router.replace({
        name: routers[i].children[0].name // 用第一个孩子路由来替换当前路由栈
      })
      notHandle = false
      next()
      break
    }
    i++ // 条件不满足（一般路由（没有子路由），有redirect重定向）， 判断下一个路由
  }
  // 循环结束之后 // 条件不满足（一般路由（没有子路由），有redirect重定向）， 判断下一个路由
  if (notHandle) {
    next()
  }
}
