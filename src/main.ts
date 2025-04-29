import { createApp } from "vue"
import { createPinia } from "pinia"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import "./style.css"

// 导入Ant Design Vue
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"

// 导入路由组件
import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import Profile from "./views/Profile.vue"

// 创建路由
const router = createRouter({
  // history: createWebHistory(),
  // 修复:生成环境部署在子目录下时，history: createWebHistory()会导致404错误
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    {
      path: "/profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const hasUserData = !!localStorage.getItem("user")

  next()

  // if (to.meta.requiresAuth && !hasUserData) {
  //   next("/login")
  // } else {
  //   next()
  // }
})

// 创建Pinia
const pinia = createPinia()

// 创建并挂载应用
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Antd) // 使用Ant Design Vue
app.mount("#app")
