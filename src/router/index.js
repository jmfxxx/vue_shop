import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add }
    ]
  }
]
const router = new VueRouter({
  routes
})

// 掛載路由，導航守衛
router.beforeEach((to, from, next) => {
  // to 將要訪問的路徑
  // from 從那裏來
  // next 是一個function表示放行  next()  方法二:next('/login')強制跳轉
  if (to.path === '/login') return next() // 如果到/login直接放行
  // 取得sessionStorage的值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果是空表示，沒登入過強制到/login
  if (!tokenStr) return next('/login')
  // 如果沒問題就放行
  next()
})

export default router
