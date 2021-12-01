import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import VueSingleSelect from "vue-single-select";
import VueConfirmDialog from 'vue-confirm-dialog'
import CurrencyInput from './components/common/CurrencyInput.vue'
import CustomDropdown from './components/common/CustomDropdown.vue'

// console.log(CurrencyInput, "cur input")

// font awesome library

Vue.config.productionTip = false


Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.component('vue-single-select', VueSingleSelect); 

Vue.component('currency-input', CurrencyInput)
Vue.component('custom-dropdown', CustomDropdown)

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate: function () {

  },
  components: {
    //CurrencyInput: () => import('./components/common/CurrencyInput.vue')
  }
}).$mount('#app')
