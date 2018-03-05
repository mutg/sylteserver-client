import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/components/Root'
import Register from '@/components/Register'
import User from '@/components/User'
import Track from '@/components/ShowTrack'
import Upload from '@/components/Upload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: Root
    },
    {
      path: '/uploadtracks',
      name: 'uploadtracks',
      component: Upload
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/sylter/:track',
      name: 'sylter',
      component: Track
    },
    {
      path: '/sylter',
      redirect: '/'
    }
  ]
})
