import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import 'buefy/lib/buefy.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
