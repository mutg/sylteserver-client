import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/components/Root'
import Register from '@/components/Register'
import User from '@/components/User'
import Track from '@/components/ShowTrack'
import Upload from '@/components/Upload'
import AdminPanel from '@/components/AdminPanel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Root,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      meta: {
        title: 'Upload'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: 'Register'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        title: 'User Panel'
      }
    },
    {
      path: '/sylter/:track',
      name: 'sylter',
      component: Track,
      meta: {
        title: 'Sylter'
      }
    },
    {
      path: '/adminpanel',
      name: 'adminpanel',
      component: AdminPanel,
      meta: {
        title: 'Admin'
      }
    },
    {
      path: '/sylter',
      redirect: '/'
    }
  ]
})
