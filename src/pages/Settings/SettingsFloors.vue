<template>
<div class="container">
  <div class="title">
    <h2>Settings</h2>
  </div>
  <div class="content">
    <div id="settings-floors">
      <form id="floors-page" class="">
          <div class="row mb-3">
            <div class="col-3 text-l">
              <label class="text-l">Floors:</label>
            </div>
            <div class="col-9">
              <custom-dropdown
                :options="floors"
                :default="'Select floor'"
                class="select"
                v-model="currentFloor"
                @onAdd="addFloor($event)"
                @onDelete="confirmDeleteFloor($event)"
                @onEdit="editFloor($event)"
              ></custom-dropdown>
            </div>
          </div>
          <div class="row text-l">
            <div class="col-3 col-md-3">
              <label for="settings-calc" class="text-l">Calculation:</label>
            </div>
            <div class="col-8 col-md-9">
                <input type="text" 
                  required="required" 
                  autofocus="autofocus" 
                  class="settings-calc"
                  v-model="calculation"
                  v-on:change="editFloor"
                >
            </div>
         </div>

        <div class="grid-vertical mlr-auto box" v-if="showAddForm">
          <div class="grid-col">
            <div class="grid-title flex-row flex-100"> <h2>Add Floor</h2> </div>
            <div class="grid-form flex-row flex-95 col-md-12 pd-l-r-10">
              <div class="col-md-12 flex-row">
                <div class="col-md-2">Name: </div>
                <div class="col-md-10"><input type="text"  v-model="floorData.name"/> </div>
              </div>
              <div class="col-md-12 flex-row">
                <div class="col-md-2">Calculation: </div>
                <div class="col-md-10"><input type="text"  v-model="floorData.name"/> </div>
              </div>
              <div class="col-100 hidden">
                <div class="title flex-row flex-right"> Name: </div>
                <div class="form flex-row"> 
                  <input type="text"  v-model="floorData.name"/> 
                </div>
                <div class="title-2 flex-row flex-right"> Calculation: </div>
                <div class="form-2 flex-row"> 
                  <input type="text"  v-model="floorData.calculation"/> 
                </div>
                <div class=""> </div>
                <div class="form-3 flex-row"> 
                  <button type="button" class="btn-white btn-cancel flex-100 pd-t-b-5 v-space" @click="showAddForm = false">Cancel</button>
                  <button 
                    type="button" 
                    class="btn-white btn-save flex-100 pd-t-b-5"
                    @click="saveData"
                    >Save</button>  
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </form>
    </div>
  </div>
</div>
  
</template>

<script>
import request from '@/helpers/fetchWrapper'
import { GET_TAXONOMY, UPDATE_TAXONOMY } from '@/utils/const'
import CustomDropdown from '../../components/common/CustomDropdown.vue';

export default {
  name: 'SettingsFloors',
  components: {
    CustomDropdown
  },

  data() {
    return {
      url:'floors',
      floors: [],
      floorData:{
        name:'',
        calculation:''
      },
      action: 'add',
      current_id: 0,
      showAddForm: false,
      currentFloor: {
        name:'',
        acf:{calculation:''}
      },
      calculation:'',
    }
  },
  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData: function(){
        request(`${GET_TAXONOMY}floors?per_page=99`, {
          method: 'GET'
        }).then((res) => {         
           this.floors = res 
        }).catch((err) => {
          console.log(err)
        })
    },
    toggleForm: function(action){
      this.action = action;
      this.showAddForm = !this.showAddForm
    },
    saveData: function() {
      const url = this.action==='add' ?  `${UPDATE_TAXONOMY}floors`  : `${UPDATE_TAXONOMY}floors/${this.currentFloor.id}` 

      let formData = {...this.floorData};

      request(`${url}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'      
        },
      }).then((res) => {
          console.log(res)
          this.floorData.name = ''
          this.floorData.calculation = ''
          this.showAddForm = false
          this.fetchData()
      }).catch((err) => {
        console.log(err)
      })
    },
    addFloor: function(e){
      this.action = 'add';
      
      try {
        this.floorData.name = this.$refs.floor_select.$data.searchText;
      } catch (error) {
        this.floorData.name = e;
      }

      this.floorData.calculation = '';
      //if(this.floors.length ===0) return

      const findRoom = this.floors.find(a => a.name === this.floorData.name)
      if (this.floorData.name !== '' && findRoom === undefined){
        this.saveData()
      }
      
    },
    editFloor: function(e = null){
      const name = e.value || this.currentFloor.name;
      const calc = e.calculation || this.calculation;

      this.action = 'edit';
      this.floorData.name = name;
      this.floorData.calculation = calc;
      this.currentFloor.id = e.id || this.currentFloor.id;

      if (this.floorData.calculation !== '' && this.floorData.calculation !== undefined) {
        this.saveData();
      }
    },
    deleteFloor: function(id){
      if (typeof this.currentFloor !== 'object' ) return ''
      
      request( `${UPDATE_TAXONOMY}${this.url}/${id}`, {
          method: 'DELETE'
        }).then((res) => {              
            console.log(res)
            this.fetchData()
        }).catch((err) => {
          console.log(err)
        })
    },
    confirmDeleteFloor: function(e) {

      const currentFloorId = e;
      const findFloor = this.floors.find(a => a.id === e);
      const currFloorName = findFloor.name;

      // if (this.currentFloor.id === null) return;

       this.$confirm(
        {
          message: `Are you sure you want to delete ${currFloorName}?`,
          button: {
            no: 'No',
            yes: 'Yes'
          },
          /**
          * Callback Function
          * @param {Boolean} confirm 
          */
          callback: confirm => {
            if (confirm) {
              this.deleteFloor(currentFloorId)
            }
          }
        }
      )
    },

  },
  computed:{
    selectedFloor(){
      if (this.floors.length===0) return ''
      if (this.currentFloor.id==='Select') return ''
      
      const item = this.floors.find(a=>a.id === this.currentFloor.id)
      if (item) return item.acf.calculation

      return ''
    }
  },
  watch: {
    currentFloor: function(val){

      if (this.floors.length===0 || typeof this.currentFloor !== 'object') return ''
      
      const item = this.floors.find(a=>a.id === val.id)
      if (item) {
        this.calculation = item.acf.calculation || this.selectedFloor
      }
    }
  }
};
</script>

<style lang="scss">
 
  
</style>