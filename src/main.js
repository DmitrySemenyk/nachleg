import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import VueAxios from 'vue-axios'
import axios from 'axios'


import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/umd/locale/ru-RU'
import locale from 'element-ui/lib/locale'

Vue.config.productionTip = false
locale.use(lang)
Vue.use(VueAxios,
  axios,
  BootstrapVue,
  Element)

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
