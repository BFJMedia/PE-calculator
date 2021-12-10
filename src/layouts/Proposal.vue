<template>
  <div class="proposal-wrapper">
    <Header />
    <div class="body-wrapper">    
      <slot />
    </div>    
    <Footer />
  </div>
</template>

<script>
import Header from './ProposalHeader/ProposalHeader.vue'
import Footer from './ProposalFooter/ProposalFooter.vue'

export default {
  name: 'ProposalLayout',
  components: {
      Header,
      Footer,
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
  .form-group.row:last-child {
      position: absolute;
      left: 0px;
      padding: 0 1em;
      bottom: 70px;
  }
  .proposal-wrapper {
    position: relative;
    min-height: 100vh;
    padding-bottom: 75px;

  }
</style>