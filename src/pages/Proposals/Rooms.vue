<template>
  <div class="container mt-5-percent py-5">
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-l">Proposal</label>
      <div class="col-sm-9">
        <input type="text" class="form-control-plaintext pe-input " 
          :value="currentProposal.title.rendered"
          disabled
           >
      </div>
    </div>
    <div class="form-group row">
      <label for="selectedLevel" class="col-sm-3 col-form-label text-l">Current Level</label>
      <div class="col-sm-9">
        <input type="text" name="selectedLevel" 
          class="form-control-plaintext pe-input " 
          :value="currentLevel.level.name"
          disabled
           >
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-l">Rooms</label>
      <div class="col-sm-9">
        <custom-dropdown
          :options="rooms"
          :default="selectedRoomText"
          class="select"
          v-model="selectedRoom"
        ></custom-dropdown>
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-l">Activities</label>
      <div class="col-sm-9">
        <custom-dropdown
          :options="activities"
          :default="selectedActivityText"
          class="select"
          v-model="selectedActivity"
        ></custom-dropdown>
      </div>
    </div>

    <div class="form-group row">
      <label for="notes" class="col-sm-3 col-form-label text-l">Notes</label>
      <div class="col-md-9 col-sm-9 mb-2">
        <textarea type="text"  name="notes" class="form-control-plaintext pe-input mb-2" v-model="proposal.fields.notes"
        @change="updateSettings"></textarea>
      </div>
    </div>
    <div class="bottom-80">
    <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label text-left">Total Amount</label>
        <div class="col-sm-9 total">
           <strong>$ {{totalAmount }}</strong>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from "@/helpers/fetchWrapper";
import { GET_TAXONOMY, PE_PROPOSALS, DEFAULT_ACTIVITY } from "@/utils/const";

import { computeTotalProposal } from '@/utils/functions'
export default {
  name: "PlanetFeRooms",

  data() {
    return {
      rooms: [],
      activities: [],
      proposal: {
        title: {
          rendered: ''
        },
        fields: {
          notes: '',
          levels: ''
        },
        notes:''
      },
      selectedRoom: null,
      selectedActivity: null
    };
  },

  mounted() {    
    this.proposal = {...this.currentProposal}
    this.proposal.fields = {...this.currentProposal.acf}
  },

  methods: {
    fetchRooms: function () {
      request(`${GET_TAXONOMY}rooms`, {
        method: "GET",
      })
        .then((res) => {
          this.rooms = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchActivities: function () {
      request(`${GET_TAXONOMY}activities`, {
        method: "GET",
      })
        .then((res) => {
          this.activities = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  async updateSettings(){
      if (this.currentProposal === null){
        this.$router.push({ name: 'ProposalHeader' })
      }

      if (this.proposal_id){
        
        await  request(`${PE_PROPOSALS}/${this.proposal_id}`, {
        method: 'POST',
        body: JSON.stringify(this.proposal),
        headers: {
          "Content-Type": "application/json",
        },
        }).then((res) => {              
            this.$store.commit('updateCurrentProposal', res)
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  },
  computed: {
    currentProposal () {
      return this.$store.state.currentProposal;
    },
    currentLevel () {
      return this.$store.state.currentProposalLevel || {name: "None selected"};
    },
    currentRoom () {
      return this.$store.state.currentRoom || {name: "None selected"};
    },
    currentLevelIndex () {
      
      return this.proposal.fields.levels.findIndex(a=> a.level.term_id === this.currentLevel?.id || a.level.id === this.currentLevel?.id
        ) || 0;
    },
    currentRoomIndex () {
      const currentlevel = this.proposal.fields.levels[this.currentLevelIndex]
      return currentlevel.rooms.findIndex(a => a.room_name.term_id === this.currentRoom?.id ||  a.room_name.id === this.currentRoom?.id) || 0;
    },
    globalRooms () {
      return this.$store.state.rooms;
    },
    globalActivities () {
      return this.$store.state.activities;
    },
    proposal_id () {
      return this.currentProposal.id
    },
    selectedActivityText () {
      return this.$store.state.currentActivity?.activity.name || 'Select an activity'
    },
    selectedRoomText () {
      return this.currentRoom?.room_name?.name || 'Select a room'
    },
     ...mapGetters([
      'currentProposalLevelIndex',
      'currentProposalRoomIndex'
    ]),
    totalAmount (){
      return computeTotalProposal(this.currentProposal, this.$store.state.floor_activities)
    }
  }, 
  watch: {
    globalRooms: {
      immediate: true,
      handler: function(){
        this.rooms = this.globalRooms
      }
    },
    globalActivities: {
      immediate: true,
      handler: function(){
        this.activities = this.globalActivities
      }
    },
    selectedRoom: function(newVal, oldVal) {      

      // on this part we add to the level -> room or not
      // get the room index first
      // if not found add
      let roomIndex = this.currentProposal.acf.levels[this.currentProposalLevelIndex].rooms.findIndex(a => a.room_name.term_id === newVal.id)

      if (roomIndex === -1){
        const newRoom = {
          activities: [],
          room_name: {
            ...newVal,
            term_id: newVal.id
          }
        }

        let levelRooms = [...this.currentLevel.rooms || [], newRoom]

        const updateLevels = this.currentProposal.acf.levels.map( (a, i)=> {
              if (i === this.currentProposalLevelIndex){
                return {...a, rooms : levelRooms }
              }
          return a
        })
        
        const updatedProposal = {
            ...this.currentProposal,               
               fields: {
                 levels: updateLevels
               },
               acf: {
                 levels: updateLevels
               }
          }
          
          this.$store.commit('updateCurrentProposal', updatedProposal)

          this.$store.commit('updateGlobalState', {
            prop: 'currentProposalLevel',
            value: {...this.currentLevel, rooms: levelRooms}
          })
        
          if (newVal !== oldVal){
            this.$store.commit('updateGlobalState', {
              prop: 'currentRoom',
              value: {room_name: newVal, activities: [] }
            })
          }

          
          this.$store.dispatch('saveProposal')
      }else {
        // just set the current room
        if (newVal !== oldVal){

          let room = this.currentProposal.acf.levels[this.currentProposalLevelIndex].rooms[roomIndex]

          this.$store.commit('updateGlobalState', {
            prop: 'currentRoom',
            value: { ...room }
          })
        }
      }

    },
    selectedActivity: function(newVal, oldVal) {
      
      if ( this.currentRoom.name ==='None selected') return

      // find the activity in current room
      // if not found let's add it to the room
      
      let activityIndex = this.$store.state.currentRoom.activities === undefined || this.$store.state.currentRoom.activities === false? -1 : this.$store.state.currentRoom.activities.findIndex(a => a.activity.term_id === newVal.id )

      const currentRoomIndex = this.$store.state.currentProposalLevel.rooms.findIndex(a => a.room_name.term_id === this.currentRoom.room_name.id ||
      a.room_name.id === this.currentRoom.room_name.id )

      let theRoom = { ...this.currentRoom }

      const newActivity = {...DEFAULT_ACTIVITY, activity: {...newVal, term_id: newVal.id}}

      if (activityIndex === -1){
        theRoom.activities = [ ...theRoom.activities || [], newActivity ]

        this.$store.commit('updateGlobalState', {
          prop: 'currentRoom',
          value: {...theRoom }
        })

        let updatedLevel = {...this.currentLevel, rooms: this.currentLevel.rooms.map((a, i)=>{
              if (i === currentRoomIndex ){
                return {...theRoom}
              }            
              return a
            }) 
          }
                
        this.$store.commit('updateGlobalState', {
          prop: 'currentProposalLevel',
          value: {...updatedLevel }
        })
        
        const updatedLevels = this.currentProposal.acf.levels.map( 
          (a, i)  => {
            if (i === this.currentProposalLevelIndex){
              return {...updatedLevel}
            }
            return a
        })

        const updatedProposal = {
          ...this.currentProposal,
            fields: {
              levels: updatedLevels
            },
            acf: {
              levels: updatedLevels
            }
        }
                
      /*
        this.$store.commit('updateCurrentProposal', updatedProposal)
      */
         
        this.$store.commit('updateGlobalState',{
            prop: 'currentProposal',
            value: {...updatedProposal}
        })

        this.$store.dispatch('saveProposal')


        
      }
      
      // set current activity

      if (newVal !== oldVal){
        this.$store.commit('updateGlobalState', {
          prop: 'currentActivity',
          value: activityIndex === -1 ? newActivity : this.$store.state.currentRoom.activities[activityIndex]
        })        
      }

      

    },
  }
};
</script>

<style lang="scss" scoped>
</style> 