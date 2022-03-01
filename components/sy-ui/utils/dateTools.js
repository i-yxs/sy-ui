
const Weeks = ['日', '一', '二', '三', '四', '五', '六']

export default {
    /**
     * 解析日期字符串，返回Date对象
     * @param String value 需要解析的日期字符串or时间戳
     */
    parse(value) {
        let date
        if (value instanceof Date) {
            date = value
        } else {
            switch (typeof value) {
            case 'number':
                date = new Date(value)
                break
            case 'string':
                date = new Date()
                var strs = String(value).split(/[^\d+]/).filter(v => v)
                if (strs.length) {
                    if (strs[0].length === 4) {
                        date.setFullYear(strs[0])
                        date.setMonth((strs[1] || 1) - 1)
                        date.setDate(strs[2] || 1)
                        date.setHours(strs[3] || 0)
                        date.setMinutes(strs[4] || 0)
                        date.setSeconds(strs[5] || 0)
                        date.setMilliseconds(strs[6] || 0)
                    } else {
                        date.setHours(strs[0] || 0)
                        date.setMinutes(strs[1] || 0)
                        date.setSeconds(strs[2] || 0)
                        date.setMilliseconds(strs[3] || 0)
                    }
                }
                break
            }
        }
        return date
    },
    /**
     * 格式化Date对象，返回指定格式的日期字符串
     * @param String date 需要处理的Date对象 | 日期字符串
     * @param String format 格式字符串
     */
    format(date, format) {
        date = this.parse(date)
        if (date instanceof Date) {
            var option = {
                'Y+': date.getFullYear().toString(), // 年
                'M+': (date.getMonth() + 1).toString(), // 月
                'D+': date.getDate().toString(), // 日
                'H+': date.getHours().toString(), // 24小时制
                'h+': ((date.getHours() % 12) || 12).toString(), // 12小时制
                'm+': date.getMinutes().toString(), // 分
                's+': date.getSeconds().toString(), // 秒
                'S+': date.getMilliseconds().toString() // 毫秒
            }
            for (var key in option) {
                while (new RegExp('(' + key + ')', 'g').test(format)) {
                    let value = option[key]
                    if (key === 'Y+') {
                        value = value.slice(-RegExp.$1.length)
                    }
                    format = format.replace(new RegExp(RegExp.$1), value.padStart(RegExp.$1.length, '0'))
                }
            }
            // 星期几
            if (/(d+)/i.test(format)) {
                format = format.replace(new RegExp(RegExp.$1, 'g'), Weeks[date.getDay()])
            }
            // 年份的第几周
            if (/(W+)/i.test(format)) {
                var d1 = new Date(date)
                var d2 = new Date(date)
                d2.setMonth(0)
                d2.setDate(1)
                format = format.replace(new RegExp(RegExp.$1, 'g'), String(Math.ceil(Math.ceil((d1 - d2) / 864e5) / 7)).padStart(RegExp.$1.length, '0'))
            }
            // 季度
            if (/(q+)/i.test(format)) {
                format = format.replace(new RegExp(RegExp.$1, 'g'), Weeks[Math.ceil(option['M+'] / 3)])
            }
            return format
        }
    },
    /**
     * 指定一个未来日期，返回相距当前日期时间的包含日期数据的对象
     * “{}”包裹的单位及比它大的单位小于等于0时不会返回，每次只能包裹一个单位
     * @param String future 未来的某个日期
     * @param String units 需要返回的日期单位（YMDHmsS）
     * @param String current 当前的日期（可选，默认当前设备日期）
     */
    apart(future, format, current) {
        future = this.parse(future)
        current = this.parse(current) || new Date()
        if (future instanceof Date && current instanceof Date) {
            var Y1 = current.getFullYear()
            var M1 = current.getMonth()
            var D1 = current.getDate()
            var Y2 = future.getFullYear()
            var M2 = future.getMonth()
            var D2 = future.getDate()
            var Y = Math.max(Y2 - Y1 + (M1 * 100 + D1 > M2 * 100 + D2 ? -1 : 0), 0)
            var M = Math.max((Y2 - Y1) * 12 + M2 - M1 + (D1 > D2 ? -1 : 0), 0)
            var S = Math.max(future.getTime() - current.getTime(), 0)
            var s = Math.max(S / 1e3, 0)
            var m = Math.max(s / 60, 0)
            var h = Math.max(m / 60, 0)
            var D = Math.max(h / 24, 0)
            // 如果format存在月份，因为每个月份的天数不固定，所以无法得到剩余天数
            // 所以这里的月份减一，剩余天数 = 当前月份的剩余天数 + 未来日期的天数 - 1
            if (/M/.test(format) && M > 0) {
                M = D1 > D2 ? M : M - 1
                D = (new Date(Y1, M1 + 1, 0)).getDate() - D1 + D2 - 1
            }
            var data = {}
            var option = [
                { key: 'Y', value: Y },
                { key: 'M', size: 12, value: M },
                { key: 'D', value: D },
                { key: 'H', size: 24, value: h },
                { key: 'm', size: 60, value: m },
                { key: 's', size: 60, value: s },
                { key: 'S', size: 1e3, value: S }
            ]
            option.forEach((item, index) => {
                if (format.indexOf(item.key) > -1) {
                    let value = item.value
                    if (item.size && option[index - 1].value > 0) {
                        value = value % item.size
                    }
                    item.value = Math.floor(value)
                    var optional = new RegExp(`\{([${item.key}])+[^\}]+\}`).test(format)
                    var optionalText = RegExp['$&']
                    // 如果value大于0，或没有被“{}”包裹才返回该单位
                    if (item.value || !optional) {
                        if (new RegExp('(' + item.key + '+)').test(format)) {
                            data[item.key] = String(item.value).padStart(RegExp.$1.length, '0')
                        }
                    }
                    if (item.value || !optional) {
                        format = format.replace(new RegExp('(' + item.key + '+)'), data[item.key])
                    } else {
                        format = format.replace(new RegExp(optionalText), '')
                    }
                } else {
                    item.value = 0
                }
            })
            format = format.replace(/[\{\}]/g, '')
            return { data, format }
        }
        return {}
    },
    /**
     * 传入一个过去的日期，返回相距当前日期的友好时间格式
     * @param String date 过去的日期
     * @param String current 当前的日期（可选，默认当前设备日期）
     */
    friendly(date, current) {
        date = this.parse(date)
        current = this.parse(current) || new Date()
        if (date instanceof Date) {
            let nowTime = current.getTime() / 1000
            let pastTime = date.getTime() / 1000
            if (pastTime < nowTime) {
                let diff = nowTime - pastTime
                if (diff > 86400) {
                    let day = Math.floor(diff / 86400)
                    if (day < 30) {
                        return day + '天前'
                    } else if (day < 360) {
                        return Math.floor(day / 30) + '个月前'
                    } else {
                        return Math.floor(day / 360) + '年前'
                    }
                } else if (diff > 3600) {
                    return Math.floor(diff / 3600) + '小时前'
                } else if (diff > 60) {
                    return Math.floor(diff / 60) + '分钟前'
                } else {
                    return diff + '秒前'
                }
            }
        }
        return '未知'
    }
}
