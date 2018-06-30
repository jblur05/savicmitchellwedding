import Vue from 'vue'
import Vuex from 'vuex'
import api from './api.js'
import createPersistedState from 'vuex-persistedstate'

const cookieName = 'tokCookie'
Vue.use(Vuex)

// const apiRoot = 'https://guestbe.savicmitchellwedding.com'
const apiRoot = process.env.BACKEND_URL

const store = new Vuex.Store({
  state: {
    strict: true,
    guests: [],
    currentGuest: undefined,
    rsvpRequestFailure: false,
    rsvpSubmitFailure: undefined,
    windowSize: undefined,
    isMobile: false,
    curRsvp: {
      name: '',
      url: '',
      isValid: false
    },
    endPoints: {
      obtainJWT: 'api-token-auth'
    },
    isLoggedIn: false
  },
  plugins: [
    createPersistedState({
      key: 'state',
      paths: ['curRsvp', 'currentGuest']
    })
  ],
  getters: {
    jwtToken: state => {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + cookieName + '=')
      if (parts.length === 2) {
        return parts.pop().split(';').shift()
      }
      return undefined
    }
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
    'SET_GUEST': function (state, response) {
      if (response.status === 200) {
        if (state.curRsvp && state.curRsvp.name && state.curRsvp.url) {
          state.currentGuest = response.body
          state.curRsvp.isValid = true
          state.rsvpRequestFailure = false
        } else {
          console.error('error in set guest')
          console.error(response)
          console.error(state.curRsvp)
        }
      } else {
        state.rsvpRequestFailure = true
        state.curRsvp.isValid = false
        state.currentGuest = undefined
      }
    },
    'INVALIDATE_LOGIN': function (state) {
      state.curRsvp.name = ''
      state.curRsvp.url = ''
      state.isValid = false
      state.currentGuest = undefined
    },
    'SET_RSVP_URL': function (state, url) {
      state.curRsvp.url = url
    },
    'SUBMIT_RSVP': function (state, response) {
      if (response.status === 200) {
        console.log('RSVP Successfully submitted')
        state.rsvpSubmitFailure = false
      } else {
        console.error('RSVP not submitted Successfully')
        console.error(response)
      }
    },
    // Note that we added one more for logging out errors.
    'API_FAIL': function (state, error) {
      console.error(error)
    },
    'SET_WINDOW_SIZE': function (state, windowSize) {
      state.windowSize = windowSize
      state.isMobile = windowSize < 770
    },
    'UPDATE_TOKEN': function (state, jwtToken) {
      if (jwtToken) {
        var d = new Date()
        d.setTime(d.getTime() + (36 * 60 * 60 * 1000))
        var expires = 'expires=' + d.toUTCString()
        document.cookie = cookieName + '=' + jwtToken + ';' + expires + ';path=/'
        state.isLoggedIn = true
      }
    }
  },
  actions: {
    setWindowSize (store, size) {
      store.commit('SET_WINDOW_SIZE', size)
    },
    getGuests (store) {
      return api.get(apiRoot + '/guests/', this.getters.jwtToken)
        .then((response) => store.commit('GET_GUESTS', response))
        .catch((error) => store.commit('API_FAIL', error))
    },
    addGuest (store, guest) {
      return api.post(apiRoot + '/makeguest/', guest, this.getters.jwtToken)
        .then((response) => store.commit('ADD_GUEST', guest))
        .catch((error) => store.commit('API_FAIL', error))
    },
    removeGuest (store, guest) {
      return api.delete(apiRoot + '/guest/', guest, this.getters.jwtToken)
        .then(store.commit('REMOVE_GUEST', guest))
        .catch((error) => store.commit('API_FAIL', error))
    },
    getGuest (store) {
      let url = store.state.curRsvp.url.trim()
      let name = store.state.curRsvp.name.trim()

      if (url && name) {
        // get the rsvp using the url and guest name
        return api.get(apiRoot + '/rsvp/' + url + '/' + escape(name))
          .then((response) => {
            store.commit('SET_GUEST', response)
          })
          .catch((error) => {
            store.commit('SET_GUEST', error)
          })
      }
      return undefined
    },
    setRSVPURL (store, url) {
      if (url) {
        store.commit('SET_RSVP_URL', url)
      }
    },
    submitRSVP (store, willAttend) {
      if (this.state.currentGuest) {
        // backup in case of failure
        this.state.currentGuest.rsvp = new Date().toISOString()
        this.state.currentGuest.will_attend = willAttend

        return api.patch(apiRoot + '/rsvp/' + this.state.currentGuest.id, this.state.currentGuest)
          .then((response) => {
            store.commit('SUBMIT_RSVP', response)
            if (response.status === 200) {
              this.dispatch('getGuest')
            }
          }).catch((error) => {
            this.state.rsvpSubmitFailure = true
            console.error(error)
          })
      } else {
        store.commit('API_FAIL', 'Error updating RSVP, guest undefined or empty')
      }
    },
    logoutRSVP (store) {
      store.commit('INVALIDATE_LOGIN')
    },
    obtainToken (store, payload) {
      console.log(JSON.stringify(payload))
      api.post(apiRoot + '/' + this.state.endPoints.obtainJWT + '/', JSON.stringify(payload))
        .then((response) => {
          if (response.status === 200) {
            this.commit('UPDATE_TOKEN', response.data.token)
          } else if (response.status === 403) {
            this.state.isLoggedIn = false
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})

export default store
