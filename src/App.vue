<template>
  <div id="app">
     <component :is="this.$route.meta.layout || 'div'">
      <vue-confirm-dialog></vue-confirm-dialog>
      <router-view></router-view>
    </component>
  </div>
</template>

<script>
import { setGlobalSettings } from '@/utils/functions'
export default {
  name: 'App',
  components: {
    
  },
  created(){
    if (localStorage.getItem('user')){
      this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')))
    }
  },
  mounted() {

    //this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')))
    
  //  if (localStorage.getItem('user')){
      this.$store.dispatch({ type: 'getSettings'}).then(res => {
        setGlobalSettings(res)
      })
 //   }
  }
}
</script>

<style >
@import '/sass/styles.scss';
#app {
  font-family: 'Nunito Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #454b50;
}
div input, div .pe-input {
    font-family: 'Nunito Sans', sans-serif;
}

  .toasted-container.top-right {
    top: 5% !important;
    right: 0 !important;
    display: flex;    
  }
    .action {
      width: 10%;
    }
</style>
