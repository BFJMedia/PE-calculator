<template>
  <div class="header m-0">
  <div class="container">
    <div class="row">
    <div class="icons float-l col-6  py-2">
      <router-link to="/proposals" title="home" class="top-link">
        <img src="@/assets/icons/0.75x/home-white.png" class="icon home"/></router-link>
 
      <router-link to="/settings" title="settings" class="top-link"><img src="@/assets/icons/0.75x/settings-white.png" class="icon settings"/></router-link>
      <div class="icon center col-2"></div>
 
    </div>
    </div>

  </div>
  </div>
</template>

<script>
export default {
  name: 'Header',


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

<style lang="scss">
  *, *::before, *::after {
    box-sizing: border-box;
    width: 100%;
  }
   .icon {
      width: 33px;
      
      margin: 0;
      .setting, .home {
        width: 30px;
      }
    }
    .icons {
    display: flex;
    flex-wrap: row wrap;
}
.icons.float-l .top-link:last-child img {
    width: 31px;
}
    .top-link {
      width: 50px;
    }
  .header {
    background: $primary-color;
    min-height: 50px;
    
    padding:10 0;
   
    .left {
      padding-left: 0;
      display: inherit;
      width: 30%;
      justify-content: space-evenly;
    }
    .center {
      display: inherit;
      width: 30%;
    }
    .right {
      width: 80%;
      position: relative;
      display: inherit;
      justify-content: space-evenly;
      float: right;
      padding-right: 73px;
    }
    .btn {
      background: none;
      border: none;
    }
  }

</style>