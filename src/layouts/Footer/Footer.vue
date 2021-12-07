<template>
  <div class="footer">
    <div class="tabs">
      <router-link class="" :to="{ name: 'SettingsFloors' }">Floors</router-link>
      <router-link class="" :to="{ name: 'SettingsRooms' }">Rooms</router-link>
      <router-link class="" :to="{ name: 'SettingsActivities' }">Activities</router-link>
      <router-link class="" :to="{ name: 'SettingsPeriodicals' }">Periodicals</router-link>
      <router-link class="" :to="{ name: 'SettingsOptionals' }">Optional</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',


  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
  .footer {
    height: 70px;
    width: 100vw;
    margin-top: 30px;
    box-sizing: border-box;
    background: $footer-color;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .tab-flex {
      
    }
    .tabs {
      display: flex;
      justify-content: space-evenly;
      align-content: center;
      padding: 0 20px;
      color: $white;
      background: $footer-color;
      a {
        color: #fff;
        text-decoration: none;
        color: white;
         font-size: 14px;
        text-decoration: none;
        font-weight: bold;
      }
      .router-link-active {      
        color: #C1D72E !important;
      }
    }
    .btn {
      background-color: $footer-color;
    }
  }
</style>