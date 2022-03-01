import { BASE_API } from '../config'

export const uploadFileUrl = BASE_API + 'api/File' // 附件上传
export const previewImgSrc = BASE_API + 'api/file/thumbImage/' // 略缩图 fileId
export const baseImgSrc = BASE_API + 'api/file/image/' // 整图 fileId
export const baseDownSrc = BASE_API + 'api/file/download/' // 下载文件路径 fileId

// 提示重新登录
export function loginModal() {
    // 白名单，白名单列表内的页面不会提示
    let whiteList = [
        'pages/tabBar/home',
        'pages/user/login'
    ]
    let currentPage = getCurrentPages()
    if (!currentPage.length || whiteList.includes(currentPage.slice(-1)[0].route)) return
    let token = getToken().access_token
    if (token) {
        uni.showModal({
            title: '提示',
            content: '登录信息已过期，请重新登录',
            showCancel: false,
            success: () => {
                store.dispatch('logout')
                uni.redirectTo({
                    url: '/pages/user/login?returnUrl=' + currentPage[0].route
                })
            }
        })
    } else {
        uni.showModal({
            title: '提示',
            content: '该功能需要登录，是否前往登录？',
            success: ({ confirm }) => {
                if (confirm) {
                    uni.reLaunch({
                        url: '/pages/user/login?returnUrl=' + currentPage[0].route
                    })
                } else {
                    uni.navigateBack()
                }
            }
        })
    }
}
/**
 * 获取当前坐标及详细地址
 * @param {Number} timeout 超时时间（ms）默认10000ms
 * @param {String} longitudeKey 返回的经度属性名
 * @param {String} latitudeKey 返回的纬度属性名
 * @param {String} addressKey 返回的详细地址属性名
 * @param {Boolean} isGeocoder 是否逆地址解析，默认为true
 */
export function getLocation(options) {
    options = {
        // #ifdef H5
        timeout: 1000,
        // #endif
        // #ifndef H5
        timeout: 10000,
        // #endif
        addressKey: 'address',
        latitudeKey: 'latitude',
        longitudeKey: 'longitude',
        isGeocoder: true,
        ...options
    }
    return new Promise(function(resolve, reject) {
        let hasTimeout = false
        let timer = setTimeout(() => {
            hasTimeout = true
            reject('获取定位操作超时！')
        }, options.timeout)
        uni.getLocation({
            type: 'gcj02',
            fail(err) {
                if (hasTimeout) return
                clearTimeout(timer)
                reject(err)
            },
            complete({ latitude, longitude }) {
                if (hasTimeout) return
                if (options.isGeocoder) {
                    QQMapSDK.reverseGeocoder({
                        location: { latitude, longitude },
                        complete(res) {
                            if (hasTimeout) return
                            if (res.status === 0) {
                                let { address } = res.result
                                let { province, city, city_code, nation_code } = res.result.ad_info
                                clearTimeout(timer)
                                resolve({
                                    [options.addressKey]: address || '',
                                    [options.latitudeKey]: latitude,
                                    [options.longitudeKey]: longitude,
                                    city,
                                    city_code: Number(city_code.replace(nation_code, '')),
                                    province
                                })
                            } else {
                                reject(res)
                            }
                        },
                        fail(err) {
                            if (hasTimeout) return
                            clearTimeout(timer)
                            reject(err)
                        }
                    })
                } else {
                    clearTimeout(timer)
                    resolve({
                        [options.latitudeKey]: latitude,
                        [options.longitudeKey]: longitude
                    })
                }
            }
        })
    })
}

// Promise方式的微信登录
export function wxLoginToPromise() {
    return new Promise((resolve, reject) => {
        // #ifdef H5
        resolve({ code: '' })
        // #endif
        // #ifdef MP-WEIXIN
        wx.login({
            success: resolve,
            fail: reject
        })
        // #endif
    })
}
/**
 * 检测是否包含权限
 * @param {String | Array} value 权限列表
 * @param {Boolean} isSome 是否检测全部权限，为false时，只要包含一项权限，就判定为通过
 */
export function checkFeature(value, isSome = true) {
    value = Array.isArray(value) ? value : [value]
    let feature = store.state.feature || []
    if (isSome) {
        return value.findIndex(item => feature.indexOf(item) === -1) === -1
    } else {
        return feature.some(item => value.includes(item))
    }
}
