<template>
  <div class="container mt-1 py-3">
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Proposal</label>
      <div class="col-sm-9">
        <input type="text" class="form-control-plaintext pe-input " 
          v-model="headerForm.title"
          @change="updateProposalHeading" >
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Address</label>
      <div class="col-sm-9">
        <input type="text" class="form-control-plaintext pe-input mb-2" 
          v-model="headerForm.fields.address_1"
          @change="updateProposalHeading" >
       
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Contact</label>
      <div class="col-sm-9">
        <input type="text" class="form-control-plaintext pe-input mb-" 
          v-model="headerForm.fields.contact_person"
          @change="updateProposalHeading"
          >
      </div>
    </div>
    
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Email</label>
      <div class="col-sm-9">
        <input type="text"  class="form-control-plaintext pe-input " 
          v-model="headerForm.fields.email"
          @change="updateProposalHeading"
        >
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Date</label>
      <div class="col-sm-9">
        <input type="date"  class="form-control-plaintext pe-input mb-1"
          v-model="headerForm.fields.date_formatted"
          @change="updateProposalHeading"
         >
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Days Cleaned</label>
      <div class="col-sm-9">
        <div class="days-label flex-100 flex-row">
          <label v-for="(str, i) in days_options" :key="i"><div class="default-days" >{{ str[1] }}</div></label>  
        </div>
        <div class="days-chkbx flex-100 flex-row h-space"> 
          <div class="flex-row" v-for="(str, i) in days_options" :key="i">
            <label class="days-checkbox" > 
              <input type="checkbox" class="checkbox default-checkbox" :value="str[0]" 
                v-model="headerForm.fields.days_clean"
                @change="updateProposalHeading"
              >
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Rate</label>
      <div class="col-sm-9">
        <input type="text"  class="form-control-plaintext pe-input mb-1 currency" 
         v-model="headerForm.fields.rate"
         @change="updateProposalHeading"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Saturday Rate</label>
      <div class="col-sm-9">
        <input type="text" class="form-control-plaintext pe-input mb-1 currency"
          v-model="headerForm.fields.saturday_rate"
         @change="updateProposalHeading"
         >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Sunday Rate</label>
      <div class="col-sm-9">
        <input type="text"  class="form-control-plaintext pe-input mb-1 currency" 
          v-model="headerForm.fields.sunday_rate"
          @change="updateProposalHeading"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Day Cleaner Rate</label>
      <div class="col-sm-9">
        <input type="text"  class="form-control-plaintext pe-input mb-1 currency" 
           v-model="headerForm.fields.day_cleaner_rate"
          @change="updateProposalHeading"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label">Day Hours</label>
      <div class="col-sm-9">
        <input type="text"  class="form-control-plaintext pe-input mb-1 currency" 
         v-model="headerForm.fields.hours"
          @change="updateProposalHeading"
        >
      </div>
    </div>
  
    <div class="bottom-80">
    <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label">Total Amount</label>
        <div class="col-sm-9 total">
           <strong> $ {{totalAmount }}</strong>
        </div>
    </div>
    </div>
    
    <div class="form-group row">
         <label for="staticEmail" class="col-sm-3 col-form-label"></label>
          <div class="col-sm-9">
           <button @click="sendProposal"> Send</button>
        </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import request from '@/helpers/fetchWrapper'
import { PROPOSAL_PDF, PE_PROPOSALS, DAY_OPTIONS  } from '@/utils/const'

import { computeTotalProposal } from '@/utils/functions'
export default {
  name: 'PlanetFeHeader',

  data() {
    return {
      days_options: DAY_OPTIONS,
      days:[],
      headerForm: {
        title: {
          rendered: ''
        },
        fields: {
          address_1: '',
          address_2: '',
          contact_person: '',
          email: '',
          date_started: '',
          days_clean: [],
          rate: 0,
          saturday_rate: 0,
          sunday_rate: 0,
        },
      }
    };
  },

  mounted() {
    //this.headerForm = {...this.currentProposal}
    if (this.currentProposal == null){      
      this.$router.push({ name: 'ProposalHeader' })
    }
    this.headerForm.fields = {...this.currentProposal.acf}
    this.headerForm.title = this.currentProposal.title.rendered
    this.headerForm.days_clean = Array.isArray(this.currentProposal.acf.days_clean) ? this.currentProposal.acf.days_clean : []
    let dateParts = dayjs(this.currentProposal.acf.date_started)
    this.headerForm.fields.date_formatted = dateParts.format("YYYY-MM-DD")
    
  },

  methods: {
    updateProposalHeading: async function(){
      
      let formData = {...this.headerForm};
      formData.title = this.headerForm.title

      if (dayjs(formData.fields.date_formatted).isValid()){
        formData.fields.date_started = dayjs(formData.fields.date_formatted, "m/d/y")
      }

      //this.$store.commit("updateCurrentProposal", formData )

      if (this.currentProposal === null){
        // post a new proposal
        console.log(this)
      }

      if (this.proposal_id){

        const updatedProposal = {
            ...this.currentProposal, 
                formData,
                fields: formData.fields,
                acf:formData.fields
          }
        
        await  request(`${PE_PROPOSALS}/${this.proposal_id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        }).then((res) => {
            res.refresh = false
            this.$store.commit('updateCurrentProposal', res)
        }).catch((err) => {
          console.log(err)
        }) 

      this.$store.commit('updateGlobalState',{
        prop: 'currentProposal',
        value: updatedProposal
      })
      //this.$store.dispatch('saveProposal')

      }

    },
    sendProposal: async function(){
       await  request(`${PROPOSAL_PDF}/${this.proposal_id}`, {
        method: 'GET',        
        headers: {
          "Content-Type": "application/json",
        },
        }).then((res) => {              
            console.log(res)
        }).catch((err) => {
          console.log(err)
        }) 

    }
  },
  computed: {
    currentProposal () {
      return this.$store.state.currentProposal
    },
    currentSetting () {
      return this.$store.state.settings.acf
    },
    proposal_id () {
      return this.currentProposal.id
    },
    totalAmount (){
      return computeTotalProposal(this.currentProposal, this.$store.state.floor_activities)
    }
  }
};
</script>

<style lang="scss">
  
  .form-group {
    margin-bottom: 20px;
    @media screen  and (max-width: 411px) and (min-width: 200px) {
      margin-bottom: 10px !important;
    }
  }

  // .form-group.row:last-child {
  //     position: absolute;
  //     bottom: 63px;
  //     left: 0;
  //     padding: 0 1em;
  // }
  .currency {
    text-align: right !important;
    padding-right: 10px!important;
  }
  .total {
    width: 100%;
    font-size: 18px;
    font-style: normal;    
    text-align: right !important;
    border: 3px solid #C1D72E;
    background: #C1D72E;
    color: #232323;    
    padding: 5px;
  }
  .bottom-80 {
    position: absolute;
    bottom: 63px;
    left: 0;
    padding: 0 1em;
  }
  
</style>