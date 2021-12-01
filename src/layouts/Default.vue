<template>
  <div class="settings-wrapper">
    <Header />   
    <div class="body-wrapper">    
    <slot />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header/Header.vue'
import Footer from './Footer/Footer.vue'

export default {
  name: 'DefaultLayout',
  components: {
      Header,
      Footer,
  },
  data() {
    return {
      
    };
  },
  beforeMount(){
  },
  mounted() {
    
    if (!this.roles.includes('administrator')){
      this.$router.push(this.$route.query.redirect || '/proposals')
    }
  },

  methods: {
    
  },
  computed: {
    roles() { return this.$store.state.currentUser.roles },
    currentUser() { return this.$store.state.currentUser }
  }
};
</script>

<style lang="scss" scoped>
  .settings-wrapper {
    position: relative;
    min-height: 100vh;
    padding-bottom: 75px;
  }
  .body-wrapper{
    height: 100% - 5%;
    margin-bottom: 30px;
  }
</style>