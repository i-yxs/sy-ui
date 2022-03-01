
import Vue from 'vue'
import mixin from './mixin'

import './index.scss'
import './iconfont.css'

Vue.mixin(mixin)

var navigateData = {}
// 在vue上挂载全局变量
Vue.prototype = Object.assign(Vue.prototype, {
    showToast: (title, options) => {
        uni.showToast(Object.assign({
            icon: 'none',
            title: title,
            duration: 2000
        }, options))
    },
    showModal: (content, options) => {
        return new Promise((resolve, reject) => {
            options = {
                title: '提示',
                content,
                ...options
            }
            uni.showModal({
                ...options,
                success: ({ confirm, cancel }) => {
                    if (confirm) {
                        resolve()
                    } else if (cancel) {
                        reject()
                    }
                }
            })
        })
    },
    showLoading: (title, options) => {
        uni.showLoading(Object.assign({
            mask: true,
            title: title || '加载中'
        }, options))
    },
    /**
     *  页面跳转传递任意数据
     * @param String: url     //跳转的url
     * @param Number: data    //传递的数据
     */
    navigateToData: (url, data, options) => {
        let key = 'datakey' + Date.now()
        navigateData[key] = data
        uni.navigateTo({
            url: `${url}${/\?/.test(url) ? '&' : '?'}datakey=${key}`,
            ...options
        })
    },
    // 获取从navigateToData方法传递的数据
    getNavigateData: (datakey) => {
        if (datakey) {
            let data = navigateData[datakey]
            delete navigateData[datakey]
            return data
        }
    },
    // 跳转页面
    handleGoto(e) {
        let dataset = e.currentTarget.dataset
        if (dataset.url) {
            let params = ''
            Object.keys(dataset).forEach(key => {
                if (/^param:/.test(key)) {
                    params += params ? '&' : ''
                    params += `${key.replace('param:', '')}=${dataset[key]}`
                }
            })
            uni.navigateTo({
                url: `${dataset.url}${/\?/.test(dataset.url) ? '&' : '?'}${params}`
            })
        }
    }
})
