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
import UserOffPass from '../components/main/offs/UserOffPass.vue'
import OffRoot from '../views/offs/OffRoot.vue'
import MARoot from '../views/mas/MARoot.vue'
import NotFound from '../views/NotFound.vue'
import store from '../store/'

// import * as firebase from 'firebase'
// import 'firebase/auth'

const RecommendOff = () => import(/* webpackChunkName: "group-recommend" */ '../views/offs/RecommendOff.vue')
const ApproveOff = () => import(/* webpackChunkName: "group-approve" */'../views/offs/ApproveOff.vue')
const RecommendMA = () => import(/* webpackChunkName: "group-recommend" */'../views/mas/RecommendMA.vue')
const ApproveMA = () => import(/* webpackChunkName: "group-approve" */'../views/mas/ApproveMA.vue')

const ApproveUsers = () => import('../components/main/ApproveUsers.vue')

const UsersRoot = () => import('../views/Users.vue')
const UserList = () => import('../components/main/users/UserList.vue')
const UserDetails = () => import(/* webpackChunkName: "group-user" */ '../views/users/User.vue')
const UserDetailsRoot = () => import(/* webpackChunkName: "group-user" */ '../components/main/users/UserDetails.vue')
const UserOffPassRecords = () => import(/* webpackChunkName: "group-user" */ '../components/main/users/UserOffPassRecords.vue')
const UserOffRecords = () => import(/* webpackChunkName: "group-user" */ '../components/main/users/UserOffRecords.vue')
const UserMARecords = () => import(/* webpackChunkName: "group-user" */ '../components/main/users/UserMARecords.vue')

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
                path: 'pass',
                name: 'UserOffPass',
                component: UserOffPass
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
          },
          {
            path: 'ma',
            component: MARoot,
            children: [
              {
                path: '',
                redirect: {
                  name: 'UserOff'
                }
              },
              {
                path: 'stockcard',
                redirect: {
                  name: 'UserOff'
                }
              },
              {
                path: 'recommend',
                name: 'RecommendMA',
                component: RecommendMA
              },
              {
                path: 'approve',
                name: 'ApproveMA',
                component: ApproveMA
              }
            ]
          },
          {
            path: 'users',
            component: UsersRoot,
            children: [
              {
                path: '',
                name: 'UserList',
                component: UserList
              },
              {
                path: ':id',
                name: 'UserDetails',
                component: UserDetails,
                props: true,
                children: [
                  {
                    path: '',
                    name: 'UserDetailsRoot',
                    component: UserDetailsRoot,
                    props: true
                  },
                  {
                    path: 'pass',
                    name: 'UserOffPassRecords',
                    component: UserOffPassRecords,
                    props: true
                  },
                  {
                    path: 'off',
                    name: 'UserOffRecords',
                    component: UserOffRecords,
                    props: true
                  },
                  {
                    path: 'ma',
                    name: 'UserMARecords',
                    component: UserMARecords,
                    props: true
                  }
                ]
              }
            ]
          }
        ],
        // redirect: '/login/wait',
        beforeEnter: (to, from, next) => {
          if (!store.state.user.currentUser) {
            next({
              path: '/login',
              query: { redirect: to.fullPath }
            })
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
  },
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
