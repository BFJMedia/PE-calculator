<template>
  <div>
    <Header />
    <router-view></router-view>    
    <Footer />
  </div>
</template>

<script>
/* import Header from '../../components/layouts/Header/Header.vue'
import Footer from '../../components/layouts/Footer/Footer.vue' */
import request from '@/helpers/fetchWrapper'
import { SETTINGS_URL, UPDATE_SETTINGS_URL } from '@/utils/const'


export default {
  name: 'Settings',
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
      default_rate: '',
      settings_id: null
    };
  },

  mounted() {
   
  },

  methods: {

  }
};
</script>

<style lang="scss" scoped>
  #floors-page { display: none;visibility: hidden; }
  .container {
    width: 80vw;
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
        display: inline;
        padding: 0 17px;
        width: 100vw;
      }

    }

    /* The container */
    .days-checkbox {
      display: inline;
      position: relative;
      padding-left: 32px;
      margin-bottom: 12px;
      margin-left: 10px;
      cursor: pointer;
      font-size: 22px;
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