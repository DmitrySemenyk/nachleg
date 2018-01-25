import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import VueAxios from 'vue-axios'
import axios from 'axios'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(VueAxios,
  axios,
  BootstrapVue)

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
