import firebase from 'firebase/app'
import 'firebase/firestore'

const state = {
  currentUser: null,
  tempUser: null
}

const getters = {
  getAvailableOffs (state) {
    if (state.currentUser || state.currentUser.offs === null) return []
    else return Object.values(state.currentUser.offs).filter(val => val.expiryDate >= new Date())
  }
}

const actions = {
  getUser (context, id) {
    return firebase.firestore().collection('users').doc(id).get()
  },
  getTempUser (context, id) {
    return firebase.firestore().collection('temp').doc(id).get()
  },
  createTempUser (context, data) {
    return firebase.firestore().collection('temp').doc(data.id).set(data.data)
  },
  getTempUsers (context) {
    return firebase.firestore().collection('temp').get()
  },
  deleteTempUser (context, id) {
    return firebase.firestore().collection('temp').doc(id).delete()
  },
  createUser (context, data) {
    return firebase.firestore().collection('users').doc(data.id).set(data.data)
  }
}

const mutations = {
  setCurrentUser (state, user) {
    state.currentUser = user
  },
  setTempUser (state, tempUser) {
    state.tempUser = tempUser
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
