import Vue from 'vue'
import App from './App'
import store from './store'

import '@/components/sy-ui'
// 图标字体
import './static/styles/iconfont.css'
// 公用样式
import './static/styles/common.scss'
import './static/styles/public.scss'

// 全局混入
import mixin from '@/mixin'
Vue.mixin(mixin)

// 在vue上挂载全局变量
Vue.prototype = Object.assign(Vue.prototype, {
    $store: store
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
