import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Phone from '../components/login/Phone.vue'
import Verify from '../components/login/Verify.vue'
import CollectInfo from '../components/login/CollectInfo.vue'
import WaitForApproval from '../components/login/WaitForApproval.vue'
import Root from '../components/main/Root.vue'
import About from '../views/About.vue'
import UserOff from '../components/main/offs/UserOff.vue'
import OffRoot from '../views/Offs.vue'
import store from '../store/'

// import * as firebase from 'firebase'
// import 'firebase/auth'

const ApproveUsers = () => import('../components/main/ApproveUsers.vue')
const RecommendOff = () => import('../components/main/offs/RecommendOff.vue')
const ApproveOff = () => import('../components/main/offs/ApproveOff.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '/login',
        component: Login,
        children: [
          {
            path: '',
            component: Phone,
            beforeEnter: (to, from, next) => {
              if (!store.state.credentials.user) {
                next()
              } else {
                next('/login/info')
              }
            }
          },
          {
            path: 'verify',
            component: Verify,
            beforeEnter: (to, from, next) => {
              if (!store.state.credentials.confirmationResult) {
                next('/login')
              } else {
                next()
              }
            }
          },
          {
            path: 'info',
            component: CollectInfo,
            beforeEnter: (to, from, next) => {
              if (!store.state.credentials.user) {
                next('/login')
              } else if (store.state.user.tempUser) {
                next('/login/wait')
              } else {
                next()
              }
            }
          },
          {
            path: 'wait',
            component: WaitForApproval,
            beforeEnter: (to, from, next) => {
              if (!store.state.credentials.user) {
                next('/login')
              } else if (!store.state.user.tempUser) {
                next('/login/info')
              } else {
                next()
              }
            }
          }
        ],
        beforeEnter: (to, from, next) => {
          if (store.state.user.currentUser) {
            next('/')
          } else {
            next()
          }
        }
      },
      {
        path: '/',
        // name: 'home',
        component: Home,
        children: [
          {
            path: '',
            name: 'Root',
            component: Root
          },
          {
            path: 'about',
            name: 'About',
            component: About
          },
          {
            path: 'approve',
            name: 'ApproveUsers',
            component: ApproveUsers
          },
          {
            path: 'off',
            component: OffRoot,
            children: [
              {
                path: '',
                redirect: {
                  name: 'UserOff'
                }
              },
              {
                path: 'stockcard',
                name: 'UserOff',
                component: UserOff
              },
              {
                path: 'recommend',
                name: 'RecommendOff',
                component: RecommendOff
              },
              {
                path: 'approve',
                name: 'ApproveOff',
                component: ApproveOff
              }
            ]
          }
        ],
        // redirect: '/login/wait',
        beforeEnter: (to, from, next) => {
          if (!store.state.user.currentUser) {
            next('/login')
          } else {
            store.dispatch('user/getUserPermissions', store.state.credentials.user.uid).then((snapshot) => {
              const payload = {}
              snapshot.forEach((doc) => {
                payload[doc.id] = doc.data()
              })
              store.commit('user/setPermissions', payload)
            })
            next()
          }
        }
      }
      // {
      //   path: '/about',
      //   name: 'about',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      // }
    ],
    beforeEnter: (to, from, next) => {
      function checkLoading () {
        if (!store.state.credentials.loading) next()
        else {
          setTimeout(checkLoading, 100)
        }
      }
      checkLoading()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
