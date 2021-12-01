<template>
<section id="login-wrapper" class="bgImage">
  <!-- <h4>Planet Earth Quotation Creator</h4> -->
  <div class="logo-container">
    <img src="@/assets/logo.png"/>
  </div>
  <div class="login-title">
    <h1 class="title">Quotation Creator</h1>
  </div>
  <div class="calc-container my-4">
    <img src="@/assets/calculator.png"/>
  </div>
  <div class="container">
  <form class="" @submit="handleSubmit" method="POST">

    <div class="container">
      <div class="row">
        <div class="col-3">
          <label for="email" >User ID</label>
        </div>
        <div class="col-9">
          <input id="email" type="text" v-model="email" placeholder="User ID" required autofocus>
        </div>
      </div>
      <div class="row">
         <div class="col-3">
        <label for="password" >Password</label>
        </div>
        
          <div class="col-9">
            <input id="password" type="password" v-model="password" @keypress.enter="handleSubmit()"  placeholder="Password" required>
        </div>
      </div>
      <div class="row">
         <div class="col-3">
        </div>
         <div class="col-3 col-offset-3">
          <button type="submit" class="login-btn" @click="handleSubmit">Login</button>
        </div>
      </div>
    </div>
  </form>
  </div>

</section>
</template>

<script>
import request from '@/helpers/fetchWrapper'
import { LOGIN_URL, USER_ACCESS_URL  } from '@/utils/const'
export default {
  name: 'LoginPage',


  data() {
    return {
        email : "",
        password : ""
    };
  },

  mounted() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
  },

  methods: {
    handleSubmit(e){
        e.preventDefault()
        if (this.password.length > 0) {

          const formData = new FormData()
          formData.append('username', this.email)
          formData.append('password', this.password)

            request(LOGIN_URL, {
              method: 'POST',
              body: formData
            }).then((res) => {                  
                if (res.token !== "" ){
                  localStorage.setItem('jwt',JSON.stringify(res));
                  //this.$router.push(this.$route.query.redirect || '/')
                  this.getUserAccess()
                }

            }).catch((err) => {
              console.log(err)
            })

        }
    },
    getUserAccess(){
      
         request(USER_ACCESS_URL, {
              method: 'POST'
            }).then((res) => {                  
                if (res.data !== "" ){
                  localStorage.setItem('user',JSON.stringify(res.data));
                  const { data } = res
                  const { roles } = data
                  this.$store.commit('setUser', data)                  
                  if (roles.includes('admininistrator')){
                    this.$router.push(this.$route.query.redirect || '/')
                  }else{                    
                    this.$router.push(this.$route.query.redirect || '/proposals')
                  }
                }

            }).catch((err) => {
              console.log(err)
            })
    }
  },
};
</script>

<style lang="scss" >
body, html {
  margin:0; 
  padding:0;
  height: 100vh;  
  width: 100vw;
  box-sizing: border-box;
}

#login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    color: #fff;
  }
  label {
    color: #fff;
  }
  .logo-container {
    max-width: 25%;
  }
  .calc-container {
    max-width: 15%;
  }

  input {
    border: none;
    margin-bottom: 10px;
    text-align: left;
    padding-left: 15px;
  }
  
  .login-btn {
    outline:none;
    height: 40px;
    text-align: center;    
    background: #C1D72E;
    border: 2px solid $primary-color;
    color: $offwhite;
    letter-spacing: 1px;
    text-shadow: 0;
    cursor: pointer;
    transition: all 0.25s ease;
    margin: 0 auto;
    &:hover {
      color: $primary-color;
      background: $offwhite;
      box-shadow: 0 0 6px $primary-color;
    }
    &:active {
      //letter-spacing: 2px;
      letter-spacing: 2px ;
    }
    &:after {      
      font-weight: bolder;
      font-size: 16px;
    }
  } 
}

// Font Colors
.off-white {
  color: $white;
}

// Login
.bgImage {
  background-color: $primary-color;
  height: 100vh;  
  width: 100vw;
}
.login-form {
    margin: 0 auto; 
    
    input {
      width: (100% / 1.90);
      height: 40px;
      font-size: 18px;
      font-style: italic;
      padding: 5px 0 5px 25px;
      margin-bottom: 15px;
      text-align: left;
      border-radius: 0;
      
      outline: $primary-color;
      background: $primary-color;
      color: $offwhite;        
      &:focus {
        outline: none;
        background: $primary-color;
        color: $offwhite;
        border: none !important;
        box-shadow: 0px 0px 2px $primary-color;
      }
      &::placeholder {
        color: $offwhite;
      }
    }
    
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
// desktopMode
@media screen and (max-width: 5000px) and (min-width: 1025px) {
  
}
// tabletMode
@media screen and (max-width: 1024px) and (min-width: 650px) {
  
}
// mobileMode
@media screen and (max-width: 649px) and (min-width: 1px) {
  
  #login-wrapper {
  .calc-container {
      max-width: 20%;
    }
  .logo-container {
      max-width: 45%;
    }
  }
  
}
</style>