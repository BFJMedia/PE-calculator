<template>
  <div class="container mt-5-percent py-5">
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Proposal</label>
      <div class="col-sm-9 ">
        <input type="text" class="form-control-plaintext pe-input " 
          :value="proposal.title.rendered"
          disabled
         >  
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Periodicals</label>
      <div class="col-sm-9 ">
        <custom-dropdown
          :options="periodicals"
          :default="'Select periodical'"
          class="select"
          @onAdd="addPeriodical($event)"
          @onDelete="confirmDeletePeriodical($event)"
          @onEdit="editPeriodical($event)"
          v-model="periodicalData.selectedPeriodical"
        ></custom-dropdown>
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Frequency</label>
      <div class="col-sm-9 ">
        <custom-dropdown
          :options="frequencies"
          :default="'Select frequency'"
          class="select"
          @onAdd="addFrequency($event)"
          @onDelete="confirmDeleteFrequency($event)"
          @onEdit="editFrequency($event)"
          v-model="periodicalData.selectedFrequency"
        ></custom-dropdown>
      </div>
    </div>
    <div class="form-group row">
      <label for="costPerActivity" class="col-sm-3 col-form-label text-left">Cost Per Activity</label>
      <div class="col-sm-9 ">
        <input type="text" 
          class="form-control-plaintext pe-input my-1" value=""
            v-model="periodicalData.cost_per_activity"
            @change="updateProposalPeriodical"
          >
      </div>
    </div>
    <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label text-left">
          Total Amount
      </label>
      <div class="col-sm-9 total">
           <strong>$ {{totalAmount }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/helpers/fetchWrapper'
import { GET_TAXONOMY, UPDATE_TAXONOMY } from '@/utils/const'
import { computeTotalProposal } from '@/utils/functions'

export default {
  name: 'ProposalPeriodicals',

  data() {
    return {
      taxonomyData: {
        name:'',
        description:''
      },
      periodicalData: {
          selectedPeriodical: null,
          selectedFrequency: null,
          cost_per_activity: null,
        }
    };
  },

  mounted() {
    
  },

  methods: {
    addPeriodical: function(e){
      this.addTaxonomy(e, 'periodicals')
    },
    editPeriodical: function(e){
      this.addTaxonomy(e, 'periodicals')
    },
    confirmDeletePeriodical: function(e){
      this.deleteTaxonomy(e, 'periodicals')
    },
    addFrequency: function(e){
      this.addTaxonomy(e, 'frequencies')
    },
    editFrequency: function(e){
      this.editTaxonomy(e, 'frequencies')
    },
    confirmDeleteFrequency: function(e){
      this.deleteTaxonomy(e, 'frequencies')
    },
    addTaxonomy: function(e, taxonomy){
      this.action = 'add';
      this.taxonomyData.name = e;
      const findRoom = this[taxonomy].find(a => a.name === this.taxonomyData.name)
      if (this.taxonomyData.name !== '' && findRoom === undefined){
        this.saveData(taxonomy)
      }
    },
    editTaxonomy: function(e = null, taxonomy){

      const name = e.value || this.selected.name;

      this.action = 'edit';
      this.taxonomyData.name = name;
      this.id = e.id;

      this.saveData(taxonomy);
    },
    deleteTaxonomy: function(id, taxonomy){
      // if (this.selected === null) return
      request( `${UPDATE_TAXONOMY}${taxonomy}/${id}`, {
          method: 'DELETE'
        }).then((res) => {              
            console.log(res)
            this.taxonomyData = {
              name:'',
              description:''
            };
            
        }).catch((err) => {
          console.log(err)
        })
    },
    saveData: function(taxonomy) {
      const url = this.action==='add' ?  `${UPDATE_TAXONOMY}${taxonomy}`  : `${UPDATE_TAXONOMY}${taxonomy}/${this.id}`

      let formData = {...this.taxonomyData};

      request(`${url}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        console.log(res);

        this.taxonomyData = {
          name:'',
          description:''
        };
        this.$store.dispatch('getTaxonomy', {taxonomy: taxonomy});
      }).catch((err) => {
        console.log(err)
      })
    },
    confirmDeleteTaxonomy: function(e, taxonomy) {

      const currentRoomId = e;
      const findRoom = this[taxonomy].find(a => a.id === e);
      const currRoomName = findRoom.name;

       this.$confirm(
        {
          message: `Are you sure you want to delete ${currRoomName}?`,
          button: {
            no: 'No',
            yes: 'Yes'
          },
          /**
          * Callback Function
          * @param {Boolean} confirm 
          */
          callback: confirm => {
            if (confirm) {
              this.deleteTaxonomy(currentRoomId, taxonomy);
            }
          }
        }
      )
    },
    updateProposalPeriodical: function() {
      if (this.periodicalData.selectedPeriodical === null) return

      const findIndex = this.proposal.acf.periodical_activities.findIndex(a => a.periodical.term_id === this.periodicalData.selectedPeriodical.id);
      

      if (findIndex === -1) return
      let propposalActivities = [...this.proposal.acf.periodical_activities]

       propposalActivities[findIndex] = 
          { ...this.proposal.acf.periodical_activities[findIndex],
            cost_per_activity: this.periodicalData.cost_per_activity
          }
        
       const updatedProposal = {
            ...this.proposal,               
               fields: {
                 periodical_activities:propposalActivities
               },
               acf: {
                 periodical_activities: propposalActivities
               }
          }

      this.$store.commit('updateGlobalState',{
        prop: 'currentProposal',
        value: updatedProposal
      })
      this.$store.dispatch('saveProposal')
    }
  },
  computed: {
    currentProposal () {
      return this.$store.state.currentProposal;
    },
    proposal () {
      return this.$store.state.currentProposal;
    },
    currentLevel () {
      return this.$store.state.currentProposalLevel || {name: "None selected"};
    },
    periodicals () {
      return this.$store.state.periodicals;
    },
    frequencies () {
      return this.$store.state.frequencies;
    },
    proposal_id () {
      return this.currentProposal.id
    },
    totalAmount (){
      return computeTotalProposal(this.currentProposal, this.$store.state.floor_activities)
    }
  },
  watch: {
    'periodicalData.selectedPeriodical': function(newVal, oldVal) {
      
      // the current proposal

      let propposalActivities = []

      //Array.isArray(this.proposal.acf.periodical_activities) ? [...this.proposal.acf.periodical_activities, newVal] : [newVal]

      if (Array.isArray(this.proposal.acf.periodical_activities)){
        // find the per
        const findIndex = this.proposal.acf.periodical_activities.findIndex(a => a.periodical.term_id === newVal.id);
        if (findIndex === -1 ){
          propposalActivities = [...this.proposal.acf.periodical_activities, 
          { cost_per_activity: 0,
            frequency: {},
            periodical: {...newVal, term_id: newVal.id}
          }
          ]
        } else{
          
          propposalActivities[findIndex] = 
          { ...this.proposal.acf.periodical_activities[findIndex],
            periodical: {...newVal, term_id: newVal.id}
          }

          this.periodicalData.cost_per_activity = propposalActivities[findIndex].cost_per_activity
        }
      }else{
        propposalActivities = [
          { cost_per_activity: 0,
            frequency: {},
            periodical: {...newVal, term_id: newVal.id}
          }
        ]
      }

        const updatedProposal = {
            ...this.proposal, 
              
               fields: {
                 periodical_activities:propposalActivities
               },
               acf: {
                 periodical_activities: propposalActivities
               }
          }

      this.$store.commit('updateGlobalState',{
        prop: 'currentProposal',
        value: updatedProposal
      })
      this.$store.dispatch('saveProposal')
      //this.periodicalData.cost_per_activity = ""
    },
    'periodicalData.selectedFrequency': function(newVal, oldVal){
      if (this.periodicalData.selectedPeriodical === null) return

      const findIndex = this.proposal.acf.periodical_activities.findIndex(a => a.periodical.term_id === this.periodicalData.selectedPeriodical.id);
      

      if (findIndex === -1) return
      let propposalActivities = [...this.proposal.acf.periodical_activities]

       propposalActivities[findIndex] = 
          { ...this.proposal.acf.periodical_activities[findIndex],
            frequency: {...newVal, term_id: newVal.id}
          }
        
       const updatedProposal = {
            ...this.proposal, 
              
               fields: {
                 periodical_activities:propposalActivities
               },
               acf: {
                 periodical_activities: propposalActivities
               }
          }

      this.$store.commit('updateGlobalState',{
        prop: 'currentProposal',
        value: updatedProposal
      })
      this.$store.dispatch('saveProposal')
      
    }
  }
};
</script>

<style lang="scss" scoped>

</style>