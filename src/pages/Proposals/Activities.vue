<template>
   <div class="container mt-1 py-5">
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Proposal</label>
      <div class="col-sm-9 ">        
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
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Room</label>
      <div class="col-sm-9">
        <input type="text" name="selectedRoom" class="form-control-plaintext pe-input " 
          :value="currentRoom.room_name.name"
          disabled
           >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Activities</label>
      <div class="col-sm-9 ">
        <custom-dropdown
          :options="globalActivities"
          :default="selectedActivityText"
          class="select"
          v-model="selectedActivity"
        ></custom-dropdown>
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Text to appear as</label>
      <div class="col-sm-9 ">
        <input type="text" :placeholder="selectedActivityText" class="form-control-plaintext pe-input my-1" v-model="formData.fields.text_to_display"
        @change="updateProposal"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Quantity:</label>
      <div class="col-sm-9 ">
        <input type="text" class="form-control-plaintext pe-input my-1" v-model="formData.fields.quantity"
        @change="updateProposal"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Activity Rate <small>(Optional)</small>:</label>
      <div class="col-sm-9 ">
        <input type="text" class="form-control-plaintext pe-input my-1" v-model="formData.fields.rate"
        @change="updateProposal"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Time taken</label>
      <div class="col-sm-9 ">
            <div class="flex-80 flex-row">
              <input type="text" required="required" autofocus="autofocus" placeholder="hrs" class="act-ttpt act-hrs mr-15"
                v-model="formData.fields.time_array[0]"
                @change="updateProposal">
              <input type="text" required="required" autofocus="autofocus" placeholder="min" class="act-ttpt act-min mr-15"
              v-model="formData.fields.time_array[1]"
                @change="updateProposal">
              <input type="text" required="required" autofocus="autofocus" placeholder="sec" class="act-ttpt act-secs mr-15"
              v-model="formData.fields.time_array[2]"
                @change="updateProposal">
            </div>   
      </div>
    </div>
    <div class="form-group row">      
          <div class="col-12 h-space">
            <div class="days-grid">
              <div class="grid-days">
                <div class="days-title flex-100 flex-row text-left"> <label for="frequency" class="pd-l-10 text-l">Frequency</label> </div>
                <div class="days-label flex-100 flex-row">
                  <label v-for="(str, i) in days_options" :key="i"><div class="frequency" >{{ str[1] }}</div></label>  
                </div>
                <div class="days-chkbx flex-100 flex-row h-space"> 
                  <div class="flex-row" v-for="(str, i) in days_options" :key="i">
                    <label class="days-checkbox" > 
                      <input type="checkbox" class="checkbox default-checkbox" :value="str[0]" v-model="formData.fields.frequency" @change="updateProposal">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
    <div class="form-group row">      
        <label for="staticEmail" class="col-sm-3 col-form-label text-left">Weeks</label>
      <div class="col-9 h-space ">
        <div class="checkbox-week">
        <div class="flex-row-check" v-for="(str, i) in weeks_options" :key="i+'week'">
            <span class="frequency-label" >{{ str[1] }}</span>
            <label class="days-checkbox" > 
              <input type="checkbox" class="checkbox default-checkbox" :value="str[0]" v-model="formData.fields.weeks" @change="updateProposal">
              <span class="checkmark"></span>
            </label>
          </div> 
        </div>
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

import { DAY_OPTIONS, WEEK_OPTIONS,PE_PROPOSALS, DEFAULT_ACTIVITY } from "@/utils/const";
import request from '@/helpers/fetchWrapper'
import { mapGetters, mapState } from 'vuex'
import { computeTotalProposal } from '@/utils/functions'

export default {
  name: 'ProposalActivities',
  data() {
    return {
      days: [],
      floors: [],
      days_options: DAY_OPTIONS,      
      weeks_options: WEEK_OPTIONS,
      formData: {
        fields: {
          days: [],
          weeks: [],
          quantity: 0,
          text_to_display: '',
          time_taken: '',
          time_array: [0,0,0],
        }
      },
      selectedActivity: null
    };
  },

  mounted() {
    this.formData.fields = {...this.currentActivity}
    this.formData.fields.time_array = Array.isArray(this.currentActivity.time_to_perform_task) ? this.currentActivity.time_to_perform_task : this.currentActivity.time_to_perform_task.split(':') || [0,0,0]
    this.formData.fields.frequency = Array.isArray (this.currentActivity.frequency) ? this.currentActivity.frequency : []
  },

  methods: {
     updateProposal(e){

      if (this.currentActivity === null){
        this.$router.push({ name: 'ProposalLevel' })
      }

      this.formData.fields.time_taken = this.formData.fields.time_array.join(":")
      this.formData.fields.time_to_perform_task = this.formData.fields.time_array.join(":")
      // Update proposal
      const updatedActivity = {...this.currentActivity, ...this.formData.fields}
      
      this.$store.commit('updateGlobalState',{
          prop: 'currentActivity',
          value: updatedActivity
      })

      const currentRoomIndex = this.$store.state.currentProposalLevel.rooms.findIndex(a => a.room_name.term_id === this.currentRoom.room_name.term_id ||
      a.room_name.id === this.currentRoom.room_name.id )

      //let activityIndex = this.$store.state.currentRoom.activities === undefined || this.$store.state.currentRoom.activities === false || -1 

       let activityIndex = this.$store.state.currentRoom.activities === undefined || this.$store.state.currentRoom.activities === false? -1 : this.$store.state.currentRoom.activities.findIndex(a => a.activity.term_id === updatedActivity.activity.term_id )

       const roomActivities = this.$store.state.currentRoom.activities || []

      const updatedActivities = roomActivities.map((act, i) => {
        if (i === activityIndex){
          return {...act, ...updatedActivity }
        }
        return act
      })

      // update the rooms in levels based on current room selected
      
      const updatedRooms =  this.$store.state.currentProposalLevel.rooms.map((room, i) => {
        if (i === currentRoomIndex){
          return {...room, activities: [...updatedActivities]}
        }
        return room
      })

      const updatedLevels = this.currentProposal.acf.levels.map( 
          (a, i)  => {
            if (i === this.currentProposalLevelIndex){
              return {...a, rooms: [...updatedRooms] }
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

        this.$store.commit('updateGlobalState',{
            prop: 'currentProposal',
            value: {...updatedProposal}
        })
        // update proposal   
        this.$store.dispatch('saveProposal')
    },
    saveProposal(){
      
    },
    getDefaultActivityValues(id){
      
      const roomid = this.$store.state.currentRoom.room_name.term_id || this.$store.state.currentRoom.room_name.id
      const room = this.$store.state.settings.acf.rooms.find(a => a.room.term_id === roomid)

      console.log(room, 'selected room')

      if (room){
        const selectedActivity = room.activities.find(a=> a.activity.term_id === id)

        if (selectedActivity){
          console.log(selectedActivity, 'selected act')
          return {
            ...selectedActivity,
            time_to_perform_task: selectedActivity.time_to_perform_task.split(':') || [0,0,0]
          }
        }

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
    
    globalRooms () { return this.$store.state.rooms;},
    globalActivities () {return this.$store.state.activities; },  
    proposal_id () {
      return this.currentProposal.id
    },
    selectedActivityText () {
      return this.currentActivity?.activity?.name || 'Edit an activity'
    },
    ...mapState([
      'currentRoom',
      'currentProposal',
      'currentActivity',
    ]),
    ...mapGetters([
      'currentProposalLevelIndex'
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
    selectedActivity: function(newVal, oldVal) {      
      
    if ( this.currentRoom.name ==='None selected') return

    let newActivity = {}

     let activityIndex = this.$store.state.currentRoom.activities === undefined || this.$store.state.currentRoom.activities === false? -1 : this.$store.state.currentRoom.activities.findIndex(a => a.activity.term_id === newVal.id )
    // activity not yet in room activities
     if (activityIndex === -1){

      const currentRoomIndex = this.$store.state.currentProposalLevel.rooms.findIndex(a => a.room_name.term_id === this.currentRoom.room_name.id ||
      a.room_name.id === this.currentRoom.room_name.id )

      let theRoom = { ...this.currentRoom }

      console.log(newVal.id, "id of")

       newActivity = {...DEFAULT_ACTIVITY, activity: {...newVal, term_id: newVal.id}, ...this.getDefaultActivityValues(newVal.id) || null }

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

          this.$store.commit('updateGlobalState',{
            prop: 'currentProposal',
            value: {...updatedProposal}
        })

        this.$store.dispatch('saveProposal')

       this.formData.fields = {
           
              days: [],
              weeks: [],
              quantity: 0,
              text_to_display: '',
              time_taken: '',
              time_array: [0,0,0]
           
          }
     
     }




      if (newVal !== oldVal){
        this.$store.commit('updateGlobalState', {
          prop: 'currentActivity',
          value: activityIndex === -1 ? newActivity : this.$store.state.currentRoom.activities[activityIndex]
        })        
      }
    }
  }
};
</script>

<style lang="scss" >
  .mr-15 {
    margin-right: 15px;
  }
  .flex-row-check {
    justify-content: space-evenly;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  .frequency-label {
    height: 25px;
    padding-top: 10px;
  }
  .checkbox-week {
     display: flex;
     flex-wrap: wrap;
  }
  .checkbox-week > *{
     flex: 1 1 25%;
  }
   @media screen and (max-width: 649px) and (min-width: 1px) { 
    .checkbox-week > *{
     flex: 1 1 100%;
    }
    .flex-row-check {
      flex-wrap: nowrap;
      justify-content: start ;
    }
    .flex-row-check > * {
      flex: 0 0 26%;
      gap: 10px;
      margin-bottom: 10px;
    }
   } 
</style>