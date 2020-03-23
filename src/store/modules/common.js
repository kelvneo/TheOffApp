import firebase from 'firebase/app'
import 'firebase/firestore'

const state = {
  allUsers: {},
  commanders: null,
  commandersPromise: null,
  allUsersCollected: false
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
    if (context.state.allUsersCollected) {
      return Promise.resolve(context.state.allUsers)
    }
    const promise = (firebase.firestore().collection('users').get())
    context.commit('setAllUsers', promise)
    const val = await promise
    const returnVal = {}
    val.forEach((doc) => {
      const data = doc.data()
      data.id = doc.id
      returnVal[doc.id] = data
    })
    context.commit('setAllUsersCollected', true)
    context.commit('setAllUsers', returnVal)
    return returnVal
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
      const data = doc.data()
      data.id = doc.id
      context.commit('setUser', { id: doc.id, data: data })
      return context.getters.user(id)
    } else {
      return null
    }
  },
  getCommanders (context) {
    if (context.state.commanders) {
      return context.state.commanders
    }

    const promise = firebase.firestore().collection('constants').doc('commanders').get().then((doc) => {
      if (doc.exists) {
        context.commit('setCommanders', doc.data())
      } else {
        context.commit('setCommanders', {})
      }
      return context.state.commanders
    })

    context.commit('setCommandersPromise', promise)
    return promise
  }
}

const mutations = {
  setAllUsers (state, data) {
    state.allUsers = data
  },
  setAllUsersCollected (state, data) {
    state.allUsersCollected = data
  },
  setUser (state, { id, data }) {
    state.allUsers[id] = data
  },
  setCommanders (state, data) {
    state.commanders = data
  },
  setCommandersPromise (state, data) {
    state.commandersPromise = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
