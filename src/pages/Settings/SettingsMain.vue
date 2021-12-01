<template>
  <div class="container">
    <div class="title">
      <h2>Settings</h2>
    </div>
    <div class="content">
      <form>
        <div class="flex-col h-space">
          <div class="set-days h-space">
            <div class="days-grid h-space">
              <div class="grid-days">
                <div class="days-title flex-100 flex-row"> <label for="default-days" class="text-l">Default Days:</label> </div>
                <div class="days-label flex-100 flex-row">
                  <label v-for="(str, i) in days_options" :key="i"><div class="default-days" >{{ str[1] }}</div></label>  
                </div>
                <div class="days-chkbx flex-100 flex-row h-space"> 
                  <div class="flex-row" v-for="(str, i) in days_options" :key="i">
                    <label class="days-checkbox" > 
                      <input type="checkbox" class="checkbox default-checkbox" :value="str[0]" v-model="days" @change="updateSettings">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid-horizontal flex-row h-space">
              <div class="grid-row h-space">
                <div class="grid-title flex-row flex-100"> <label for="default-rate" class="text-l">Default Rate:</label> </div>
                <div class="grid-form flex-row flex-50">
                  <currency-input v-model="default_rate" 
                    @change="updateSettings"></currency-input>
                </div>
              </div>
            </div>
            <div class="grid-horizontal flex-row h-space" >
              <div class="grid-row h-space">
                <div class="grid-title flex-row flex-100"> <label for="saturday-rate" class="text-l">Saturday Rate:</label> </div>
                <div class="grid-form flex-row flex-50"> 
                  
            <currency-input v-model="saturday_rate" 
                    @change="updateSettings"></currency-input>
                </div>
              </div>
            </div>
            <div class="grid-horizontal flex-row h-space" >
              <div class="grid-row h-space">
                <div class="grid-title flex-row flex-100"> <label for="sunday-rate" class="text-l">Sunday Rate:</label> </div>
                <div class="grid-form flex-row flex-50"> 
                  <!-- <input type="text" v-model="sunday_rate" class="sunday-rate" required autofocus  v-on:change="updateSettings">   -->
                   <currency-input v-model="sunday_rate" 
                    @change="updateSettings"></currency-input>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </form>
      
    </div>
  </div>
</template>

<script>
import request from '@/helpers/fetchWrapper'
import { SETTINGS_URL, UPDATE_SETTINGS_URL } from '@/utils/const'

export default {
  name: 'SettingsMain',
  components: {
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
      days:[],
      default_rate: 0,
      saturday_rate: 0,
      sunday_rate: 0,
      settings_id: null,
      visible_sat: true,
      visible_sun: false
    };
  },

  mounted() {
    this.fetchSettings()
    this.$store.dispatch('getTaxonomy', {taxonomy: 'periodicals'});
    this.$store.dispatch('getTaxonomy', {taxonomy: 'optionals'});
  },

  methods: {
    updateSettings: function(){
        console.log('trigged by emti')
        let formData = {
          fields: {
            days:[],
            rate: '',
            saturday_rate: '',
            sunday_rate: ''
          }
        };

        formData.fields.days = this.days;
        formData.fields.rate = this.default_rate;
        formData.fields.saturday_rate = this.saturday_rate;
        formData.fields.sunday_rate = this.sunday_rate;

        request(`${UPDATE_SETTINGS_URL}${this.settings_id}`, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
      
          },
        }).then((res) => {              
            console.log(res)
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchSettings: function(){
        request(SETTINGS_URL, {
          method: 'GET'
        }).then((res) => {              
            this.days = res.acf.days
            this.default_rate = parseFloat(res.acf.rate) || 0
            this.saturday_rate = parseFloat(res.acf.saturday_rate) || 0
            this.sunday_rate = parseFloat(res.acf.sunday_rate) || 0
            console.log(this.sunday_rate)
            this.settings_id = res.ID
        }).catch((err) => {
          console.log(err)
        })
    },
  },
  computed:{
    show_sunday(){
      return this.days.some( a=> parseInt(a) ===7)
    },
    show_sat(){
      return this.days.some( a=> parseInt(a) ===6)
    }
  }
};
</script>

<style lang="scss">
  
  .container {
    h2 {
      text-transform: uppercase;
    }
    width: 90vw;
    margin: 0 auto;
    text-align: center;

    table {
      width: 100px;
      position: relative;
      text-align: center;
      margin-left: -20px;
      th {
        width: 10px
      }
      td {
        max-width: 30px;
      }
    }
    .content {
      display: flex;
      
      .default-checks {
        display: inline;
        padding: 0 10px;
        width: 100vw;
      }

      .default-days {
        display: flex;
        padding: 0 7px;
      }

      input {
        margin: auto 0;
        
      }

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

  }

  // Floors Select
  .floors-select {
    width: 100%;
    height: 30px;
    font-size: 14px;
    // font-style: italic;
    margin-left: 10px;
    padding: 5px 0 5px 25px;
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
      width: 150px;
      height: 20px;
      font-size: 14px;
      margin-left: 10px;
      padding: 5px 0 5px 25px;
      text-align: left;
      // border-radius: 25px;
      border: 2px solid $secondary-color;
      outline: $secondary-color;
      background: $secondary-color;
      color: $offblack;
    }
  }
  .btn {
    background: $offblack;
    color: $offwhite;
    font-size: 12px;
    font-weight: bolder;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    margin: 0 5px;
  }

</style>