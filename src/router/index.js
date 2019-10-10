import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
Vue.use(VueRouter)

export const router = new VueRouter({
  routes: routers
})
