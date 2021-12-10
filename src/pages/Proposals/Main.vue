<template>
  <div class="container">
    
    <div class="row my-3">
      
    <div class="col-6">
      <strong>Proposal</strong>
    </div>
    <div class="col-3">
      <strong>Date</strong>
    </div>
    <div class="col-3">
      <strong>Amount</strong>
    </div>
      
    </div>
  
    <div class="row py-1 proposal-texts" v-for="p in proposals" :key="p.id">      
      <div class="col-6 pr-1 pr-m-3">
        <div class="green-bg text-left cursor-pointer proposal-title" @click="setCurrentProposal(p)">
          {{ p.title.rendered}}
        </div>
      </div>
      <div class="col-3 pr-1 pr-m-3">
        <div class="green-bg text-center">
          {{ new Date(p.date).toLocaleDateString() }}
        </div>
      </div>
      <div class="col-3 ">
        <div class="green-bg text-center pr-1">
            $ {{ totalAmount(p)}}
        </div>
      </div>      
    </div>
  </div>
</template>

<script>

import request from '@/helpers/fetchWrapper'
import { PE_PROPOSALS } from '@/utils/const'

import { computeTotalProposal } from '@/utils/functions'

export default {
  name: 'MainProposals',

  data() {
    return {
      proposals: []
    };
  },

  mounted() {
    
    this.$store.dispatch('getTaxonomy', {taxonomy: 'rooms'});
    this.$store.dispatch('getTaxonomy', {taxonomy: 'levels'});
    this.$store.dispatch('getTaxonomy', {taxonomy: 'activities'});
    this.$store.dispatch('getTaxonomy', {taxonomy: 'periodicals'});
    this.$store.dispatch('getTaxonomy', {taxonomy: 'optionals'});
    this.$store.dispatch('getTaxonomy', {taxonomy: 'frequencies'});
    
    // fetch proposals

    this.$store.dispatch('getTaxonomy', {taxonomy: 'floor_activities'}).then(res=>{
      this.fetchProposals()
    })
  },

  methods: {
    fetchProposals(){
      request(PE_PROPOSALS, {
        method: 'GET'
      }).then((res) => {              
          this.proposals = res
      }).catch((err) => {
        console.log(err)
      })
    },
    setCurrentProposal(p){      
      this.$store.commit('updateCurrentProposal', p)
      this.$router.push({ name: 'ProposalHeader' })
    },
    totalAmount (proposal){
      return parseFloat(                                  )
    }
  },
  computed: {
    floorActivities() {
      return this.$store.state.floor_activities || []
    }
  }
};
</script>

<style lang="scss" >
  .py-1 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .green-bg {
    padding: 5px;
    background: #C0E7EE;
  }
  .text-center {
    text-align: center;
  }
  .proposal-title {
    text-overflow: ellipsis " [..]";
    max-height: 29px;
    overflow: hidden;
  }
    .proposal-texts {
      font-size: 14px;
    }
  @media screen and (max-width: 375px) and (min-width: 200px) {
    .container {
      width: 91vw !important;
    }  
    .proposal-texts {
      font-size: 14px;
    }
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>