<template>
  <div class="row mb-3 floor-activity">
        <div class="col-12 mb-2">
          <custom-dropdown
            :options="floor_activities"
            :default="activity.activity.name || 'None'"
            class="select"            
            @onAdd="addFloorAct($event)"          
            @onEdit="editFloorAct($event)"
          ></custom-dropdown>
        </div>
        <div class="col-3">
           <input type="text" class="form-control-plaintext pe-input "             
            v-model="formData.area"
            @change="updateActivity"
            />
        </div>
        <div class="col-9">
          <div class="column-seven">
            <div class="flex-row" v-for="(str, i) in days_options" :key="i">
              <label class="days-checkbox" > 
                <input type="checkbox" class="checkbox default-checkbox" :value="str[0]" v-model="formData.frequency"
                @change="updateActivity" >
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="delete-floor">
          <button type="button">x</button>
        </div>
  </div>
</template>

<script>
import request from '@/helpers/fetchWrapper'
import { DAY_OPTIONS, UPDATE_TAXONOMY } 
        from '@/utils/const'

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Flooractivity',
  props: ['activity', 'floor_activities', 'index'],

  data() {
    return {
      days_options: DAY_OPTIONS,
      formData: {
        frequency: []
      },
      floorActivity: {
        name:'',
        description:''
      },
      action: 'add',
      floorActivityId: 0
    };
  },

  mounted() {
    this.formData = { ...this.activity }
  },

  methods: {
    addFloorAct: function(e){
      this.action = 'add';
      this.floorActivity.name = e;
      const findActivity = this.floorActivities.find(a => a.name === this.floorActivity.name)
      if (this.floorActivity.name !== '' && findActivity === undefined){
        this.saveData()
      }
    },
    editFloorAct: function(e) {
      
      const name = e.value || this.selected.name;

      this.action = 'edit';
      this.floorActivity.name = name;
      this.floorActivityId = e.id;

    },
    saveData: function() {
      const url = this.action==='add' ?  `${UPDATE_TAXONOMY}floor_activities`  : `${UPDATE_TAXONOMY}floor_activities/${this.floorActivityId}`

      let formData = {...this.floorActivity};

      request(`${url}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        console.log(res);
        this.$store.dispatch('getTaxonomy', {taxonomy: 'floor_activities'});
      }).catch((err) => {
        console.log(err)
      })
    },
    updateActivity: function(e){
      const data = {...this.formData, index: this.index}
      this.$emit("onChangeActivity", data);
    }
  },
  computed: {
    ...mapState([
      'floorActivities',

    ]),
  }
};
</script>

<style lang="scss">
.floor-activity{
  position: relative;
  .column-seven {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
  }
  .column-seven > * {
     flex: 1 1 8%;
     margin-top:-10px;

  }

  .delete-floor {
    position: absolute;
    top: -15px;
    right: 0;
    width: 20px;
    button {
      width: 20px;
      height: 20px;
      border-radius: 25px;
      text-align: center;
      background: #000;
      color: #fff;
      border:none;
    }
  }

}
</style>