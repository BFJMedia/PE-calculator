<template>
  <div>
  <div id="home">
    <h1>Welcome Home</h1>
  </div>
  
  </div>
</template>

<script>

  import request from '@/helpers/fetchWrapper'
  import { mapMutations } from 'vuex'

  
  export default {
    name: 'Home',
    components: {
  
    },

    data() {
      return {
        
      };
    },

    mounted() {
      this.fetchPost()
      //this.$store.commit('increment')
    },

    methods: {
      fetchPost(){      
          request('/wp/v2/posts', {
            method: 'GET'
          }).then((res) => {
            this.add(res)
            
          }).catch((err) => {
            console.log(err)
          })
      },
      addCount(){
        this.$store.commit('increment')
      },
      ...mapMutations({
        add: 'updatePosts' 
      })
    },
    computed: {
      score() { return this.$store.state.count }
    }
  };
</script>

<style lang="scss" scoped>

</style>