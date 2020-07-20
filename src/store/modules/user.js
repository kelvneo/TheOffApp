import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

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
  recommendedOffPromise: null,
  pendingMAs: null,
  pendingMAPromise: null,
  recommendedMAs: null,
  recommendedMAPromise: null,
  offPass: null,
  offPassPromise: null,
  totalOffPass: [],
  totalOffPassCursor: null
}

const getters = {
  /**
   * Check if the user has permission to perform a function
   */
  hasPermission: (state) => (perm) => {
    return state.permissions.hasOwnProperty(perm)
  },
  /**
   * Get the total amount of offs the user has, disregarding the amount awaiting approval and recommendations.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  totalOffCount (state, getters) {
    return state.offs ? state.offs.filter((val) => !val.approver).length / 2 : null
  },
  /**
   * Get the amount of offs the user has, after deducting offs awaiting approval and recommendations.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  availableOffCount (state, getters) {
    return state.offs && state.pendingOffs && state.recommendedOffs
      ? (state.offs.length / 2 - getters.pendingOffCount - getters.recommendedOffCount)
      : null
  },
  /**
   * Get the amount of offs pending recommendation for the user.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  pendingOffCount (state, getters) {
    return state.pendingOffs ? state.pendingOffs.reduce((a, b) => a + b.ids.length, 0) / 2 : null
  },
  /**
   * Get the amount of offs recommended and awaiting approval for the user.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  recommendedOffCount (state, getters) {
    return state.recommendedOffs ? state.recommendedOffs.reduce((a, b) => a + b.ids.length, 0) / 2 : null
  },
  /**
   * Get the details of all the available offs for the user to use.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  availableOffs (state, getters) {
    if (state.offs && state.pendingOffs && state.recommendedOffs) {
      const po = new Set(state.pendingOffs.flatMap((val) => val.ids))
      const ro = new Set(state.recommendedOffs.flatMap((val) => val.ids))
      return state.offs
        .filter((val) => (!po.has(val.id) && !ro.has(val.id)))
        .sort((a, b) => a.endDate.seconds - b.endDate.seconds)
    } else {
      return []
    }
  },
  /**
   * Get all the dates taken by offs pending approval, approved offs, and MAs
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  unavailableDates (state, getters) {
    const payload = []
    if (state.pendingOffs) {
      payload.push(...state.pendingOffs.map((val) => val.useDate.toDate()))
    }
    if (state.recommendedOffs) {
      payload.push(...state.recommendedOffs.map((val) => val.useDate.toDate()))
    }
    if (state.offPass) {
      payload.push(...state.offPass.map((val) => val.startDate.toDate()))
    }
    if (state.pendingMAs) {
      payload.push(...state.pendingMAs.map((val) => val.useDate.toDate()))
    }
    if (state.recommendedMAs) {
      payload.push(...state.recommendedMAs.map((val) => val.useDate.toDate()))
    }
    return payload
  },
  /**
   * Get the amount of MAs pending recommendation for the user.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  pendingMACount (state, getters) {
    return state.pendingMAs ? state.pendingMAs.length : null
  },
  /**
   * Get the amount of MAs recommended and awaiting approval for the user.
   * @param {*} state Vuex State
   * @param {*} getters Vuex Getters
   */
  recommendedMACount (state, getters) {
    return state.recommendedMAs ? state.recommendedMAs.length : null
  }
}

const actions = {
  /**
   * Get the firebase document of a user.
   * @param {*} context Vuex Context
   * @param {*} id ID of the user
   */
  getUser (context, id) {
    return firebase.firestore().collection('users').doc(id).get()
  },
  /**
   * Get the firebase document of a user awaiting approval.
   * @param {*} context Vuex Context
   * @param {*} id ID of the temporary user
   */
  getTempUser (context, id) {
    return firebase.firestore().collection('temp').doc(id).get()
  },
  /**
   * Create a temporary user from their sign up form.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, data: any}`
   */
  createTempUser (context, data) {
    return firebase.firestore().collection('temp').doc(data.id).set(data.data)
  },
  /**
   * Get all the users awaiting approval.
   * @param {*} context Vuex Context
   */
  getTempUsers (context) {
    return firebase.firestore().collection('temp').get()
  },
  /**
   * Delete a temporary user.
   * @param {*} context Vuex Context
   * @param {*} id The temporary user ID
   */
  deleteTempUser (context, id) {
    return firebase.firestore().collection('temp').doc(id).delete()
  },
  /**
   * Create an approved user.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, data: any}`
   */
  createUser (context, data) {
    return firebase.firestore().collection('users').doc(data.id).set(data.data)
  },
  /**
   * Update an approved user.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, data: any}`
   */
  updateUser (context, data) {
    return firebase.firestore().collection('users').doc(data.id).update(data.data)
  },
  /**
   * Change the status of an approved user.
   *
   * Used for disabling or enabling a user.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, disabled: boolean}`
   */
  changeUserStatus (context, data) {
    return firebase.functions().httpsCallable('changeUserStatus')(data)
  },
  /**
   * Get the permissions assigned to a user
   * @param {*} context Vuex context
   * @param {*} id The ID of the user to check
   */
  getUserPermissions (context, id) {
    return firebase.firestore().collection('users').doc(id).collection('perms').get()
  },
  /**
   * Delete the user's permission.
   *
   * Set the data field as the permission you wish to delete.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, data: string}`
   */
  deleteUserPermission (context, data) {
    return firebase.firestore().collection('users').doc(data.id).collection('perms').doc(data.data).delete()
  },
  /**
   * Add a permission to the user.
   *
   * Set the data field as the permission you wish to add.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, data: string}`
   */
  addUserPermission (context, data) {
    return firebase.firestore().collection('users').doc(data.id).collection('perms').doc(data.data).set({})
  },
  /**
   * Add the user as commander for a depot.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, depot: string}`
   */
  addCommander (context, data) {
    const payload = {}
    payload[data.depot] = firebase.firestore.FieldValue.arrayUnion(data.id)
    return firebase.firestore().collection('constants').doc('commanders').update(payload)
  },
  /**
   * Remove the user as commander for a depot.
   * @param {*} context Vuex Context
   * @param {*} data Payload, consisting of `{id: string, depot: string}`
   */
  removeCommander (context, data) {
    const payload = {}
    payload[data.depot] = firebase.firestore.FieldValue.arrayRemove(data.id)
    return firebase.firestore().collection('constants').doc('commanders').update(payload)
  },
  /**
   * Get the unexpired offs the user has, ignoring pending recommendation and approval offs.
   *
   * This function will call firebase if no local version is found.
   * @param {*} context Vuex context
   * @param {*} reset Set this to `true` to update cache values.
   */
  async getCurrentUserOffs (context, reset) {
    // If reset is not true, and there are existing values, return the old values.
    // This is to reduce the amount of reads from firebase.
    if (context.state.offs && context.state.offs.length && !reset) {
      return context.state.offs
    }
    // Make sure that there isn't already a call to get the current user's offs.
    if (context.state.offPromise) {
      return context.state.offPromise
    }
    // Clear all current offs.
    context.commit('setOffs', null)
    // Filter the collection of offs by their expiry date.
    const promise = firebase.firestore().collection('users').doc(context.rootGetters['credentials/id'])
      .collection('offs').where('endDate', '>=', new Date()).get().then((snapshot) => {
        // Check if there are any offs at all.
        if (snapshot.empty) {
          context.commit('setOffs', [])
          context.commit('setOffPromise', null)
          return []
        } else {
          context.commit('setOffs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          context.commit('setOffPromise', null)
          return context.state.offs
        }
      })
    // To save reads and ensure there aren't any duplicate calls, always return the promise that
    // is attempting to collate the information.
    context.commit('setOffPromise', promise)
    return promise
  },
  /**
   * Get the offs currently pending recommendation.
   *
   * This function will call firebase if no local version is found.
   * @param {*} context Vuex context
   * @param {*} reset Set this to `true` to update cache values.
   */
  async getCurrentUserPendingOffs (context, reset) {
    if (context.state.pendingOffs && context.state.pendingOffs.length && !reset) {
      return context.state.pendingOffs
    }
    if (context.state.pendingOffPromise) {
      return context.state.pendingOffPromise
    }
    context.commit('setPendingOffs', null)
    const promise = firebase.firestore().collection('pending_offs')
      .where('requester', '==', context.rootGetters['credentials/id'])
      .where('endDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setPendingOffs', [])
          context.commit('setPendingOffPromise', null)
          return []
        } else {
          context.commit('setPendingOffs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          context.commit('setPendingOffPromise', null)
          return context.state.pendingOffs
        }
      })
    context.commit('setPendingOffPromise', promise)
    return promise
  },
  /**
   * Get the offs currently pending approval.
   *
   * This function will call firebase if no local version is found.
   * @param {*} context Vuex context
   * @param {*} reset Set this to `true` to update cache values.
   */
  async getCurrentUserRecommendedOffs (context, reset) {
    if (context.state.recommendedOffs && context.state.recommendedOffs.length && !reset) {
      return context.state.recommendedOffs
    }
    if (context.state.recommendedOffPromise) {
      return context.state.recommendedOffPromise
    }
    context.commit('setRecommendedOffs', null)
    const promise = firebase.firestore().collection('recommended_offs')
      .where('requester', '==', context.rootGetters['credentials/id'])
      .where('endDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setRecommendedOffs', [])
          context.commit('setRecommendedOffPromise', null)
          return []
        } else {
          context.commit('setRecommendedOffs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          context.commit('setRecommendedOffPromise', null)
          return context.state.recommendedOffs
        }
      })
    context.commit('setRecommendedOffPromise', promise)
    return promise
  },
  /**
   * Get the offs that are approved.
   *
   * This function will call firebase if no local version is found.
   * @param {*} context Vuex context
   * @param {*} reset Set this to `true` to update cache values.
   */
  async getCurrentUserOffPass (context, reset) {
    if (context.state.offPass && context.state.offPass.length && !reset) {
      return context.state.offPass
    }
    if (context.state.offPassPromise) {
      return context.state.offPassPromise
    }
    context.commit('setOffPass', null)
    const promise = firebase.firestore().collection('users').doc(context.rootGetters['credentials/id'])
      .collection('off_pass').where('endDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setOffPass', [])
          context.commit('setOffPassPromise', null)
          return []
        } else {
          context.commit('setOffPass', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          context.commit('setOffPassPromise', null)
          return context.state.offPass
        }
      })
    context.commit('setOffPassPromise', promise)
    return promise
  },
  async nextTotalOffPass (context, limit = 10) {
    const promise = context.state.totalOffPassCursor ? context.state.totalOffPassCursor
      : firebase.firestore().collection('users').doc(context.rootGetters['credentials/id']).collection('off_pass').orderBy('endDate', 'desc').limit(limit)

    if (context.state.totalOffPass.length && !context.state.totalOffPassCursor) {
      return []
    }

    return promise.get().then((snapshot) => {
      if (snapshot.docs.length && snapshot.docs.length >= limit) {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1]
        context.commit('setTotalOffPassCursor', firebase.firestore().collection('users').doc(context.rootGetters['credentials/id'])
          .collection('off_pass').orderBy('endDate', 'desc').startAfter(lastVisible).limit(limit))
      } else {
        context.commit('setTotalOffPassCursor', null)
      }

      if (snapshot.empty) {
        context.commit('setTotalOffPass', [])
        return []
      } else {
        const ret = snapshot.docs.map((val) => {
          const data = val.data()
          data.id = val.id
          return data
        })
        context.commit('addTotalOffPass', ret)
        return ret
      }
    })
  },
  /**
   * Get the unexpired offs the user is approved to use.
   * @param {*} context Vuex Context
   * @param {*} id The user ID
   */
  getUserAwardedOffs (context, id) {
    return firebase.firestore().collection('users').doc(id).collection('offs').where('endDate', '>=', new Date()).get()
  },
  /**
   * Get the offs, both expired and unexpired, the user is/was approved to use.
   * @param {*} context Vuex Context
   * @param {*} id The user ID
   */
  getUserTotalAwardedOffs (context, id) {
    return firebase.firestore().collection('users').doc(id).collection('offs').get()
  },
  getUserPendingOffs (context, id) {
    return firebase.firestore().collection('pending_offs').where('requester', '==', id).where('endDate', '>=', new Date()).get()
  },
  getUserTotalPendingOffs (context, id) {
    return firebase.firestore().collection('pending_offs').where('requester', '==', id).get()
  },
  deleteUserPendingOff (context, id) {
    return firebase.firestore().collection('pending_offs').doc(id).delete()
  },
  deleteUserPendingOffs (context, ids) {
    const batch = firebase.firestore().batch()
    for (const id of ids) {
      batch.delete(firebase.firestore().collection('pending_offs').doc(id))
    }
    return batch.commit()
  },
  getUserPendingApprovalOffs (context, id) {
    return firebase.firestore().collection('recommended_offs').where('requester', '==', id).where('endDate', '>=', new Date()).get()
  },
  getUserTotalPendingApprovalOffs (context, id) {
    return firebase.firestore().collection('recommended_offs').where('requester', '==', id).get()
  },
  deleteUserPendingApprovalOff (context, id) {
    return firebase.firestore().collection('recommended_offs').doc(id).delete()
  },
  deleteUserPendingApprovalOffs (context, ids) {
    const batch = firebase.firestore().batch()
    for (const id of ids) {
      batch.delete(firebase.firestore().collection('recommended_offs').doc(id))
    }
    return batch.commit()
  },
  getOffsToRecommend (context, id) {
    return firebase.firestore().collection('pending_offs').where('recommender', '==', id).get()
  },
  getOffsToRecommendAndApprove (context, id) {
    return firebase.firestore().collection('pending_offs').where('recommender', '==', id).where('approver', '==', id).get()
  },
  getOffsRecommended (context, id) {
    return firebase.firestore().collection('recommended_offs').where('recommender', '==', id).get()
  },
  getOffsToApprove (context, id) {
    return firebase.firestore().collection('recommended_offs').where('approver', '==', id).get()
  },
  getOffAwardRecommended (context, id) {
    return firebase.firestore().collection('recommended_awards').where('recommender', '==', id).get()
  },
  getOffsToAward (context, id) {
    return firebase.firestore().collection('recommended_awards').where('approver', '==', id).get()
  },
  deleteOffToAward (context, id) {
    return firebase.firestore().collection('recommended_awards').doc(id).delete()
  },
  deleteOffsToAward (context, ids) {
    const batch = firebase.firestore().batch()
    for (const id of ids) {
      batch.delete(firebase.firestore().collection('recommended_awards').doc(id))
    }
    return batch.commit()
  },
  async applyOff (context, payload) {
    // const batch = firebase.firestore().batch()
    // for (const off of payload) {
    //   const id = off.id
    //   delete off.id
    //   batch.set(firebase.firestore().collection('pending_offs').doc(id), off)
    // }
    // return batch.commit()
    return firebase.firestore().collection('pending_offs').doc().set(payload)
  },
  async recommendOffs (context, payload) {
    const batch = firebase.firestore().batch()
    for (const off of payload) {
      const id = off.id
      delete off.id
      batch.set(firebase.firestore().collection('recommended_offs').doc(id), off)
    }
    return batch.commit()
  },
  async recommendOffAward (context, payload) {
    const batch = firebase.firestore().batch()
    for (const off of payload) {
      batch.set(firebase.firestore().collection('recommended_awards').doc(), off)
    }
    return batch.commit()
  },
  async awardOffs (context, payload) {
    const batch = firebase.firestore().batch()
    for (const id in payload) {
      for (const off of payload[id]) {
        batch.set(firebase.firestore().collection('users').doc(id).collection('offs').doc(), off)
      }
    }
    return batch.commit()
  },
  async addToOffPass (context, payload) {
    const batch = firebase.firestore().batch()
    for (const val of payload) {
      batch.set(firebase.firestore().collection('users').doc(val.id).collection('off_pass').doc(), val.data)
    }
    return batch.commit()
  },
  async deleteOffs (context, payload) {
    const batch = firebase.firestore().batch()
    for (const val of payload) {
      batch.delete(firebase.firestore().collection('users').doc(val.uid).collection('offs').doc(val.offId))
    }
    return batch.commit()
  },
  async addNotificationToken (context, token) {
    return firebase.firestore().collection('users').doc(context.rootGetters['credentials/id'])
      .collection('notification_tokens').doc(token).set({})
  },
  /**
   * Get the MAs currently pending recommendation.
   *
   * This function will call firebase if no local version is found.
   * @param {*} context Vuex context
   * @param {*} reset Set this to `true` to update cache values.
   */
  async getCurrentUserPendingMAs (context, reset) {
    if (context.state.pendingMAs && context.state.pendingMAs.length && !reset) {
      return context.state.pendingMAs
    }
    if (context.state.pendingMAPromise) {
      return context.state.pendingMAPromise
    }
    context.commit('setPendingMAs', null)
    const promise = firebase.firestore().collection('pending_mas')
      .where('requester', '==', context.rootGetters['credentials/id'])
      .where('useDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setPendingMAs', [])
          context.commit('setPendingMAPromise', null)
          return []
        } else {
          context.commit('setPendingMAs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          context.commit('setPendingMAPromise', null)
          return context.state.pendingMAs
        }
      })
    context.commit('setPendingMAPromise', promise)
    return promise
  },
  /**
   * Get the MAs currently pending approval.
   *
   * This function will call firebase if no local version is found.
   * @param {*} context Vuex context
   * @param {*} reset Set this to `true` to update cache values.
   */
  async getCurrentUserRecommendedMAs (context, reset) {
    if (context.state.recommendedMAs && context.state.recommendedMAs.length && !reset) {
      return context.state.recommendedMAs
    }
    if (context.state.recommendedMAPromise) {
      return context.state.recommendedMAPromise
    }
    context.commit('setRecommendedMAs', null)
    const promise = firebase.firestore().collection('recommended_mas')
      .where('requester', '==', context.rootGetters['credentials/id'])
      .where('useDate', '>=', new Date()).get().then((snapshot) => {
        if (snapshot.empty) {
          context.commit('setRecommendedMAs', [])
          context.commit('setRecommendedMAPromise', null)
          return []
        } else {
          context.commit('setRecommendedMAs', snapshot.docs.map((val) => {
            const data = val.data()
            data.id = val.id
            return data
          }))
          context.commit('setRecommendedMAPromise', null)
          return context.state.recommendedMAs
        }
      })
    context.commit('setRecommendedMAPromise', promise)
    return promise
  },
  getUserPendingMAs (context, id) {
    return firebase.firestore().collection('pending_mas').where('requester', '==', id).where('useDate', '>=', new Date()).get()
  },
  getUserTotalPendingMAs (context, id) {
    return firebase.firestore().collection('pending_mas').where('requester', '==', id).get()
  },
  deleteUserPendingMA (context, id) {
    return firebase.firestore().collection('pending_mas').doc(id).delete()
  },
  deleteUserPendingMAs (context, ids) {
    const batch = firebase.firestore().batch()
    for (const id of ids) {
      batch.delete(firebase.firestore().collection('pending_mas').doc(id))
    }
    return batch.commit()
  },
  getUserPendingApprovalMAs (context, id) {
    return firebase.firestore().collection('recommended_mas').where('requester', '==', id).where('useDate', '>=', new Date()).get()
  },
  getUserTotalPendingApprovalMAs (context, id) {
    return firebase.firestore().collection('recommended_mas').where('requester', '==', id).get()
  },
  deleteUserPendingApprovalMA (context, id) {
    return firebase.firestore().collection('recommended_mas').doc(id).delete()
  },
  deleteUserPendingApprovalMAs (context, ids) {
    const batch = firebase.firestore().batch()
    for (const id of ids) {
      batch.delete(firebase.firestore().collection('recommended_mas').doc(id))
    }
    return batch.commit()
  },
  getMAsToRecommend (context, id) {
    return firebase.firestore().collection('pending_mas').where('recommender', '==', id).get()
  },
  getMAsToRecommendAndApprove (context, id) {
    return firebase.firestore().collection('pending_mas').where('recommender', '==', id).where('approver', '==', id).get()
  },
  getMAsRecommended (context, id) {
    return firebase.firestore().collection('recommended_mas').where('recommender', '==', id).get()
  },
  getMAsToApprove (context, id) {
    return firebase.firestore().collection('recommended_mas').where('approver', '==', id).get()
  },
  async applyMA (context, payload) {
    // const batch = firebase.firestore().batch()
    // for (const off of payload) {
    //   const id = off.id
    //   delete off.id
    //   batch.set(firebase.firestore().collection('pending_offs').doc(id), off)
    // }
    // return batch.commit()
    return firebase.firestore().collection('pending_mas').doc().set(payload)
  },
  async recommendMAs (context, payload) {
    const batch = firebase.firestore().batch()
    for (const off of payload) {
      const id = off.id
      delete off.id
      batch.set(firebase.firestore().collection('recommended_mas').doc(id), off)
    }
    return batch.commit()
  },
  /**
   * Delete a user's off pass.
   * @param {*} context The vuex context.
   * @param {*} payload The payload should contain {uid, offPass, reason}
   */
  async deleteOffPass (context, payload) {
    const batch = firebase.firestore().batch()
    batch.delete(firebase.firestore().collection('users').doc(payload.uid).collection('off_pass').doc(payload.offPass.id))
    payload.offPass.reason = payload.reason
    batch.set(firebase.firestore().collection('users').doc(payload.uid).collection('cancelled_offs').doc(payload.offPass.id), payload.offPass)
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
  },
  setOffPass (state, offs) {
    state.offPass = offs
  },
  setOffPassPromise (state, offPromise) {
    state.offPassPromise = offPromise
  },
  setPendingMAs (state, mas) {
    state.pendingMAs = mas
  },
  setPendingMAPromise (state, maPromise) {
    state.pendingMAPromise = maPromise
  },
  setRecommendedMAs (state, mas) {
    state.recommendedMAs = mas
  },
  setRecommendedMAPromise (state, maPromise) {
    state.recommendedMAPromise = maPromise
  },
  setTotalOffPass (state, offs) {
    state.totalOffPass = offs
  },
  addTotalOffPass (state, offs) {
    state.totalOffPass.push(...offs)
  },
  setTotalOffPassCursor (state, offPromise) {
    state.totalOffPassCursor = offPromise
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
