import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    guests: []
  },
  mutations: {
    'ADD_GUEST': function (state, guest) {
      state.guests.push(guest)
    },
    'REMOVE_GUEST': function (state, guest) {
      const index = state.guests.indexOf(guest)
      state.guests.splice(index, 1)
    }
  },
  actions: {
    addGuest (store, guest) {
      store.commit('ADD_GUEST', guest)
    },
    removeGuest (store, guest) {
      store.commit('REMOVE_GUEST', guest)
    }
  }
})

export default store
