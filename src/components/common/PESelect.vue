<template>
  <div>
    <div v-for="(el, index ) in options" :key="`${el}-${index}`">
      {{ el }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Peselect',
  props:['options'],

  data() {
    return {
      selected: null
    };
  },

  mounted() {
    
  },

  methods: {
    onSelectOption(e){
      console.log(e)
    }
  },
};
</script>

<style lang="scss" scoped>

</style>