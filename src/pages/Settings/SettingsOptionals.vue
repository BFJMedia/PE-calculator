<template>
<div class="container">
  <div class="title">
    <h2>Settings</h2>
  </div>
  <div class="content">
    <div id="settings-optionals">
      <form id="optionals-page">
        <div class="row">
          
            <div class="col-3 text-l">
              <label class="text-l">Optionals:</label>
            </div>
            <div class="col-9">
              <custom-dropdown
                :options="optionals"
                :default="'Edit optionals'"
                class="select"
                v-model="selected"
                @onAdd="addRoom($event)"
                @onDelete="confirmDeleteRoom($event)"
                @onEdit="editRoom($event)"
              />
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
import { mapState } from 'vuex'

export default {
  name: 'SettingsOptionals',
  components: {
    CustomDropdown
  },

  props: {
    msg: String,
  },
  mounted() {
    this.fetchOptionals()
    
  },
  data() {
    return {
      showAddRoom: false,
      weeks: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4"
      ],
      check_weeks: [],
      action: 'add',
      optionals:[],
      selected: null,
      roomData: {
        name:'',
        description:''
      },

    };
  },
  methods: {
    fetchOptionals: function(){
        request(`${GET_TAXONOMY}optionals?`, {
          method: 'GET'
        }).then((res) => {              
            this.optionals = res
        }).catch((err) => {
          console.log(err)
        })
    },
    saveData: function() {
      const url = this.action==='add' ?  `${UPDATE_TAXONOMY}optionals`  : `${UPDATE_TAXONOMY}optionals/${this.id}`
      console.log(this.id);

      let formData = {...this.roomData};

      request(`${url}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        console.log(res);
        this.roomData.name = ''
        this.showAddRoom = false
        this.fetchOptionals();
      }).catch((err) => {
        console.log(err)
      })
    },
    confirmDeleteRoom: function(e) {

      const currentRoomId = e;
      const findRoom = this.optionals.find(a => a.id === e);
      const currRoomName = findRoom.name;

      // if (this.selected === null) return

       this.$confirm(
        {
          message: `Are you sure you want to delete ${currRoomName}?`,
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
              this.deleteRoom(currentRoomId);
            }
          }
        }
      )
    },

    toggleForm: function(action){
      this.action = action;
      this.showAddRoom = !this.showAddRoom
      console.log(this.$refs.room_select.$data.searchText)
    },
    addRoom: function(e){
      this.action = 'add';

      // this.roomData.name = this.$refs.room_select.$data.searchText;
      this.roomData.name = e;

      const findRoom = this.optionals.find(a => a.name === this.roomData.name)
      if (this.roomData.name !== '' && findRoom === undefined){
        this.saveData()
      }
      
    },
    editRoom: function(e = null){
      const name = e.value || this.selected.name;

      this.action = 'edit';
      this.roomData.name = name;
      this.id = e.id;

      this.saveData();
    },
    deleteRoom: function(id){
      // if (this.selected === null) return
      request( `${UPDATE_TAXONOMY}optionals/${id}`, {
          method: 'DELETE'
        }).then((res) => {              
            console.log(res)
            this.fetchOptionals()
        }).catch((err) => {
          console.log(err)
        })
    }

  },
  computed: {
    
  }

};
</script>

<style lang="scss" >
  // settings-optionals
  
  
</style>