import Vue from 'vue'
import Router from 'vue-router'

import displayItem from '../components/displayItem'
import createItem from '../components/createItem'
import editItem from '../components/editItem'
import addUserAccounts from '../components/addUserAccounts'
import createUser from '../components/createUser'
import editUser from '../components/editUser'
import authUser from '../components/authForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/displaytable',
      name: 'displayItem',
      component: displayItem,
      children: [{
        path: 'add',
        name: 'createItem',
        component: createItem
      },{
        path: 'edit',
        name: 'editItem',
        component: editItem
      }
      ]
    },
    {
      path: '/user',
      name: 'addUserAccounts',
      component: addUserAccounts,
      children: [{
        path: 'add',
        name: 'createUser',
        component: createUser
      },{
        path: 'edit',
        name: 'editUser',
        component: editUser
      }
      ]
    },
    {
      path: '/login',
      name: 'authUser',
      component: authUser
    }
  ]
})
