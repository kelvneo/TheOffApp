import firebase from 'firebase/app'
import 'firebase/firestore'

const state = {
  allUsers: {}
}

const getters = {
  user: (state) => (id) => {
    return state.allUsers[id]
  },
  usersArray (state) {

  }
}

const actions = {
  async updateAllUsers (context) {
    (await firebase.firestore().collection('users').get()).forEach((doc) => {
      context.commit('setUser', { id: doc.id, data: doc.data() })
    })
    return context.state.allUsers
  },
  async getUser (context, id) {
    if (context.getters.user(id)) {
      return context.getters.user(id)
    } else {
      return context.dispatch('updateUser', id)
    }
  },
  async updateUser (context, id) {
    const doc = await firebase.firestore().collection('users').doc(id).get()
    if (doc.exists) {
      context.commit('setUser', { id: doc.id, data: doc.data() })
      return context.getters.user(id)
    } else {
      return null
    }
  }
}

const mutations = {
  setAllUsers (state, data) {
    state.allUsers = data
  },
  setUser (state, { id, data }) {
    state.allUsers[id] = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
