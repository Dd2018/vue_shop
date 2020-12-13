import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
]

const router = new VueRouter({
    routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
    // to将要访问
    // from从哪个页面跳转过来
    // next 函数 放行
    if (to.path === '/login') return next()
    const tokenString = window.sessionStorage.getItem('token')
    if (!tokenString) return next('/login')
    next()
})
export default router