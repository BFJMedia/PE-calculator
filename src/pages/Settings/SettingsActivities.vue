<template>
  <div class="container">
    <div class="title">
      <h2>Settings</h2>
    </div>
    <div class="content activities">
      <div id="settings-floors">
        <form id="floors-page">
          <div class="row">
            <div class="col-3 ">
              <label class="pd-l-10">Room</label>
            </div>
            <div class="col-9">
              <select
                name="floor-select"
                class="floors-select block"
                v-model="selectedRoomId"
                >
                <option disabled selected >Select room </option>
                <option v-for="(room, i) of rooms" :key="i+'-select-room'" :value="room.id">
                  {{ room.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="row h-space">
            <div class="col-3 h-space">
              <label class="pd-l-10">Activities</label>
            </div>
            <div class="col-9 h-space">
              <custom-dropdown
                :options="activitiesDropdown"
                :default="'Select an activity'"
                class="select"
                v-model="selectedActivity"
                keyName="name"
                keyValue="id"
                @onAdd="addActivity($event)"
                @onSelect="clearFields()"
              />
                <!-- @onDelete="confirmDeleteRoom($event)"
                @onEdit="editRoom($event)" -->
            </div>
          </div>

          <div class="row h-space">
            <div class="col-3 col-md-3 h-space">
              <label class="pd-l-10">Pre-selected</label>
            </div>
            <div class="col-9 h-space">
              <input
                type="checkbox"
                id="switch"
                class="act-pre-selected pre-switch"
                v-model="subForm.pre_selected"
                name="pre_selected"
                @change="activityFieldUpdate"
              />
              <label for="switch" class="switch-label" />
            </div>
            </div>

          <div class="row h-space">
            <div class="col-3 h-space">
              <label class="pd-l-10">Time Taken</label>
            </div>
            <div class="col-9 h-space">
              <div class="flex-100 flex-row time-taken">
                <!-- limit inputs to numbers only and hr: 99, min & sec: 59 -->
                <input
                  type="text"
                  required="required"
                  autofocus="autofocus"
                  placeholder="hrs"
                  v-model="subForm.time[0]"
                  class="act-ttpt act-hrs mr-3"
                  maxlength="2"
                  name="time"
                  @change="activityFieldUpdate"
                />
                <input
                  type="text"
                  required="required"
                  autofocus="autofocus"
                  placeholder="min"
                  v-model="subForm.time[1]"
                  class="act-ttpt act-min mr-3"
                  maxlength="2"
                  name="time"
                  @change="activityFieldUpdate"
                />
                <input
                  type="text"
                  required="required"
                  autofocus="autofocus"
                  placeholder="sec"
                  v-model="subForm.time[2]"
                  class="act-ttpt act-secs"
                  maxlength="2"
                  name="time"
                  @change="activityFieldUpdate"
                />
              </div>
            </div>
          </div>
          <div class="row h-space">
            <div class="col-12 h-space">
              <div class="days-grid">
                <div class="grid-days">
                  <div class="days-title flex-100 flex-row">
                    <label for="frequency" class="pd-l-10 text-l"
                      >Frequency</label
                    >
                  </div>
                  <div class="days-label flex-100 flex-row">
                    <label v-for="(day, i) in days_options" :key="i">
                      <div class="frequency">{{ day[1] }}</div>
                    </label>
                  </div>
                  <div class="days-chkbx flex-100 flex-row h-space">
                    <div
                      class="flex-row"
                      v-for="(day, i) in days_options"
                      :key="i+'freq-day-chk'"
                    >
                      <label class="days-checkbox">
                        <input
                          type="checkbox"
                          class="checkbox default-checkbox"
                          v-model="subForm.frequency"
                          :value="day[0]"
                          @change="daysUpdate"
                          :true-value="day[0]"
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row h-space">
            <div class="col-3 h-space">
              <label for="frequency" class="weeks-label pd-l-10 text-l"
                >Weeks</label
              >
            </div>
            <div class="col-8 row h-space">
              <div>
                <label
                  v-for="(week, i) in weeks_options"
                  :key="i"
                  class="flex-row"
                >
                  <div class="col-4 pd-t-20">{{ week[1] }}</div>
                  <div class="col-8 h-space">
                    <label class="days-checkbox">
                      <input
                        type="checkbox"
                        class="checkbox week1-checkbox"
                        v-model="subForm.weeks"
                        :value="week[0]"
                        @change="weeksUpdate()"
                        :true-value="week[0]"
                      />
                      <span class="checkmark" />
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/helpers/fetchWrapper";
import { GET_TAXONOMY, UPDATE_TAXONOMY } from "@/utils/const";
import { SETTINGS_URL, UPDATE_SETTINGS_URL } from "@/utils/const";
import CustomDropdown from "../../components/common/CustomDropdown.vue";

export default {
  name: "SettingsActivities",
  components: {
    CustomDropdown,
  },
  mounted() {
    this.fetchRooms();
    //this.fetchSettings();
    this.fetchActivities();
  },
  data() {
    return {
      days_options: [
        [1, "M"],
        [2, "T"],
        [3, "W"],
        [4, "T"],
        [5, "F"],
        [6, "S"],
        [7, "S"],
      ],
      weeks_options: [
        [1, "Week 1"],
        [2, "Week 2"],
        [3, "Week 3"],
        [4, "Week 4"],
      ],
      settingsId: null,
      rooms: [],
      activitiesDropdown: [],
      activities: [],
      selectedActivity: "",
      subForm: {
        pre_selected: false,
        time: ["", "", ""],
        frequency: [],
        weeks: [],
      },
      selectedRoomId: null,
      selectedRoom: null,
      action: "",
      activeRoom:"",
      settingsRooms:[]
    };
  },
  methods: {
    fetchSettings: function () {
      request(SETTINGS_URL, {
        method: "GET",
      })
        .then((res) => {
          this.settingsId = res.ID;
          this.activities = res.acf.rooms[0].activities;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchRooms: function () {
      request(`${GET_TAXONOMY}rooms`, {
        method: "GET",
      })
        .then((res) => {
          this.rooms = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchActivities: function () {
      request(`${GET_TAXONOMY}activities?per_page=99`, {
        method: "GET",
      })
        .then((res) => {
          console.log(res);
          this.activitiesDropdown = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveData: function (activityData) {
      const url =
        this.action === "add"
          ? `${UPDATE_TAXONOMY}activities`
          : `${UPDATE_TAXONOMY}activities/${this.settings.ID}`; 
          // find id first

      let formData = activityData;

      request(`${url}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res);
          this.fetchActivities();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addActivity: function (e) {
      this.action = "add";
      const activityData = {
        name: e,
        description: "",
      };

      if (activityData.name !== "") this.saveData(activityData);
    },
    updateActivity: function () {
      if (!this.selectedActivity) return;

      const formData = {
        fields: {
          rooms: this.settingsRooms,
        },
      };

      request(`${UPDATE_SETTINGS_URL}${this.settings.ID}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res);
          this.fetchSettings();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    includeTime: function (e) {
      let value = e.target.value || "00";
      let index = parseInt(e.target.name);

      this.time[index] = value.length === 1 ? `0${value}` : value;
      this.updateActivity();
    },
    activityFieldUpdate: function(e){
      const fieldName = e.currentTarget.name
      let updatedActivity = {}
      if ( fieldName !== 'time'){        
        updatedActivity = {...this.currentActivityInRoom, [fieldName]: this.subForm[fieldName] }
      }else{
        updatedActivity = {...this.currentActivityInRoom, 
          ["time_to_perform_task"]: this.subForm[fieldName] ? this.subForm[fieldName].join(":") : ["00","00", "00"].join(":"),
          
           }
      }

      if (this.currentActivityInRoom ){        
        this.selectedRoom.activities[this.currentActivityIndexInRoom] = updatedActivity
        this.updateActivity();
      }

    },
    daysUpdate: function(){
      // get the activity from the room activities
      if (this.currentActivityInRoom){
        
        let updatedActivity = {...this.currentActivityInRoom, frequency: this.subForm.frequency }
        this.selectedRoom.activities[this.currentActivityIndexInRoom] = updatedActivity
        this.updateActivity();
      }
    },
    weeksUpdate: function(){
      // get the activity from the room activities
      if (this.currentActivityInRoom){        
        let updatedActivity = {...this.currentActivityInRoom, weeks: this.subForm.weeks }
        this.selectedRoom.activities[this.currentActivityIndexInRoom] = updatedActivity
        this.updateActivity();
      }
    },
    clearFields: function () {
    
    },
    setupSettings: function(){
      this.settingsRooms = this.$store.state.settings.acf.rooms
    }
  },
  computed: {
    currentActivityInRoom: function(){
      if (this.selectedRoom === null) return
      let currentActivity = this.selectedRoom.activities.find(a=> a.activity.term_id === this.selectedActivity.id ||  a.activity.id === this.selectedActivity.id)
     
      if (currentActivity){
        return currentActivity
      }

      return null      
    },
    currentActivityIndexInRoom: function(){
       let currentActivity = this.selectedRoom.activities.find(a=> a.activity.term_id === this.selectedActivity.id ||  a.activity.id === this.selectedActivity.id)
      let index = this.selectedRoom.activities.indexOf(currentActivity);
      return index || 0
    },
    currentRoomIndex: function(){
      let index = this.settingsRooms.findIndex(a=> a.room.term_id === this.selectedRoom.room.id || a.room.id === this.selectedRoom.room.id)
      
      return index || 0
    },
    settings: function(){
      return this.$store.state.settings
    }
  },
  watch: {
    selectedRoomId: function(newRoom, oldRoom){

      if (newRoom === oldRoom) return;

      this.selectedActivity = ""
      // find if the room is in rooms settings or not
      const room = this.settingsRooms.find(a=> a.room.id === newRoom || a.room.term_id === newRoom)

      // room not yet
      if (room === undefined){
        let selRoom = this.rooms.find(a => a.term_id === newRoom || a.id === newRoom)
        this.selectedRoom =  {room: selRoom, activities: [] }
        this.settingsRooms = [...this.settingsRooms, {room: selRoom, activities: [] }]
        this.activities = [];
      }else{
        this.selectedRoom = room
        this.activities = room.activities;
      }
      // clear dropdown model 
      this.selectedActivity = null
      this.subForm.pre_selected = false
      this.subForm.time = ["0","0","0"]
      this.subForm.weeks = []
      this.subForm.frequency = []
    },
    selectedActivity: function(newActivity, oldActivity){

      if (newActivity === oldActivity || newActivity===null) return;

      const currentActivity = this.activities.find(
        (activity) => activity.activity.term_id === newActivity.id
      );
      // if activity is not in the selected room
      if (currentActivity === undefined){
        
        this.subForm.frequency = []
        this.subForm.weeks = []
        this.subForm.pre_selected = false
        this.subForm.time = ["0","0","0"]
        // get the object of the selected activity from the dropdown

        this.selectedRoom.activities.push({activity: newActivity, ...this.subForm})
        // update also the settings room that will posted to BE
        this.settingsRooms[this.currentRoomIndex] = this.selectedRoom
      }else{
        console.log('here')
      }

      this.subForm = {...currentActivity}
      this.subForm.frequency = currentActivity.frequency ? currentActivity.frequency.map(a=>parseInt(a)) : []
      this.subForm.time = currentActivity.time_to_perform_task.split(":")

    },
    settings: {
      immediate: true,
      handler: function (){
        this.setupSettings()
      }
    },
/*  
    subForm: {
     deep: true,
      handler: function(newValue) {
        console.log(newValue.pre_selected)
      }
    } */
  }
};
</script>

<style lang="scss">
.activities {
  
  overflow-x: hidden;

  // settings-floors
  .settings-floors {
    text-align: left;
    float: left;
    position: relative;
    left: 0;
  }
  // Floors Select
  .floors-select {
    width: 100%;
    height: 30px;
    font-size: 14px;
    // font-style: italic;
    margin: 0;
    padding: 0 10px;
    text-align: left;
    // border-radius: 25px;
    border: 2px solid $secondary-color;
    outline: $secondary-color;
    background: $secondary-color;
    color: $offblack;
    &:focus {
      outline: none;
      background: $secondary-color;
      color: $offblack;
      // border-radius: 25px;
      border: 3px solid $secondary-color;
      box-shadow: 0px 0px 2px $secondary-color;
    }
    .floors-option {
      width: 100%;
      font-size: 14px;
      text-align: left;
      // border-radius: 25px;
      border: 2px solid $secondary-color;
      outline: $secondary-color;
      background: $secondary-color;
      color: $offblack;
    }
  }
  .btn-black {
    background: $offblack;
    color: $offwhite;
    font-size: 14px;
    font-weight: bolder;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    // margin: 0 5px;
    text-decoration: none;
    border: none;
    line-height: 7px;
    font-family: monospace;
    padding-left: 6px;
  }
  .plus::after,
  .plus {
    content: "+";
  }
  .minus::after,
  .minus {
    content: "-";
  }

  .time-taken  > * {
      flex: 1 1 100%;
      gap: 10px;
      margin-bottom: 10px;
    }
  .time-taken {
    display: flex;
  }

  // custom switch
  #switch[type="checkbox"] {
    height: 0;
    width: 0;
    visibility: hidden;
    margin: 0;
  }
  .switch-label {
    cursor: pointer;
    text-indent: -9999px;
    width: 40px;
    height: 25px;
    background: #ccc;
    display: block;
    border-radius: 50px;
    position: relative;
    margin: 0;
    &:after {
      content: "";
      position: absolute;
      top: 5px;
      left: 5px;
      width: 15px;
      height: 15px;
      background: $offblack;
      border-radius: 15px;
      transition: 0.3s;
      margin: 0;
    }
    &:active:after {
      width: 65px;
    }
  }
  #switch:checked + .switch-label {
    background: $secondary-color;
  }
  #switch:checked + .switch-label:after {
    left: calc(100% - 5px);
    transform: translateX(-100%);
  }

  // Frequency
  .frequency-days {
    color: $offblack;
  }

  /* The container */
  .days-checkbox {
    display: inline;
    position: relative;
    padding-left: 0;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 28px;
    border-radius: 50%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .days-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  /* Create a custom checkbox */
  .checkbox {
    visibility: hidden;
  }
  .checkmark {
    display: inline;
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: $secondary-color;
    color: $offblack;
    border-radius: 50%;
  }
  /* On mouse-over, add a grey background color */
  .days-checkbox:hover input ~ .checkmark {
    background-color: #ccc;
  }
  /* When the checkbox is checked, add a blue background */
  .days-checkbox input:checked ~ .checkmark {
    background-color: $secondary-color;
  }
  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  /* Show the checkmark when checked */
  .days-checkbox input:checked ~ .checkmark:after {
    display: block;
  }
  /* Style the checkmark/indicator */
  .days-checkbox .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid $offblack;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .days-label {
    padding: 0 0 0 5px;
  }
  .weeks-label {
    display: flex;
    align-items: flex-start;
    position: relative;
    margin-top: -60px;
  }
}
</style>