import Vue from 'vue'
import Vuex from 'vuex'
import api from './api.js'

Vue.use(Vuex)

const apiRoot = 'http://localhost:8000'

const store = new Vuex.Store({
  state: {
    strict: true,
    guests: [],
    currentGuest: undefined,
    currentRSVPURL: ''
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
      console.log(response)
      if (response.status === 200) {
        state.currentGuest = response.body[0]
      } else {
        state.currentGuest = undefined
      }
    },
    'SET_RSVP_URL': function (state, url) {
      state.currentRSVPURL = url
    },
    'SUBMIT_RSVP': function (state, response) {
      console.log(response)
      if (response.status === 200) {
        console.log('RSVP Successfully submitted')
      } else {
        console.error('RSVP not submitted Successfully')
        console.error(response)
      }
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
      console.log(apiRoot + '/rsvp/' + url)
      return api.get(apiRoot + '/rsvp/' + url)
        .then((response) => {
          store.commit('GET_GUEST', response)
          store.commit('SET_RSVP_URL', url)
        })
        .catch((error) => console.log(error))
    },
    submitRSVP (store, willAttend) {
      if (this.state.currentGuest) {
        // backup in case of failure
        this.state.currentGuest.rsvp = new Date().toISOString()
        this.state.currentGuest.will_attend = willAttend
        console.log(apiRoot + '/rsvp/' + this.state.currentGuest.id)

        return api.patch(apiRoot + '/rsvp/' + this.state.currentGuest.id, this.state.currentGuest)
          .then((response) => {
            store.commit('SUBMIT_RSVP', response)
            if (response.status === 200) {
              console.log('getGuest')
              // this.dispatch('getGuest', this.state.currentRSVPURL)
            }
          }).catch((error) => console.error(error))
      } else {
        store.commit('API_FAIL', 'Error updating RSVP, guest undefined or empty')
      }
    }
  }
})

export default store
