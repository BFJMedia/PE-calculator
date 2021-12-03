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
    
  },
};
</script>

<style lang="scss" scoped>
  .container {
    width: 80vw;
    @media only screen and (max-width: 600px) {
       width: 90vw;
    }
  }

</style>