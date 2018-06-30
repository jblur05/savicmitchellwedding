import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

export default {
  get (url, request, authTok) {
    Vue.http.headers.common['Authorization'] = authTok ? 'JWT ' + authTok : undefined
    return Vue.http.get(url, request)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  post (url, request, authTok) {
    Vue.http.headers.common['Authorization'] = authTok ? 'JWT ' + authTok : undefined
    return Vue.http.post(url, request)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  patch (url, request, authTok) {
    Vue.http.headers.common['Authorization'] = authTok ? 'JWT ' + authTok : undefined
    return Vue.http.patch(url, request)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  delete (url, request, authTok) {
    Vue.http.headers.common['Authorization'] = authTok ? 'JWT ' + authTok : undefined
    return Vue.http.delete(url, request)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}
