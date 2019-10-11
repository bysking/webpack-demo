import * as types from '../types'

const state = {
  token: null, // token
  userInfo: null, // 用户信息
  userPermissions: {} // 用户权限集合
}

const mutations = { //
  [types.SET_USER] (state, user) {
    state.userInfo = user
  },
  [types.REMOVE_USER] (state) {
    state.userInfo = null
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.REMOVE_TOKEN] (state) {
    state.token = null
  }
}

const actions = {
  setUser ({ commit }, user) {
    commit(types.SET_USER, user)
  },
  removeUser ({ commit }) {
    commit(types.REMOVE_USER)
  },
  setToken ({ commit }, token) {
    commit(types.SET_TOKEN, token)
  },
  removeToken ({ commit }) {
    commit(types.REMOVE_TOKEN)
  }
}

const getters = {
  userInfo: state => state.userInfo,
  token: state => state.token
}

export default {
  state,
  actions,
  mutations,
  getters
}
