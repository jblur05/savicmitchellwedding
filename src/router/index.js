import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import RSVP from '@/components/rsvp/RSVP.vue'
import Details from '@/components/details/details.vue'
import Manage from '@/components/manage/GuestList.vue'
import Engagements from '@/components/engagements/Engagements.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: [
        {
          name: 'Savic Mitchell Wedding'
        }
      ]
    },
    {
      path: '/details',
      name: 'Details',
      component: Details,
      meta: [
        {
          name: 'Savic Mitchell Wedding'
        }
      ]
    },
    {
      path: '/rsvp/:guestURL?',
      name: 'RSVP',
      component: RSVP,
      meta: [
        {
          name: 'Savic Mitchell Wedding'
        }
      ]
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
      meta: [
        {
          name: 'Savic Mitchell Wedding'
        }
      ]
    },
    {
      path: '/engagements',
      name: 'Engagements',
      component: Engagements,
      meta: [
        {
          name: 'Savic Mitchell Wedding'
        }
      ]
    }
  ]
})
