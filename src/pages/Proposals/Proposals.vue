<template>
  <div>
    <Header />
      <router-view></router-view>    
    <Footer />
  </div>
</template>

<script>

/* import Header from '../../components/layouts/Header/Header.vue'
import Footer from '../../components/layouts/Footer/ProposalFooter.vue' */

import request from '@/helpers/fetchWrapper'
import { PROPOSAL_PDF } from '@/utils/const'
export default {
  name: 'Proposals',
  components: {
/*     Header,
    Footer, */
  },
  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    showPdfSent(){
      this.$toasted.show('Proposal successfull sent', {type:'success', duration:2000})
    }
  },
  computed: {
    showNotification(){
      
      return this.$store.state.showNotification
    },

    proposal_id () {
      return this.$store.state.currentProposal.id || 0
    },
  }, 
  watch: {
    showNotification: {
      immediate: true,
      handler:  function(){
        const vm = this;
        if(this.showNotification){
          this.$toasted.show('Proposal has been updated', {
            position: 'top-right',
            fitToScreen: true,
            type:'success',
            action: [
               {
              text:'Send PDF',
              onClick:async (e, toast) => {
                  await  request(`${PROPOSAL_PDF}/${vm.proposal_id}`, {
                  method: 'GET',        
                  headers: {
                    "Content-Type": "application/json",
                  },
                  }).then((res) => {              
                      console.log(res)
                      vm.showPdfSent()                     
                      toast.goAway(0);
                  }).catch((err) => {
                    console.log(err)
                  }) 
              }
            },
              {
                text : 'Close',
                onClick : (e, toastObject) => {
                    vm.$store.commit ('updateGlobalState', {prop: 'showNotification',value:false}) 
                  toastObject.goAway(0);
                }
              },
             ]
          });
        }else{
          this.$toasted.clear()
          vm.$store.commit ('updateGlobalState', {prop: 'showNotification',value:false}) 
        }
      }
    }
  }
};
</script>

<style lang="scss" >
  .container {
    width: 80vw;
    @media only screen and (max-width: 600px) {
       width: 90vw;
    }
  }



</style>