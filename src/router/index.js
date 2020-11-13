import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from 'views/Home'
import HomeWelcome from 'views/child/HomeWelcome'
import HomeUsers from 'views/child/HomeUsers'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: HomeWelcome },
      { path: '/users', component: HomeUsers },
      { path: '/roles', component: HomeUsers },
      { path: '/rights', component: HomeUsers }
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
