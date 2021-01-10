import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 導入全局樣式表
import './assets/css/global.css'

//
import TreeTable from 'vue-table-with-tree-grid'

// 導入富文本編輯器
import VueQuillEditor from 'vue-quill-editor'
// 導入富文本樣式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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

// 將富文本編輯器註冊為全域可用的組件
Vue.use(VueQuillEditor)

// vue filter
Vue.filter('dataFormat', function(originVal) {
  // 加單引號用意是將它轉成字串型式，再去呼叫文字的函數來用
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')// getMonth 是0開始
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
