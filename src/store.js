import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    audioPlayer: {
      active: false,
      track: null,
      position: 0,
      volume: 0.7,
      paused: true,
      audio: null
    },
    upload: {
      uploadInProgress: false,
      uploadState: 'complete', // 'uploading' 'processing' 'error' 'warning' 'complete'
      uploadStatus: null,
      uploadId: 0
    },
    user: null,
    token: null,
    isUserLoggedIn: false
  },
  mutations: {
    setAudio (state, audio) {
      state.audioPlayer.audio = audio
    },
    closePlayer (state) {
      state.audioPlayer.active = false
      state.audioPlayer.paused = true
    },
    setUser (state, user) {
      state.user = user
      state.isUserLoggedIn = user !== null
    },
    setPaused (state, pause) {
      state.audioPlayer.paused = pause
    },
    setTrack (state, track) {
      state.audioPlayer.active = true
      state.audioPlayer.track = track
      state.audioPlayer.position = 0.0
      state.audioPlayer.paused = false
    },
    setToken (state, token) {
      state.token = token
      if (token) localStorage.setItem('token', token)
    },
    setPosition (state, positionVal) {
      if (positionVal > 1) positionVal = 1.0
      if (positionVal < 0) positionVal = 0.0
      state.audioPlayer.position = positionVal
    }
  },
  actions: {
    setAudio ({commit}, audio) {
      commit('setAudio', audio)
    },
    closePlayer ({commit}) {
      commit('closePlayer')
    },
    setTrack ({commit}, track) {
      commit('setTrack', track)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setPaused ({commit}, paused) {
      commit('setPaused', paused)
    },
    setPosition ({commit}, progressVal) {
      commit('setPosition', progressVal)
    }
  },
  getters: {
    getPlayer: state => state.audioPlayer,
    getTrack: state => state.audioPlayer.track
  }
})
