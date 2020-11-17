import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from 'components/Home/Home'
import HomeWelcome from 'components/Home/HomeWelcome'
import UsersMgt from 'components/Users/UsersMgt'
import RightsMgt from "components/Right/RightsMgt"
import RightSRole from "components/Right/RightRole"

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: HomeWelcome },
      { path: '/users', component: UsersMgt },
      { path: '/roles', component: RightSRole },
      { path: '/rights', component: RightsMgt }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {

  // 如果访问的是 登录页 请求放行 并阻止程序向下运行
  if (to.path == "/login") return next();

  const tokenStr = window.sessionStorage.getItem("token")
  // token不存在 拦截并跳转到登录页
  if (!tokenStr) return next("/login")

  next()
})

export default router
