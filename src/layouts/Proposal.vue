<template>
  <div class="proposal-wrapper">
    <Header />
    <div class="body-wrapper">    
      <slot />
    </div>    
    <loading/>
    <Footer />
  </div>
</template>

<script>
import Header from './ProposalHeader/ProposalHeader.vue'
import Footer from './ProposalFooter/ProposalFooter.vue'
import Loading from '../components/common/Loading.vue'

export default {
  name: 'ProposalLayout',
  components: {
      Header,
      Footer,
      Loading
  },
  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
  .body-wrapper{
    height: 100% - 5%;
    }
  .proposal-wrapper {
    position: relative;
    min-height: 100vh;
    padding-bottom: 75px;

  }
</style>