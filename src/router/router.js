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
  }
]
