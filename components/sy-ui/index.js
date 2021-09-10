
import Vue from 'vue'
import { isEmpty, numberPad, moneyFormat } from './utils'
import dateTools from './utils/dateTools'

import './index.scss'
import './iconfont.css'

var navigateData = {}

Vue.filter('numberPad', numberPad)
// 日期格式化
Vue.filter('dateFormat', function(value, format = 'YYYY-MM-DD') {
    return dateTools.format(value, format) || '- -'
})
Vue.filter('moneyFormat', moneyFormat)

// 在vue上挂载全局变量
Vue.prototype = Object.assign(Vue.prototype, {
    isEmpty,
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
    navigateToData: (url, data) => {
        const key = 'datakey' + Date.now()
        navigateData[key] = data
        if (/\?/.test(url)) {
            uni.navigateTo({
                url: `${url}&datakey=${key}`
            })
        } else {
            uni.navigateTo({
                url: `${url}?datakey=${key}`
            })
        }
    },
    // 获取从navigateToData方法传递的数据
    getNavigateData: (datakey) => {
        if (datakey) {
            let data = navigateData[datakey]
            delete navigateData[datakey]
            return data
        }
    }
})
