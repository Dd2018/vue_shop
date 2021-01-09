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
// 全局引用富文本编辑器以及样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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
// 挂载
Vue.use(VueQuillEditor)

// 时间过滤器
Vue.filter('dataFormat', function (originValue) {
  const newDate = new Date(originValue)

  const year = newDate.getFullYear()
  // 不足两位在前面补零
  const month = (newDate.getMonth() + 1 + ' ').padStart(2, '0')
  const day = (newDate.getDay() + ' ').padStart(2, '0')
  const hour = (newDate.getHours() + ' ').padStart(2, '0')
  const minute = (newDate.getMinutes() + ' ').padStart(2, '0')
  const second = (newDate.getSeconds() + ' ').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

// 注册
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
