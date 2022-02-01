<template>
<div class="container">
  <div class="title">
    <h2>Settings</h2>
  </div>
  <div class="content">
    <div id="settings-periodicals">
      <form id="periodicals-page">
          <div class="row text-l">
            <div class="col-3 text-l">
              <label class="text-l">Periodicals:</label>
            </div>
            <div class="col-9">
              <custom-dropdown
                :options="periodicals"
                :default="'Edit periodicals'"
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
import CustomDropdown from '../../components/common/CustomDropdown.vue'
import { mapState } from 'vuex'

export default {
  name: 'SettingsPeriodicals',
  components: {
    CustomDropdown
  },

  props: {
    msg: String,
  },
  mounted() {
    this.fetchPeriodicals()
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
      periodicals:[],
      selected: null,
      roomData: {
        name:'',
        description:''
      },

    };
  },
  methods: {
    fetchPeriodicals: function(){
        request(`${GET_TAXONOMY}periodicals?`, {
          method: 'GET'
        }).then((res) => {              
            this.periodicals = res
        }).catch((err) => {
          console.log(err)
        })
    },
    saveData: function() {
      const url = this.action==='add' ?  `${UPDATE_TAXONOMY}periodicals`  : `${UPDATE_TAXONOMY}periodicals/${this.id}`
      

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
        this.fetchPeriodicals();
        this.$store.dispatch('getTaxonomy', {taxonomy: 'periodicals'});
      }).catch((err) => {
        console.log(err)
      })
    },
    confirmDeleteRoom: function(e) {

      const currentRoomId = e;
      const findRoom = this.periodicals.find(a => a.id === e);
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

      const findRoom = this.periodicals.find(a => a.name === this.roomData.name)
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
      request( `${UPDATE_TAXONOMY}periodicals/${id}`, {
          method: 'DELETE'
        }).then((res) => {              
            console.log(res)
            this.fetchPeriodicals()
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
  // settings-periodicals
  
  
</style>