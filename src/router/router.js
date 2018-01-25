import Vue from 'vue'
import Router from 'vue-router'

import displayItem from '../components/displayItem'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'diplayItem',
      component: displayItem
    }
  ]
})
