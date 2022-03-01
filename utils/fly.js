// flyio 文档
// https://wendux.github.io/dist/#/doc/flyio/config
import envConfig from '@/config'
import { loginModal } from '@/utils'
import { getToken, getItem } from './storage'
import store from '@/store'

var Fly = require('flyio/dist/npm/wx.js') // wx.js为flyio的微信小程序入口文件
var fly = new Fly() // 创建fly实例

// 过滤空参数，undefined，null，空字符串
function filterEmptyParams(params) {
    if (typeof params === 'object') {
        Object.keys(params).forEach(key => {
            if ([
                '',
                'null',
                'undefined',
                null,
                void 0
            ].includes(params[key])) {
                delete params[key]
            }
        })
    }
}
// 添加拦截器
fly.interceptors.request.use((config) => {
    filterEmptyParams(config.body)
    filterEmptyParams(config.data)
    filterEmptyParams(config.params)
    // 给所有请求添加自定义header
    config.headers['X-Tag'] = 'flyio'
    let token
    let refreshToken
    if (store.state.user.isLogin) {
        token = store.state.user.token || ''
        refreshToken = store.state.user.refreshToken || ''
    } else {
        let data = getToken()
        token = data.access_token || ''
        refreshToken = data.refresh_token || ''
    }
    config.headers = config.headers || {}
    config.headers = {
        ...config.headers,
        token,
        refreshToken
    }
    return config
})
// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    res => {
        let data = res.data
        switch (data.success) {
        case true:
            if ('data' in data) {
                return data.data
            } else {
                return data
            }
        case false:
            uni.hideLoading()
            if (res.request.showErrorToast !== false) {
                uni.showToast({
                    icon: 'none',
                    title: data.msg || '网络错误！',
                    duration: 2000
                })
            }
            return Promise.reject(res.engine.response)
        default:
            return data
        }
    },
    (res) => {
        // 请求失败关闭加载动画
        uni.hideLoading()
        // 登录信息过期，重新登录
        if (res.engine.status === 401) {
            store.dispatch('logout')
            return loginModal()
        }
        let response = res.engine.response
        if (res.request.showErrorToast !== false) {
            let message = response ? response.message : res.message
            uni.showToast({
                icon: 'none',
                title: message || '网络错误！',
                duration: 2000
            })
        }
        return Promise.reject(response)
    }
)
// 配置请求基地址
fly.config.baseURL = envConfig.BASE_API

export default fly
