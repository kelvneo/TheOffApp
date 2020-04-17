import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import NotFound from '../views/NotFound.vue'
import store from '../store/'

// import * as firebase from 'firebase'
// import 'firebase/auth'

const Home = () => import(/* webpackChunkName: "group-main" */ '../views/Home.vue')
const Root = () => import(/* webpackChunkName: "group-main" */ '../components/main/Root.vue')
const UserOff = () => import(/* webpackChunkName: "group-main" */ '../components/main/offs/UserOff.vue')
const UserOffPass = () => import(/* webpackChunkName: "group-main" */ '../components/main/offs/UserOffPass.vue')
const OffRoot = () => import(/* webpackChunkName: "group-main" */ '../views/offs/OffRoot.vue')
const MARoot = () => import(/* webpackChunkName: "group-main" */ '../views/mas/MARoot.vue')

const About = () => import(/* webpackChunkName: "group-about" */ '../views/About.vue')

const Login = () => import(/* webpackChunkName: "group-login" */ '../views/Login.vue')
const Phone = () => import(/* webpackChunkName: "group-login" */ '../components/login/Phone.vue')
const Verify = () => import(/* webpackChunkName: "group-login" */ '../components/login/Verify.vue')
const CollectInfo = () => import(/* webpackChunkName: "group-register" */ '../components/login/CollectInfo.vue')
const WaitForApproval = () => import(/* webpackChunkName: "group-register" */ '../components/login/WaitForApproval.vue')

const RecommendOff = () => import(/* webpackChunkName: "group-recommend" */ '../views/offs/RecommendOff.vue')
const ApproveOff = () => import(/* webpackChunkName: "group-approve" */'../views/offs/ApproveOff.vue')
const RecommendMA = () => import(/* webpackChunkName: "group-recommend" */'../views/mas/RecommendMA.vue')
const ApproveMA = () => import(/* webpackChunkName: "group-approve" */'../views/mas/ApproveMA.vue')

const ApproveUsers = () => import(/* webpackChunkName: "group-temp" */'../components/main/ApproveUsers.vue')

const UsersRoot = () => import(/* webpackChunkName: "group-users" */'../views/Users.vue')
const UserList = () => import(/* webpackChunkName: "group-users" */'../components/main/users/UserList.vue')
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
                // name: 'UserDetails',
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
        ]
        // redirect: '/login/wait',
        // beforeEnter: (to, from, next) => {
        // }
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
          setTimeout(checkLoading, 50)
        }
      }
      checkLoading()
      // next()
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
