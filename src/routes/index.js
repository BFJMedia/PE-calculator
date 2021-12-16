import Vue from 'vue'
import Router from 'vue-router'

import Page404 from '@/pages/NotFound/404'
import Login from '@/pages/Login/Login'
import Home from '@/pages/Home/Home'
import Settings from '@/pages/Settings/Settings'

import SettingsMain from '@/pages/Settings/SettingsMain'
import SettingsRooms from '@/pages/Settings/SettingsRooms'
import SettingsFloors from '@/pages/Settings/SettingsFloors'
import SettingsActivities from '@/pages/Settings/SettingsActivities'
import SettingsPeriodicals from '@/pages/Settings/SettingsPeriodicals'
import SettingsOptionals from '@/pages/Settings/SettingsOptionals'
import HomeProposals from '@/pages/Proposals/Main'
import Default from "@/layouts/Default.vue"

import proposalRoutes from './proposals'

const settingsRoutes =  [
  {
      path: '/',
      name: 'HomeProposals',
      component: HomeProposals,
      meta: {
          requiresAuth: true,
          role: '',
          layout: Default
      }
  }, 
  {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
          requiresAuth: true,
          role: 'admin',
          layout: Default
      },
      children: [
        {
          name: 'SettingsMain',
          path: '/',
          component: SettingsMain,
          meta: {
            requiresAuth: true,
            role: 'admin',
            layout: Default
          },
      },{
          name: 'SettingsRooms',
          path: 'rooms',
          component: SettingsRooms,
          meta: {
            requiresAuth: true,
            role: 'admin',
            layout: Default
          },
      },{
          name: 'SettingsFloors',
          path: 'floors',
          component: SettingsFloors,
          meta: {
            requiresAuth: true,
            role: 'admin',
            layout: Default
          },
      },
      {
          name: 'SettingsActivities',
          path: 'activities',
          component: SettingsActivities,
          meta: {
            requiresAuth: true,
            role: 'admin',
            layout: Default
          },
        },
      {
          name: 'SettingsPeriodicals',
          path: 'periodicals',
          component: SettingsPeriodicals,
          meta: {
            requiresAuth: true,
            role: 'admin',
            layout: Default
          },
      },
      {
          name: 'SettingsOptionals',
          path: 'optionals',
          component: SettingsOptionals,
          meta: {
            requiresAuth: true,
            role: 'admin',
            layout: Default
          },
      },
      ]
  }, 
  {
      path: '/login',
      name: 'Login',
      component: Login
  }, 
  {
      path: '*',
      name: 'error',
      component: Page404,
      meta: {
          requiresAuth: false
      }
  }
  ]

/*
  Proposals routes

*/
Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes:[
      ...settingsRoutes,
      ...proposalRoutes
    ]
})



router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      }
        next()
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'userboard'})
      }
  }else {
      next()
  }
})

export default router