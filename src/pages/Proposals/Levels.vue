<template>
  <div class="container mt-5-percent py-5">
    
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Proposal</label>
      <div class="col-sm-9">
        <input type="text" class="form-control-plaintext pe-input " 
          :value="currentProposal.title.rendered"
          disabled
          >
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Level</label>
      <div class="col-sm-9">
        <custom-dropdown
          :options="levels"
          :default="selectedLevel"
          class="select"
          v-model="selected"
          @onAdd="addLevel($event)"          
          @onEdit="editLevel($event)"
        ></custom-dropdown>
      </div>
    </div>

    <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label">Floor Activities</label>
       <div class="col-sm-9">
        <div class="days-label flex-100 flex-row">
          <label v-for="(str, i) in days_options" :key="i">
            <div class="default-days" >{{ str[1] }}</div>
          </label>  
        </div>
      </div>
    </div>
    <div class="form-group row" v-if="currentProposalLevel">
      <div >
        <div  v-for="(activity, i) in currentProposalLevel.floor_activities" :key="activity.activity.term_id">
          <FloorActivity 
            :activity="activity" 
            :floor_activities="filteredFloorActivities"
            @onChangeActivity="updateFloorActivity"
            :index="i"
          />
        </div>
        <div v-if="totalFloorActivities !==6" class="">
          <button class="btn-circle" type="button" @click="addFloorActivity">Add</button>
        </div>
      </div>
    </div>
            <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label text-left">Total Amount</label>
        <div class="col-sm-9 total">
           <strong>$ 125.55</strong>
        </div>
    </div>
  </div>
</template>

<script>
import request from '@/helpers/fetchWrapper'
import {  GET_TAXONOMY, UPDATE_TAXONOMY, 
          DAY_OPTIONS, DEFAULT_LEVEL, 
          DEFAULT_FLOOR_ACTIVITY } 
        from '@/utils/const'
import CustomDropdown from '../../components/common/CustomDropdown.vue';
import FloorActivity from './FloorActivity.vue';

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ProposalLevels',
  components: {
    FloorActivity
  },
  data() {
    return {      
      days_options: DAY_OPTIONS,
      proposal: {
        title: {
          rendered: ''
        }
      },
      selected: null,
      floors:[],
      levels:[],
      action: 'add',
      levelData: {
        name:'',
        description:''
      },

    };
  },
  methods: {
    fetchLevels: function(){
        request(`${GET_TAXONOMY}levels`, {
          method: 'GET'
        }).then((res) => {              
            this.levels = res
        }).catch((err) => {
          console.log(err)
        })
    },
    addLevel: function(e){
      this.action = 'add';
      this.levelData.name = e;
      const findRoom = this.levels.find(a => a.name === this.levelData.name)
      if (this.levelData.name !== '' && findRoom === undefined){
        this.saveData()
      }
      
    },
    editLevel: function(e = null){
      const name = e.value || this.selected.name;

      this.action = 'edit';
      this.levelData.name = name;
      this.id = e.id;

      this.saveData();
    },
    /*
      Save data is for saving the level
    */
    saveData: function() {
      const url = this.action==='add' ?  `${UPDATE_TAXONOMY}levels`  : `${UPDATE_TAXONOMY}levels/${this.id}`

      let formData = {...this.levelData};

      request(`${url}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        console.log(res);        
        this.fetchLevels();
      }).catch((err) => {
        console.log(err)
      })
    },
    updateFloorActivity: function(e){
      const updatedLevels = this.proposal.fields.levels.map((a,i) =>{
        if ( i === e.index) {
          return {...e}
        }
        return a
      })

      
      const updatedProposal = {
          ...this.proposal, 
            
              fields: {
                levels: updatedLevels
              },
              acf: {
                levels: updatedLevels
              }
        }
        
        this.$store.commit('updateGlobalState',{
          prop: 'currentProposal',
          value: updatedProposal
        } )


       this.$store.commit('updateGlobalState', {
        prop: 'currentProposalLevel',
        value: this.$store.state.currentProposal.acf.levels[e.index]
      })
      
      this.$store.dispatch('saveProposal')
    },
    addFloorActivity: function(){
      const updatedFloorActivities = [...this.currentProposalLevel.floor_activities || [], DEFAULT_FLOOR_ACTIVITY]

      let levelIndex = (this.proposal.acf.levels === false || this.proposal.acf.levels === undefined) ? -1 : this.proposal.acf.levels.findIndex(a => a.level?.term_id === this.currentProposalLevel.level.term_id)

      const updatedFloorAcvititesLevel = {...this.currentProposalLevel, 
        floor_activities: updatedFloorActivities
      }

      const updatedLevels = this.proposal.fields.levels.map((a,i) =>{
        if ( i === levelIndex) {
          return updatedFloorAcvititesLevel
        }
        return a
      })

      const updatedProposal = {
          ...this.proposal, 
            
              fields: {
                levels: updatedLevels
              },
              acf: {
                levels: updatedLevels
              }
        }
        
        this.$store.commit('updateGlobalState',{
          prop: 'currentProposal',
          value: updatedProposal
        } )


       this.$store.commit('updateGlobalState', {
        prop: 'currentProposalLevel',
        value: this.$store.state.currentProposal.acf.levels[levelIndex]
      })
    }
  },
  
  mounted() {    
    if (this.$store.currentProposal === null){
      this.$router.push({ name: 'ProposalHeader' })
    }
    this.proposal = {...this.currentProposal}
    this.proposal.fields = {...this.currentProposal.acf}
  },
/*  beforeRouteEnter(to, from, next) {
   next(vm => {
       if (vm.$store.currentProposal === null){
         vm.$router.push(this.$route.query.redirect || '/proposals')
       }
        //vm.$store.dispatch('loadLeaderboard');
    });
  }, */
  computed: {
    currentProposal () {
      return this.$store.state.currentProposal;
    },
    globalLevels () {
      return this.$store.state.levels;
    },
    currentProposalLevel () {
      return this.$store.state.currentProposalLevel;
    },
    selectedLevel() {
       return this.currentProposalLevel?.level?.name || "Select level here"
    },
    ...mapGetters([
      'currentProposalLevelIndex',
      'currentProposalRoomIndex',

    ]),
    ...mapState([
      'floor_activities',

    ]),
    totalFloorActivities() {
      return (this.currentProposalLevel?.floor_activities || this.currentProposalLevel?.floor_activities == false) ? 0 : this.currentProposalLevel?.floor_activities.length 
    },
    currentFloorActivites(){
      if (this.currentProposalLevel.floor_activities === false) return []

      return this.currentProposalLevel.floor_activities.map(a => a.activity.term_id)

    },
    filteredFloorActivities() {
      if (this.currentProposalLevel.floor_activities === false || this.currentProposalLevel.floor_activities.length ===0) return this.floorActivities

      return this.floor_activities.filter( a => {
        if ( !this.currentFloorActivites.includes(a.id)) return a } )
    }

  },
  watch: {
    currentProposal(){
      this.proposal = this.$store.state.currentProposal
    },
    selected: function(newVal, oldVal) {
      
      if (newVal !== oldVal){
        
        // set the global level

        let levelIndex = (this.proposal.acf.levels === false || this.proposal.acf.levels === undefined) ? -1 : this.proposal.acf.levels.findIndex(a => a.level?.term_id === newVal.id)

        // if not found add it

        if (levelIndex === -1) {
          let newLevel = { 
            ...DEFAULT_LEVEL,            
            level: {...newVal, term_id: newVal.id },            
          }
          const updatedProposal = {
            ...this.proposal, 
              
               fields: {
                 levels: [...this.proposal.fields.levels || [], newLevel]
               },
               acf: {
                 levels: [...this.proposal.fields.levels || [], newLevel]
               }
          }
          
          this.$store.commit('updateGlobalState',{
            prop: 'currentProposal',
            value: updatedProposal
          } )

        /*
            this.$store.commit('updateGlobalState', {
            prop: 'currentProposalLevelIndex',
            value: updatedProposal.fields.levels.length - 1
          }) 
        */
          levelIndex = updatedProposal.fields.levels.length - 1

        // dispatch saving of proposal if new level was addded 
        this.$store.dispatch('saveProposal')

        }else{
/*           this.$store.commit('updateGlobalState', {
            prop: 'currentProposalLevelIndex',
            value: levelIndex
          }) */
        }
        
        this.$store.commit('updateGlobalState', {
          prop: 'currentProposalLevel',
          value: this.$store.state.currentProposal.acf.levels[levelIndex]
        })
      }
    },
    globalLevels: {
      immediate: true,
      handler: function(){
        this.levels = this.globalLevels
      }
    }
  }
};
</script>

<style lang="scss" >
  .btn-circle {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
</style>