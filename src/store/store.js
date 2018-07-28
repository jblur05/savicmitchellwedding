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
    isLoggedIn: !!getJWT(),
    weddingStats: {
      numGuests: 0,
      chicken: 0,
      ravioli: 0,
      child: 0
    },
    curRsvp: {
      name: '',
      url: '',
      isValid: false
    },
    endPoints: {
      obtainJWT: 'api-token-auth'
    }
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
      let numGuests = 0
      let numChicken = 0
      let numRavioli = 0
      let numChild = 0
      for (let guest of response.body) {
        if (guest.will_attend) {
          for (let familyMember of guest.family_members) {
            if (familyMember.food_choice === 'Chicken') {
              numChicken += 1
              numGuests += 1
            }

            if (familyMember.food_choice === 'Ravioli') {
              numRavioli += 1
              numGuests += 1
            }

            if (familyMember.food_choice === 'Child') {
              numChild += 1
              numGuests += 1
            }
          }
        }
      }

      state.weddingStats = {
        numGuests: numGuests,
        chicken: numChicken,
        ravioli: numRavioli,
        child: numChild
      }
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
        state.rsvpSubmitFailure = false
      } else {
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
    'MANAGE_LOGIN_SUCCESS': function (state) {
      state.isLoggedIn = true
    },
    'MANAGE_LOGIN_FAIL': function (state) {
      state.isLoggedIn = false
    }
  },
  actions: {
    setWindowSize (store, size) {
      store.commit('SET_WINDOW_SIZE', size)
    },
    getGuests (store) {
      return api.get(apiRoot + '/guests/', getJWT(), undefined)
        .then((response) => store.commit('GET_GUESTS', response))
        .catch((error) => store.commit('API_FAIL', error))
    },
    addGuest (store, guest) {
      return api.post(apiRoot + '/makeguest/', getJWT(), guest)
        .then((response) => store.commit('ADD_GUEST', guest))
        .catch((error) => store.commit('API_FAIL', error))
    },
    removeGuest (store, guest) {
      return api.delete(apiRoot + '/guest/', getJWT(), guest)
        .then(store.commit('REMOVE_GUEST', guest))
        .catch((error) => store.commit('API_FAIL', error))
    },
    getGuest (store) {
      let url = store.state.curRsvp.url.trim()
      let name = store.state.curRsvp.name.trim()

      if (url && name) {
        let jwtToken = getJWT()
        // get the rsvp using the url and guest name
        return api.get(apiRoot + '/rsvp/' + url + '/' + escape(name), jwtToken, undefined)
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

        return api.patch(apiRoot + '/rsvp/' + this.state.currentGuest.id, undefined, this.state.currentGuest)
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
      return api.post(apiRoot + '/' + this.state.endPoints.obtainJWT + '/', undefined, JSON.stringify(payload))
        .then((response) => {
          let jwtToken = response.body.token
          if (response.status === 200 && jwtToken) {
            var d = new Date()
            d.setTime(d.getTime() + (36 * 60 * 60 * 1000))
            var expires = 'expires=' + d.toUTCString()
            document.cookie = cookieName + '=' + jwtToken + ';' + expires + ';path=/'
            this.commit('MANAGE_LOGIN_SUCCESS')
          } else {
            expireJWT()
            this.commit('MANAGE_LOGIN_FAIL')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    manageLogout (store) {
      expireJWT()
      this.commit('MANAGE_LOGIN_FAIL')
    }
  }
})

function expireJWT () {
  document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

function getJWT () {
  var value = '; ' + document.cookie
  var parts = value.split('; ' + cookieName + '=')
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return undefined
}

export default store
