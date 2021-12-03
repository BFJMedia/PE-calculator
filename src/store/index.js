import Vue from "vue";
import Vuex from "vuex"
import request from '@/helpers/fetchWrapper'
import { SETTINGS_URL, PE_PROPOSALS, GET_TAXONOMY } from '@/utils/const'
import { computeTotalProposal } from '@/utils/functions'

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    count: 0,
    posts: [],
    currentUser: null,
    settings:null,
    rooms:[],
    activities:[],
    levels:[],
    periodicals:[],
    optionals:[],
    floorActivities:[],
    currentProposal: null,
    proposalMode: 'new',
    currentProposalLevel: null,
    currentRoom: null,
    currentActivity: null,
    totalAmount: 0,
    /*  
    currentProposalLevelIndex: -1,
    currentProposalRoomIndex: -1,
    currentProposalActivityIndex: -1, 
    */
  },
  mutations: {
    
    updatePosts (state, payload) {
      state.posts = payload
    },
    updateCurrentProposal(state, payload){
      state.currentProposal = { ...payload}
      state.currentProposalLevel = null
      state.currentRoom = null
      state.currentActivity = null
    },
    setUser(state, payload){
      state.currentUser = { ...payload}
    },
    updateSettings (state, payload) {
      state.settings = { ...payload }
    },
    setProposalMode (state, payload) {
      state.proposalMode = payload
    },
    updateGlobalState (state, payload) {
      state[payload.prop] = payload.value
    }
    

  },
  actions: {
    getSettings ({commit}){
      request(SETTINGS_URL, {
        method: 'GET'
      }).then((res) => {              
          commit('updateSettings', res)
      }).catch((err) => {
        console.log(err)
      })
    },
    getTaxonomy ({commit}, param){
      
      request(GET_TAXONOMY+param.taxonomy+'?per_page=99', {
        method: 'GET'
      }).then((res) => {              
          commit('updateGlobalState', {prop: param.taxonomy, value: res})
      }).catch((err) => {
        console.log(err)
      })
    },
    async createNewProposal ({commit}){
      await request(PE_PROPOSALS, {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Proposal - edit title',
          status: 'publish'
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {              
          commit('updateCurrentProposal', res)
      }).catch((err) => {
        console.log(err)
      })
    },

  

    async saveProposal ({commit, state}, params) {

      let updatedProposal = {...state.currentProposal}
      if (updatedProposal.fields === undefined){
        updatedProposal.fields = {...updatedProposal.acf}
      }



      updatedProposal.fields.total_amount = computeTotalProposal(updatedProposal);

      console.log(updatedProposal.fields.total_amount)

      await request(`${PE_PROPOSALS}/${state.currentProposal.id}`, {
        method: 'POST',
        body: JSON.stringify(updatedProposal),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {              
          commit('updateCurrentProposal', res)
      }).catch((err) => {
        console.log(err)
      })

    },
/*     computeTotalProposal({commit, state}) {
      
    },
    computeTotalFloorActivities({commit, state}) {
      
    },
    computeTotalRoomActivities({commit, state}) {
      
    }, */
  },
  modules: {},
  getters: {
    getAllPosts: state => state.posts,
    currentUser: state => state.currentUser,
    currentProposalLevelIndex: state => {
      
      if (state.currentProposalLevel === null) return -1

      return state.currentProposal.acf.levels.findIndex ( a=> a.level.term_id === state.currentProposalLevel.level.term_id )

    },
    currentProposalRoomIndex: state => {
      if (state.currentRoom === null) return -1
      
      const levelIndex = state.currentProposal.acf.levels.findIndex ( a=> a.level.term_id === state.currentProposalLevel.id )

      return state.currentProposal.acf.levels[levelIndex].rooms.findIndex ( a=> a.room_name.term_id === state.currentProposalLevel.id )
      
    },
    currentProposalActivityIndex: state => {
      if (state.currentActivity === null) return -1

      return -1
    }

  }
})