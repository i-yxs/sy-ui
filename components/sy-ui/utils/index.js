
export const systemInfo = uni.getSystemInfoSync()
// 当前设备系统是否为苹果
export const isIos = systemInfo.platform === 'ios' && !!systemInfo.version
// 当前设备系统是否为安卓
export const isAndroid = systemInfo.platform === 'android' && !!systemInfo.version
// 当前设备系统是否为开发者工具
export const isDevtools = systemInfo.platform === 'devtools'

// 判断是否为空
export function isEmpty(value) {
    return ['', null, void 0].includes(value)
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
export function jsonToCss(obj) {
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
// 尽可能小改变指定的数值，让其与原来的值不相同
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
