import Vue from 'vue'
import Vuex from 'vuex'
import api from './api.js'

Vue.use(Vuex)

const apiRoot = 'http://localhost:8000'

const store = new Vuex.Store({
  state: {
    strict: true,
    guests: [],
    currentGuest: undefined
  },
  mutations: {
    'GET_GUESTS': function (state, response) {
      state.guests = response.body
    },
    'ADD_GUEST': function (state, response) {
      state.guests.push(response.body)
    },
    'REMOVE_GUEST': function (state, guest) {
      const index = state.guests.indexOf(guest)
      state.guests.splice(index, 1)
    },
    'GET_GUEST': function (state, response) {
      if (response.status === 200) {
        console.log(response)
        state.currentGuest = response.body[0]
      } else {
        state.currentGuest = undefined
      }
    },
    'SET_RSVP_URL': function (state, url) {
      state.currentRSVPURL = url
    },
    // Note that we added one more for logging out errors.
    'API_FAIL': function (state, error) {
      console.error(error)
    }
  },
  actions: {
    getGuests (store) {
      return api.get(apiRoot + '/guests/')
        .then((response) => store.commit('GET_GUESTS', response))
        .catch((error) => store.commit('API_FAIL', error))
    },
    addGuest (store, guest) {
      return api.post(apiRoot + '/guest/', guest)
        .then((response) => store.commit('ADD_GUEST', guest))
        .catch((error) => store.commit('API_FAIL', error))
    },
    removeGuest (store, guest) {
      return api.delete(apiRoot + '/guest/', guest)
        .then(store.commit('REMOVE_GUEST', guest))
        .catch((error) => store.commit('API_FAIL', error))
    },
    getGuest (store, url) {
      return api.get(apiRoot + '/rsvp/' + url)
        .then((response) => {
          store.commit('GET_GUEST', response)
          store.commit('SET_RSVP_URL', url)
        })
        .catch((error) => console.log(error))
    }
  }
})

export default store
