import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import './assets/css/global.css'
// 引入图标字体
import './assets/fonts/iconfont.css'
// 全局引入axios
import axios from 'axios'
// 全局引用vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// axios配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 注册
Vue.component('tree-table',TreeTable)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')