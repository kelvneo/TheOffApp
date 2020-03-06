import Vue from 'vue'
import Vuex from 'vuex'
import Credentials from './modules/credentials'
import User from './modules/user'
import Common from './modules/common'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    credentials: Credentials,
    user: User,
    common: Common
  }
})
