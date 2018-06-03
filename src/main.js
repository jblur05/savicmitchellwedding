// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/components/_globals'
import store from './store/store.js'
import Vuetify from 'vuetify'
import Buefy from 'buefy'

// css
// import 'buefy/lib/buefy.css'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/css/main.css'
import '@/assets/stylus/main.styl'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Buefy)

/* eslint-disable no-new */
const v = new Vue({
  el: '#app',
  router,
  store: store,
  components: { App },
  template: '<App/>'
})

v.$store.dispatch('getGuests')

v.$store.dispatch('getGuests')

Vue.prototype.$createGuest = (name, numGuests, willAttend, address, city, state, country, zipCode) => {
  let value = {'name': name, 'num_guests': numGuests, 'willAttend': willAttend, 'address': address, 'city': city, 'state': state, 'zip_code': zipCode, 'country': country}
  console.log(value)
  return value
}
