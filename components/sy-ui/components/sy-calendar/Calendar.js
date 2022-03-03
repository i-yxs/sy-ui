
import { isEmpty, numberPad } from '../../utils'
import dateTools from '../../utils/dateTools'

class Calendar {
    constructor($vue) {
        // 组件的vue实例
        this.$vue = $vue
        // 今天的年月日
        let today = new Date()
        this.toYear = today.getFullYear()
        this.toMonth = today.getMonth()
        this.toDate = today.getDate()

        this.set(this.$vue.__props.value)
    }
    // 设置当前选中的日期
    set(value) {
        if (value) {
            let mode = this.$vue.__props.mode
            let type = this.$vue.__props.type
            if (['range', 'multiple'].includes(mode) || type === 'week') {
                if (Array.isArray(value)) {
                    value = value.map(item => {
                        let date = dateTools.parse(item)
                        return this.createDate(date.getFullYear(), date.getMonth(), date.getDate())
                    })
                    if (this.$vue.__props.range) {
                        value.sort((a, b) => a.value > b.value ? 1 : -1)
                    }
                    this.$vue.selected = value
                }
            } else if (typeof value === 'string') {
                let date = dateTools.parse(value)
                this.$vue.selected = [this.createDate(date.getFullYear(), date.getMonth(), date.getDate())]
            }
        } else {
            this.$vue.selected = []
        }
    }
    // 创建指定日期的对象
    createDate(year, month = 0, date = 1) {
        return {
            year,
            month,
            date,
            value: new Date(year, month, date),
            format: `${year}-${numberPad(month + 1)}-${numberPad(date)}`
        }
    }
    // 判断指定日期是否可选
    isOptional(date, showToast = true) {
        let {
            min,
            max,
            type
        } = this.$vue.__props
        let format = ''
        switch (type) {
        case 'date':
        case 'week':
            format = 'YYYY-MM-DD'
            break
        case 'month':
            format = 'YYYY-MM'
            break
        case 'year':
            format = 'YYYY'
            break
        }
        date = dateTools.parse(date)
        if (!isEmpty(min)) {
            min = dateTools.parse(min)
            if (date < min) {
                if (showToast) {
                    this.$vue.showToast(`选择的日期不能早于${dateTools.format(min, format)}`)
                }
                return false
            }
        }
        if (!isEmpty(max)) {
            max = dateTools.parse(max)
            if (date > max) {
                if (showToast) {
                    this.$vue.showToast(`选择的日期不能晚于${dateTools.format(max, format)}`)
                }
                return false
            }
        }
        return true
    }
    // 判断平年闰年[四年一闰，百年不闰，四百年再闰]
    isLeapYear(year) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
    }
    // 获取指定日期的星期（ISO）
    getWeekISO(year, month, date) {
        return [7, 1, 2, 3, 4, 5, 6][new Date(year, month, date).getDay()]
    }
    // 获取指定年月的前一个月
    getPrevMonth(year, month) {
        if (month) {
            month = month - 1
        } else {
            year = year - 1
            month = 11
        }
        return [year, month]
    }
    // 获取指定年月的后一个月
    getNextMonth(year, month) {
        if (month < 11) {
            month = month + 1
        } else {
            year = year + 1
            month = 0
        }
        return [year, month]
    }
    // 获取指定年月所有的日期数据及前后月份用于填充的日期数据列表
    getDateRange(year, month) {
        let toList = this.getDateToMonth(year, month)
        let prevList = this.getDateToMonth.apply(this, this.getPrevMonth(year, month))
        let nextList = this.getDateToMonth.apply(this, this.getNextMonth(year, month))
        // 获取月份的第一天所在的星期
        let week = this.getWeekISO(year, month, 1)
        let sIndex = this.$vue.weeksData.findIndex(item => item.value === week)
        return prevList.slice(-sIndex || Infinity).concat(toList, nextList.slice(0, 42 - toList.length - sIndex))
    }
    // 获取指定年份所在的年份范围
    getYearRange(year) {
        let range = this.$vue.__props.yearRange
        let prev = this.toYear - range
        let next = this.toYear + range
        let list = []
        for (
            let i = prev + (year - prev) - ((year - prev) % 12),
                e = Math.min(i + 11, next);
            i <= e;
            i++
        ) {
            list.push(i)
        }
        return list
    }
    // 获取指定年月内的所有日期
    getDateToMonth(year, month) {
        let days = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        let list = []
        for (let date = 1; date <= days; date++) {
            list.push(this.createDate(year, month, date))
        }
        return list
    }
}
export default Calendar
