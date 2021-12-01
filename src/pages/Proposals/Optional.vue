<template> 
  <div class="container mt-5-percent py-5">
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Proposal</label>
      <div class="col-sm-9 ">
        <input type="text" class="form-control-plaintext pe-input " 
          :value="currentProposal.title.rendered"
          disabled
         >
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Optional Extras:</label>
      <div class="col-sm-9 ">
        <custom-dropdown
          :options="globalOptionals"
          :default="'Select optional'"
          class="select"
        ></custom-dropdown>
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-3 col-form-label text-left">Cost Per Activity</label>
      <div class="col-sm-9 ">
        <input type="text" class="form-control-plaintext pe-input my-1" value="">      
      </div>
    </div>
    <div class="form-group row">
      <label for="staticEmail" class="col-sm-12 col-form-label text-left">   
        <small>*Note: Optional Extras costs do not add into calculations.</small>
      </label> 
    </div>
        <div class="form-group row">
       <label for="staticEmail" class="col-sm-3 col-form-label text-left">Total Amount</label>
        <div class="col-sm-9 total">
           <strong>$ 125.55</strong>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanetFeOptional',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    
  },
  computed: {
    currentProposal () {
      return this.$store.state.currentProposal;
    },
    currentLevel () {
      return this.$store.state.currentProposalLevel || {name: "None selected"};
    },
    globalOptionals () {
      return this.$store.state.optionals;
    },
    globalActivities () {
      return this.$store.state.activities;
    },
  }, 
};
</script>

<style lang="scss" scoped>

</style>