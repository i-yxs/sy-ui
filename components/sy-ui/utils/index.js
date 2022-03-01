
import gcoord from 'gcoord'
import store from '@/store'
import QQMapWX from '@/utils/qqmap-wx-jssdk.min'

// 腾讯地图key
export const MAP_KEY = 'xxx'
// 实例化微信jssdk
export const QQMapSDK = new QQMapWX({
    key: MAP_KEY
})
export const systemInfo = uni.getSystemInfoSync()

// 判断是否为空
export function isEmpty(value) {
    return ['', null, void 0].includes(value)
}
// 是否Promise对象
export function isPromise(value) {
    return typeof value === 'object' && typeof value.then === 'function'
}
// 数字补零
export function numberPad(n) {
    return String(n).padStart(2, '0')
}
// 格式化金额
export function moneyFormat(num, digit = 2) {
    let split = Number(num).toLocaleString('zh', {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit
    }).split('.')
    if (split[1]) {
        split[1] = split[1].replace(/0+$/, '')
    }
    if (split[1] > 0) {
        return split.join('.')
    } else {
        return split[0]
    }
}
// 对象转css
export function objectToCss(obj) {
    if (!isEmpty(obj) && typeof obj === 'object') {
        return Object.keys(obj).filter(key => !isEmpty(obj[key])).map(key => {
            return `${key.replace(/([A-Z])/, '-$1').toLocaleLowerCase()}:${obj[key]}`
        }).join(';')
    }
    return ''
}
// 获取指定选择器的原生矩形数据
export function getElementRect(selector, context) {
    return new Promise((resolve, reject) => {
        uni.createSelectorQuery()
            .in(context)
            .select(selector)
            .boundingClientRect()
            .exec(res => {
                if (res.length) {
                    resolve(res)
                } else {
                    reject()
                }
            })
    })
}
/**
 * 尽可能小改变指定的数值，让其与原来的值不相同
 * @param {Number} value
 */
export function getDirtyNumber(value) {
    let minus = value < 0
    value = String(Number(Math.abs(value))).split('.')
    if (value.length === 1) {
        // 整数
        let pad = 16 - value[0].length
        if (pad > 0) {
            value[1] = ''.padEnd(pad - 1, '0') + '1'
        } else {
            value[0] = Number(value[0].substring(0, 16)) + 1
        }
    } else {
        let pad1 = 16 - value[0].length
        let pad2 = pad1 - value[1].length
        if (pad2 > 0) {
            value[1] += ''.padEnd(pad2 - 1, '0') + '1'
        } else {
            value[1] = Number(value[1].substring(0, pad1)) + 1
        }
    }
    return Number(value.join('.')) * (minus ? -1 : 1)
}
/**
 * 获取对象的指定属性值
 * @param {Object} obj 需要操作的对象
 * @param {String} key 需要获取的属性名，可以使用链式写法
 * @param {Boolean} consoleError 是否打印错误信息
 */
export function getProperty(obj, key = '', consoleError) {
    try {
        return key.split('.').reduce((data, key) => data[key], obj)
    } catch (err) {
        if (consoleError) console.error(err)
    }
}
/**
 * 坐标点转换，默认腾讯坐标系转换为百度坐标系
 * @param {Array} location [经度, 纬度]
 * @param {Boolean} isTransGCJ02 是否转换为腾讯坐标系
 * @returns {Array} [经度, 纬度]
 */
export function gcoordTransform(location = [], isTransGCJ02 = false) {
    let trans = isTransGCJ02 ? [gcoord.BD09, gcoord.GCJ02] : [gcoord.GCJ02, gcoord.BD09]
    try {
        return gcoord.transform(location, ...trans)
    } catch (err) {
        return [0, 0]
    }
}
/**
 * 获取字典
 * @param {String} typeName 字典类型名称
 */
export function getDict(typeName) {
    return store.state.baseData.dict[typeName] || []
}
/**
 * 获取字典属性
 * @param {Any} value 字典value
 * @param {String} type 字典类型名称
 * @param {String} prop 需要获取的属性名
 */
export function getDictProp(value, type, prop = 'label', defaultValue = '- -') {
    let data = Array.isArray(type) ? type : getDict(type)
    if (Array.isArray(data)) {
        data = data.find(v => v.value === value)
        if (isEmpty(prop)) {
            return data
        } else if (data) {
            return isEmpty(data[prop]) ? defaultValue : data[prop]
        }
    }
    return defaultValue
}
/**
 * 数据类型判断
 * @param {Any} obj 需要判断的对象
 * @param {String} name 数据类型名称（可选，不传时返回类型名称）
 */
export function isType(obj, name) {
    let toString = Object.prototype.toString.call(obj).toLowerCase()
    if (isEmpty(name)) {
        return /^\[object (\w+)\]$/.exec(toString)[1]
    } else {
        return toString === '[object ' + name.toLowerCase() + ']'
    }
}
/**
 * 深度合并对象
 */
export function deepMerge(obj1, obj2) {
    if (isType(obj1, 'object') && isType(obj2, 'object')) {
        Object.keys(obj2).forEach(key => {
            if (isType(obj1[key], 'object')) {
                obj1[key] = deepMerge(obj1[key], obj2[key])
            } else {
                obj1[key] = obj2[key]
            }
        })
        return obj1
    }
    return Object.assign(obj1, obj2)
}

/**
 * 请求超时处理
 * @param {Array[Promise] | Promise} promises Promise对象or列表
 * @param {Number} time 超时时间
 */
export function promiseTimeOut(promise, time = 10000) {
    return new Promise(function(resolve, reject) {
        let hasTimed = false
        let timer = setTimeout(() => {
            hasTimed = true
            reject('处理超时！')
        }, time)
        if (Array.isArray(promise)) {
            Promise.all(promise).then(res => {
                if (!hasTimed) {
                    clearTimeout(timer)
                    resolve(res)
                }
            }).catch(() => {
                if (!hasTimed) reject()
            })
        } else {
            promise.then(res => {
                if (!hasTimed) {
                    clearTimeout(timer)
                    resolve(res)
                }
            }).catch(() => {
                if (!hasTimed) reject()
            })
        }
    })
}

