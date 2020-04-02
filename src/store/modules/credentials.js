import firebase from 'firebase/app'
import 'firebase/auth'

// initial state
const state = {
  loading: true,
  firebaseAuthListener: null,
  recaptchaVerifier: null,
  recaptchaResponse: null,
  confirmationResult: null,
  user: null
}

// getters
const getters = {
  id: (state, getters) => {
    return state.user.uid
  }
}

// actions
const actions = {
  initRecaptcha ({ commit, state }, btn) {
    commit('setRecaptchaVerifier', null)
    commit('setRecaptchaVerifier', new firebase.auth.RecaptchaVerifier(btn, {
      size: 'invisible',
      callback: (response) => {
        commit('setRecaptchaResponse', response)
      }
    }))
    // state.recaptchaVerifier.render()
    return state.recaptchaVerifier
  },
  sendOTP ({ commit, state }, phNo) {
    return firebase.auth().signInWithPhoneNumber(phNo, state.recaptchaVerifier).then((result) => {
      commit('setConfirmationResult', result)
    })
  },
  confirmOTP ({ commit, state }, vCode) {
    return state.confirmationResult.confirm(vCode).then((result) => {
      commit('setUser', result.user)
    })
  },
  setLoading ({ commit, state }, loading) {
    commit('setLoading', loading)
  },
  logout ({ commit, state }) {
    return firebase.auth().signOut().then(() => {
      commit('user/setCurrentUser', null, { root: true })
      commit('user/setTempUser', null, { root: true })
      commit('user/setPermissions', {}, { root: true })
      commit('user/setOffs', null, { root: true })
      commit('user/setOffPromise', null, { root: true })
      commit('user/setPendingOffs', null, { root: true })
      commit('user/setPendingOffPromise', null, { root: true })
      commit('user/setRecommendedOffs', null, { root: true })
      commit('user/setRecommendedOffPromise', null, { root: true })
      commit('user/setOffPass', null, { root: true })
      commit('user/setOffPassPromise', null, { root: true })
      commit('user/setPendingMAs', null, { root: true })
      commit('user/setPendingMAPromise', null, { root: true })
      commit('user/setRecommendedMAs', null, { root: true })
      commit('user/setRecommendedMAPromise', null, { root: true })
      commit('user/setTotalOffPass', [], { root: true })
      commit('user/setTotalOffPassCursor', null, { root: true })
      commit('setUser', null)
    })
  }
  // getUser ({ commit, state }, vCode) {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     commit('setUser', user)
  //     commit('setLoading', false)
  //   })
  // }
}

// mutations
const mutations = {
  setRecaptchaVerifier (state, recaptchaVerifier) {
    state.recaptchaVerifier = recaptchaVerifier
  },
  setRecaptchaResponse (state, recaptchaResponse) {
    state.recaptchaResponse = recaptchaResponse
  },
  setConfirmationResult (state, confirmationResult) {
    state.confirmationResult = confirmationResult
  },
  setUser (state, user) {
    state.user = user
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setFirebaseAuthListener (state, listener) {
    state.firebaseAuthListener = listener
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
