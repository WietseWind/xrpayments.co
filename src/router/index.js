import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Donate from '@/components/Donate'
import About from '@/components/About'
import Settings from '@/components/Settings'
import AddWallet from '@/components/AddWallet'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/donate',
      name: 'Donate',
      component: Donate
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/settings/add-wallet',
      name: 'AddWallet',
      component: AddWallet
    }
  ]
})
