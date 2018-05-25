import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Manage from '@/components/manage/GuestList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage
    }
  ]
})
