import firebase from 'firebase/app'
import 'firebase/firestore'

const state = {
  currentUser: null,
  tempUser: null,
  permissions: {},
  updates: {},
  offs: null,
  offPromise: null,
  pendingOffs: null,
  pendingOffPromise: null,
  recommendedOffs: null,
  recommendedOffPromise: null
}

const getters = {
  hasPermission: (state) => (perm) => {
    return state.permissions.hasOwnProperty(perm)
  },
  totalOffCount (state, getters) {
    return state.offs ? state.offs.filter((val) => !val.approver).length / 2 : null
  },
  availableOffCount (state, getters) {
    return state.offs && state.pendingOffs && state.recommendedOffs
      ? (state.offs.filter((val) => !val.approver).length + state.pendingOffs.length + state.availableOffCount.length) / 2
      : null
  },
  pendingOffCount (state, getters) {
    return state.pendingOffs ? state.pendingOffs / 2 : null
  },
  recommendedOffCount (state, getters) {
    return state.recommendedOffs ? state.recommendedOffs / 2 : null
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
  },
  getUserPermissions (context, id) {
    return firebase.firestore().collection('users').doc(id).collection('perms').get()
  },
  // getUserUpdateStatus (context, id) {
  //   return firebase.firestore().collection('users').doc(id).collection('updates').doc('status').get()
  // },
  // updateUserUpdateStatus (context, data) {
  //   return firebase.firestore().collection('users').doc(data.id).collection('updates').doc('status').set(data.data)
  // },
  // getUserTemperature (context, id) {
  //   return firebase.firestore().collection('users').doc(id).collection('updates').doc('temperature').get()
  // },
  // updateUserTemperature (context, data) {
  //   return firebase.firestore().collection('users').doc(data.id).collection('updates').doc('temperature').set(data.data)
  // },
  getCurrentUserOffs (context) {
    if (context.state.offs && context.state.offs.length) {
      return context.state.offs
    }
    if (context.state.offPromise) {
      return context.state.offPromise
    }
    const promise = firebase.firestore().collection('users').doc(context.rootGetters['credentials/id'])
      .collection('offs').where('endDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setOffs', [])
          return []
        } else {
          context.commit('setOffs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          return context.state.offs
        }
      })
    context.commit('setOffPromise', promise)
    return promise
  },
  getCurrentUserPendingOffs (context) {
    if (context.state.pendingOffs && context.state.pendingOffs.length) {
      return context.state.pendingOffs
    }
    if (context.state.pendingOffPromise) {
      return context.state.pendingOffPromise
    }
    const promise = firebase.firestore().collection('pending_offs')
      .where('requester', '==', context.rootGetters['credentials/id'])
      .where('endDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setPendingOffs', [])
          return []
        } else {
          context.commit('setPendingOffs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          return context.state.pendingOffs
        }
      })
    context.commit('setPendingOffPromise', promise)
    return promise
  },
  getCurrentUserRecommendedOffs (context) {
    if (context.state.recommendedOffs && context.state.recommendedOffs.length) {
      return context.state.recommendedOffs
    }
    if (context.state.recommendedOffPromise) {
      return context.state.recommendedOffPromise
    }
    const promise = firebase.firestore().collection('recommended_offs')
      .where('requester', '==', context.rootGetters['credentials/id'])
      .where('endDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setRecommendedOffs', [])
          return []
        } else {
          context.commit('setRecommendedOffs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          return context.state.recommendedOffs
        }
      })
    context.commit('setRecommendedOffPromise', promise)
    return promise
  },
  getUserConfirmedOffs (context, id) {
    return firebase.firestore().collection('users').doc(id).collection('offs').where('endDate', '>=', new Date()).get()
  },
  getUserTotalConfirmedOffs (context, id) {
    return firebase.firestore().collection('users').doc(id).collection('offs').get()
  },
  getUserPendingOffs (context, id) {
    return firebase.firestore().collection('pending_offs').where('requester', '==', id).where('endDate', '>=', new Date()).get()
  },
  getUserTotalPendingOffs (context, id) {
    return firebase.firestore().collection('pending_offs').where('requester', '==', id).get()
  },
  getUserPendingApprovalOffs (context, id) {
    return firebase.firestore().collection('recommended_offs').where('requester', '==', id).where('endDate', '>=', new Date()).get()
  },
  getUserTotalPendingApprovalOffs (context, id) {
    return firebase.firestore().collection('recommended_offs').where('requester', '==', id).get()
  },
  getOffsToRecommend (context, id) {
    return firebase.firestore().collection('pending_offs').where('recommender', '==', id).get()
  },
  getOffsRecommended (context, id) {
    return firebase.firestore().collection('recommended_offs').where('recommender', '==', id).get()
  },
  getOffsToApprove (context, id) {
    return firebase.firestore().collection('recommended_offs').where('approver', '==', id).get()
  },
  awardOffs (context, payload) {
    const batch = firebase.firestore().batch()
    for (const id in payload) {
      for (const off of payload[id]) {
        firebase.firestore().collection('users').doc(id).collection('offs').add(off)
      }
    }
    return batch.commit()
  }
}

const mutations = {
  setCurrentUser (state, user) {
    state.currentUser = user
  },
  setTempUser (state, tempUser) {
    state.tempUser = tempUser
  },
  setPermissions (state, permissions) {
    state.permissions = permissions
  },
  setOffs (state, offs) {
    state.offs = offs
  },
  setOffPromise (state, offPromise) {
    state.offPromise = offPromise
  },
  setPendingOffs (state, offs) {
    state.pendingOffs = offs
  },
  setPendingOffPromise (state, offPromise) {
    state.pendingOffPromise = offPromise
  },
  setRecommendedOffs (state, offs) {
    state.recommendedOffs = offs
  },
  setRecommendedOffPromise (state, offPromise) {
    state.recommendedOffPromise = offPromise
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
