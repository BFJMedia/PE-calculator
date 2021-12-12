<template> 
  <div class="container mt-5-percent py-5">
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
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Optional Extras:</label>
      <div class="col-sm-9 ">
        <custom-dropdown
          :options="optionals"
          :default="'Select optional'"
          class="select"
          @onAdd="addOptional($event)"
          @onDelete="confirmDeleteOptional($event)"
          @onEdit="editOptional($event)"
          v-model="optionalData.selectedOptional"
        ></custom-dropdown>
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Cost Per Activity</label>
      <div class="col-sm-9 ">
        <input type="text" class="form-control-plaintext pe-input my-1" 
          v-model="optionalData.cost_per_activity"
          @change="updateProposalOptional"
        >      
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-12 col-form-label text-left">   
        <small>*Note: Optional Extras costs do not add into calculations.</small>
      </label> 
    </div>
        <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label text-left">Total Amount</label>
        <div class="col-sm-9 total">
           <strong>$ {{ totalAmount }}</strong>
        </div>
    </div>
  </div>
</template>

<script>
import request from '@/helpers/fetchWrapper'
import { GET_TAXONOMY, UPDATE_TAXONOMY } from '@/utils/const'
import { computeTotalProposal } from '@/utils/functions'


export default {
  name: 'PlanetFeOptional',

  data() {
    return {
        taxonomyData: {
        name:'',
        description:''
      },
      optionalData: {
          selectedOptional: null,
          cost_per_activity: null,
        }
    };
  },

  mounted() {
    
  },

  methods: {    
    addOptional: function(e){
      this.addTaxonomy(e, 'optionals')
    },   
    editOptional: function(e){
      this.addTaxonomy(e, 'optionals')
    },
    confirmDeleteOptional: function(e){
      this.deleteTaxonomy(e, 'optionals')
    },
    addTaxonomy: function(e, taxonomy){
      this.action = 'add';
      this.taxonomyData.name = e;
      const findRoom = this[taxonomy].find(a => a.name === this.taxonomyData.name)
      if (this.taxonomyData.name !== '' && findRoom === undefined){
        this.saveData(taxonomy)
      }
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
    updateProposalOptional: function(){
       let proposalOptionals = []

      if (this.optionalData.selectedOptional === null) return

      if (Array.isArray(this.proposal.acf.optional_extras)){
          const findIndex = this.proposal.acf.optional_extras.findIndex(a => a.optional_extra.term_id === this.optionalData.selectedOptional.id);
        if (findIndex === -1 ){
             return
          } else{
            
            proposalOptionals[findIndex] = 
            { ...this.proposal.acf.optional_extras[findIndex],
              cost_per_activity:  this.optionalData.cost_per_activity
            }
          }
      }
      
      const updatedProposal = {
            ...this.proposal, 
              
               fields: {
                 optional_extras:proposalOptionals
               },
               acf: {
                 optional_extras: proposalOptionals
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
    optionals () {
      return this.$store.state.optionals;
    },
    globalActivities () {
      return this.$store.state.activities;
    },
    totalAmount (){
      return computeTotalProposal(this.currentProposal, this.$store.state.floor_activities)
    }
  }, 
  watch: {
     'optionalData.selectedOptional': function(newVal, oldVal) {
      let proposalOptionals = []
      if (Array.isArray(this.proposal.acf.optional_extras)){
          const findIndex = this.proposal.acf.optional_extras.findIndex(a => a.optional_extra.term_id === newVal.id);
        if (findIndex === -1 ){
            proposalOptionals = [...this.proposal.acf.optional_extras, 
            { cost_per_activity: 0,
              frequency: {},
              optional_extra: {...newVal, term_id: newVal.id}
            }
            ]
          } else{
            
            proposalOptionals[findIndex] = 
            { ...this.proposal.acf.optional_extras[findIndex],
              optional_extra: {...newVal, term_id: newVal.id}
            }
            this.optionalData.cost_per_activity = proposalOptionals[findIndex].cost_per_activity
          }
      }else{
        proposalOptionals = [
          { cost_per_activity: 0,
            optional_extra: {...newVal, term_id: newVal.id}
          }
        ]
      }

      const updatedProposal = {
            ...this.proposal, 
              
               fields: {
                 optional_extras:proposalOptionals
               },
               acf: {
                 optional_extras: proposalOptionals
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