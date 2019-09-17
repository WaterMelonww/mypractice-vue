import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
    },
    userId:{
      id:window.localStorage.getItem('userId'||'[]')==null?'':Json.parse(window.localStorage.getItem('userId'||'[]')).id
    }
  },

  mutations: {
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    save(state,userId){
      state.userId = userId
      window.localStorage.setItem('userId',JSON.stringify(userId))
    }
  }
})
