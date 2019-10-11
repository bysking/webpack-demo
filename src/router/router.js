import Home from '../views/home/Home.vue'
export const routers = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    meta: { quitApp: 1 },
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: { quitApp: 1 },
    component: () => import('@/views/error/404.vue')
  }
]
