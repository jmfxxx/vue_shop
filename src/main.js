import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 導入全局樣式表
import './assets/css/global.css'

//
import TreeTable from 'vue-table-with-tree-grid'

// 導入圖標
import './assets/fonts/iconfont.css'

import axios from 'axios'
// 設定請求根路徑
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 設定axios攔截器interceptors
// config請求對象最後要寫return config
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
