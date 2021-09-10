<!--
* @description 日历
* @author yxs
!-->
<template>
    <view class="sy-calendar" catchtouchmove>
        <sy-loading :value="loading" column />
        <view v-if="['date', 'week'].includes(type)" class="week-wrap">
            <view
                v-for="(week, idx) in weeksData"
                :key="idx"
                class="week-item flex-center"
            >
                <view class="date-wrap flex-center">
                    {{ week.label }}
                </view>
            </view>
        </view>
        <view class="toolbar sy-ui-border-top">
            <view class="button flex-center sy-ui-icon-arrow-left" @click="handleLRButtonActive(0)" />
            <view class="label" @click="handleDateTypeChange">
                <view class="text">
                    {{ labelText }}
                </view>
                <view class="icon sy-ui-icon-arrow-right-fill" />
            </view>
            <view class="button flex-center sy-ui-icon-arrow-right" @click="handleLRButtonActive(1)" />
        </view>
        <view class="body-wrap">
            <sy-gesture
                @left="handleGesture(1)"
                @right="handleGesture(2)"
            >
                <sy-transition v-model="slideSwitch" :type="slideType" @end="handleSlideEnd">
                    <template slot="current">
                        <calendar
                            :marker="marker"
                            :config="currentConfig"
                            :selects="selects"
                            @dateActive="handleDateActive"
                            @monthActive="handleMonthActive"
                            @yearActive="handleYearActive"
                        />
                    </template>
                    <template slot="standby">
                        <calendar
                            :marker="marker"
                            :config="standbyConfig"
                            :selects="selects"
                        />
                    </template>
                </sy-transition>
            </sy-gesture>
        </view>
    </view>
</template>
<script>
    // 方法
    import { numberPad } from '@/components/sy-ui/utils'
    import dateTools from '@/components/sy-ui/utils/dateTools'
    // 组件
    import Calendar from './Calendar'
    // 语言配置
    const Language = {
        // 简体中文
        zh: {
            weeks: '一二三四五六日',
            year: '年',
            month: '月'
        }
    }
    /**
     * marker 标记点，在指定日期上显示标记点
     * 格式：
     * {
     *      // 在日期上显示
     *      '2020-01-01': {
     *          top: '',
     *          left: '',
     *          right: '',
     *          bottom: '',
     *          width: '标记点的宽度',
     *          height: '标记点的高度',
     *          text: '标记点的文本'
     *          size: '标记点的文本大小',
     *          color: '标记点的文本颜色',
     *          background: '标记点的背景颜色',
     *      },
     *      // 在月份上显示
     *      '2020-01': {},
     *      // 在年份上显示
     *      '2020': {},
     * }
     */
    export default {
        name: 'SyCalendar',
        components: {
            Calendar
        },
        props: {
            // 选择的值
            value: { type: [String, Number, Array], default: '' },
            // 选择模式 radio：单选 range：范围选择 multiple：多选
            mode: String,
            // 选择类型 date: 日期选择器 week：星期选择器 month：月份选择器 year：年份选择器
            type: { type: String, default: 'date' },
            // 标记点
            marker: { type: [Object, String], default: () => ({}) },
            // 是否加载状态
            loading: { type: Boolean, default: false },
            // 开始日期
            start: [String, Number],
            // 结束日期
            end: [String, Number],
            // 范围选择时选中日期所使用的当日内具体时刻
            defaultTime: Array,
            // 绑定值的格式
            valueFormat: { type: String, default: 'YYYY-MM-DD' },
            // 语言
            language: { type: String, default: 'zh' },
            // 可选择的年份范围（指当前年份的前后多少年份）
            yearRange: { type: Number, default: 100 },
            // 周起始日
            firstDayOfWeek: {
                validator(value) {
                    return value >= 1 && value <= 7
                },
                default: 1
            }
        },
        data() {
            // 获取今天的日期
            var today = new Date()
            var year = today.getFullYear()
            var month = today.getMonth()
            var date = today.getDate()
            return {
                // 保存选中的所有日期
                selects: [],
                // 今天的日期
                toYear: year,
                toMonth: month,
                toDate: date,
                // 视图上显示的日期
                prevYear: year,
                prevMonth: month,
                viewYear: year,
                viewMonth: month,
                // 视图上显示的日期类型
                viewDateType: 0,
                viewDateData: [],
                viewYearData: [],
                // 备用日期数据
                standbyDateData: null,
                standbyYearData: null,
                // 滑动动画
                slideType: '',
                slideSwitch: false
            }
        },
        computed: {
            // 分解日期和时间
            dateTimeValue() {
                if (this.time) {
                    var date = this.selects[this.viewValueIndex]
                    if (date) {
                        return {
                            date: dateTools.format(date.value, 'YYYY-MM-DD'),
                            time: dateTools.format(date.value, 'HH:mm:ss')
                        }
                    }
                }
                return {
                    date: '',
                    time: ''
                }
            },
            // 是否范围选择模式
            isRange() {
                return this.mode === 'range'
            },
            // 周数据列表
            weeksData() {
                var weeks = this.languageConfig.weeks.split('').map((item, index) => {
                    return {
                        label: item,
                        value: index + 1
                    }
                })
                var first = this.firstDayOfWeek - 1
                return weeks.slice(first, 7).concat(weeks.slice(0, first - 7))
            },
            // 当前语言配置
            languageConfig() {
                return Language[this.language]
            },
            // 标签文本
            labelText() {
                switch (this.viewDateType) {
                case 0:
                    return this.viewYear + this.languageConfig.year + numberPad(this.viewMonth + 1) + this.languageConfig.month
                case 1:
                    return this.viewYear + this.languageConfig.year
                case 2:
                    return this.viewYearData[0] + this.languageConfig.year + '-' + this.viewYearData.slice(-1)[0] + this.languageConfig.year
                default:
                    return ''
                }
            },
            // 开始日期
            startDate() {
                if (this.start) {
                    return dateTools.format(this.start, 'YYYY-MM-DD')
                }
                return null
            },
            // 开始日期
            endDate() {
                if (this.end) {
                    return dateTools.format(this.end, 'YYYY-MM-DD')
                }
                return null
            },
            // 当前配置
            currentConfig() {
                return {
                    mode: this.mode,
                    type: this.type,
                    isRange: this.isRange,
                    toYear: this.toYear,
                    toMonth: this.toMonth,
                    toDate: this.toDate,
                    viewYear: this.prevYear,
                    viewMonth: this.prevMonth,
                    viewDateData: this.standbyDateData ? this.standbyDateData : this.viewDateData,
                    viewYearData: this.standbyYearData ? this.standbyYearData : this.viewYearData,
                    viewDateType: this.viewDateType,
                    languageConfig: this.languageConfig
                }
            },
            // 备用配置
            standbyConfig() {
                return {
                    mode: this.mode,
                    type: this.type,
                    isRange: this.isRange,
                    toYear: this.toYear,
                    toMonth: this.toMonth,
                    toDate: this.toDate,
                    viewYear: this.viewYear,
                    viewMonth: this.viewMonth,
                    viewDateData: this.viewDateData,
                    viewYearData: this.viewYearData,
                    viewDateType: this.viewDateType,
                    languageConfig: this.languageConfig
                }
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value, oldVal) {
                    this.setDate(value, oldVal === void 0)
                }
            },
            type: {
                immediate: true,
                handler(value) {
                    switch (value) {
                    case 'date':
                    case 'week':
                        this.viewDateType = 0
                        break
                    case 'month':
                        this.viewDateType = 1
                        break
                    case 'year':
                        this.viewDateType = 2
                        break
                    }
                }
            }
        },
        methods: {
            // 判断指定日期是否可选
            isEnabled(date, showToast = true) {
                var enabled = true
                if (this.startDate) {
                    enabled = date >= this.startDate
                }
                if (this.endDate && enabled) {
                    enabled = date <= this.endDate
                }
                if (showToast && !enabled) {
                    uni.showToast({
                        icon: 'none',
                        title: '该日期不能选择'
                    })
                }
                return enabled
            },
            // 判断平年闰年[四年一闰，百年不闰，四百年再闰]
            isLeapYear(year) {
                return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
            },
            // 设置当前选中的日期
            setDate(value, isUpdateDate) {
                if (value) {
                    var mode = this.mode
                    var type = this.type
                    if (['range', 'multiple'].includes(mode) || type === 'week') {
                        if (Array.isArray(value)) {
                            value = value.map(item => {
                                var date = dateTools.parse(item)
                                return this.getDateObject(date.getFullYear(), date.getMonth(), date.getDate())
                            })
                            if (this.range) {
                                value.sort((a, b) => a.value > b.value ? 1 : -1)
                            }
                            this.selects = value
                        }
                    } else if (mode === 'radio') {
                        if (typeof value === 'string') {
                            var date = dateTools.parse(value)
                            this.selects = [this.getDateObject(date.getFullYear(), date.getMonth(), date.getDate())]
                        }
                    }
                } else {
                    this.selects = []
                }
                this.updateView(isUpdateDate)
            },
            // 设置日期并动画切换到指定视图
            setViewDate(year = this.viewYear, month = this.viewMonth) {
                if (year !== this.viewYear) {
                    this.$emit('yearChange', this.getDateObject(year))
                }
                if (month !== this.viewMonth) {
                    this.$emit('monthChange', this.getDateObject(year, month))
                }
                var [viewYear, viewMonth, prevYear, prevMonth] = [year, month, this.viewYear, this.viewMonth]
                this.slideType = new Date(viewYear, viewMonth, 1) > new Date(prevYear, prevMonth, 1) ? 'slide-left' : 'slide-right'
                this.slideSwitch = true
                this.viewYear = viewYear
                this.viewMonth = viewMonth
                this.prevYear = prevYear
                this.prevMonth = prevMonth
                this.standbyDateData = this.getDateRange(this.prevYear, this.prevMonth)
                this.standbyYearData = this.getYearRange(this.prevYear)
                this.updateView()
            },
            // 更新视图
            updateView(isUpdateDate) {
                if (isUpdateDate) {
                    // 创建组件时，修改视图日期为当前选中的第一个日期
                    if (this.selects[0]) {
                        var year = this.selects[0].year
                        var month = this.selects[0].month
                        this.viewYear = year
                        this.viewMonth = month
                        this.prevYear = year
                        this.prevMonth = month
                    } else {
                        this.viewYear = this.toYear
                        this.viewMonth = this.toMonth
                        this.prevYear = this.toYear
                        this.prevMonth = this.toMonth
                    }
                }
                this.viewYearData = this.getYearRange(this.viewYear)
                this.viewDateData = this.getDateRange(this.viewYear, this.viewMonth)
            },
            // 获取指定日期的星期（ISO）
            getWeekISO(year, month, date) {
                return [7, 1, 2, 3, 4, 5, 6][new Date(year, month, date).getDay()]
            },
            // 获取指定年月的前一个月
            getPrevMonth(year, month) {
                if (month) {
                    month = month - 1
                } else {
                    year = year - 1
                    month = 11
                }
                return [year, month]
            },
            // 获取指定年月的后一个月
            getNextMonth(year, month) {
                if (month < 11) {
                    month = month + 1
                } else {
                    year = year + 1
                    month = 0
                }
                return [year, month]
            },
            // 获取指定年月所有的日期数据及前后月份用于填充的日期数据列表
            getDateRange(year, month) {
                var toList = this.getDateToMonth(year, month)
                var prevList = this.getDateToMonth.apply(0, this.getPrevMonth(year, month))
                var nextList = this.getDateToMonth.apply(0, this.getNextMonth(year, month))
                // 获取月份的第一天所在的星期
                var week = this.getWeekISO(year, month, 1)
                var sIndex = this.weeksData.findIndex(item => item.value === week)
                return prevList.slice(-sIndex || Infinity).concat(toList, nextList.slice(0, 42 - toList.length - sIndex))
            },
            // 获取指定年份所在的年份范围
            getYearRange(year) {
                var prev = this.toYear - this.yearRange
                var next = this.toYear + this.yearRange
                var list = []
                for (var i = prev + (year - prev) - ((year - prev) % 12), e = Math.min(i + 11, next); i <= e; i++) {
                    list.push(i)
                }
                return list
            },
            // 获取指定日期的对象
            getDateObject(year, month = 0, date = 1) {
                var value = year + '-' + numberPad(month + 1) + '-' + numberPad(date)
                return {
                    year,
                    month,
                    date,
                    value,
                    format: value
                }
            },
            // 获取指定月份内的所有日期
            getDateToMonth(year, month) {
                var days = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
                var list = []
                for (var date = 1; date <= days; date++) {
                    list.push(this.getDateObject(year, month, date))
                }
                return list
            },
            // 获取范围选择时的value
            getRangeValue() {
                let defaultTime = this.defaultTime || []
                return this.selects.map((item, index) => {
                    let hms = String(defaultTime[index]).split(/[^\d+]/).filter(v => v)
                    let date = dateTools.parse(item.value)
                    hms[0] && date.setHours(hms[0])
                    hms[1] && date.setMinutes(hms[1])
                    hms[2] && date.setSeconds(hms[2])
                    hms[3] && date.setMilliseconds(hms[3])
                    return dateTools.format(date, this.valueFormat)
                })
            },
            // 点击日期时触发
            handleDateActive(date) {
                if (this.isEnabled(date.value)) {
                    switch (this.type) {
                    case 'date':
                        // 日期选择
                        switch (this.mode) {
                        case 'radio':
                            this.selects = [date]
                            this.$emit('input', dateTools.format(date.value, this.valueFormat))
                            this.$emit('change', date)
                            break
                        case 'range':
                            switch (this.selects.length) {
                            case 1:
                                this.selects.push(date)
                                this.selects = this.selects.sort((a, b) => a.value > b.value ? 1 : -1)
                                this.$emit('input', this.getRangeValue())
                                this.$emit('change', this.selects)
                                break
                            default:
                                this.selects = [date]
                                this.updateView()
                                break
                            }
                            break
                        case 'multiple':
                            var index = this.selects.findIndex(item => item.format === date.format)
                            if (index > -1) {
                                this.selects.splice(index, 1)
                            } else {
                                this.selects.push(date)
                            }
                            this.selects.sort((a, b) => a.value > b.value ? 1 : -1)
                            this.$emit('input', this.getRangeValue())
                            this.$emit('change', this.selects)
                            break
                        default:
                            this.$emit('change', date)
                            break
                        }
                        break
                    case 'week':
                        // 星期选择
                        // 先获取选中日期所在周的第一天
                        date = dateTools.parse(date.value)
                        var w = date.getDay()
                        var d = date.getDate()
                        if (w === 0) {
                            date.setDate(d - 6)
                        } else if (w !== 1) {
                            date.setDate(d - w + 1)
                        }
                        var selects = []
                        selects.push(this.getDateObject(date.getFullYear(), date.getMonth(), date.getDate()))
                        date.setDate(date.getDate() + 6)
                        selects.push(this.getDateObject(date.getFullYear(), date.getMonth(), date.getDate()))
                        this.selects = selects
                        this.$emit('input', this.getRangeValue())
                        this.$emit('change', this.selects)
                    }
                }
            },
            // 点击月份时触发
            handleMonthActive(value) {
                var date = this.getDateObject(this.viewYear, value)
                if (this.type === 'month') {
                    if (this.isEnabled(date.value)) {
                        switch (this.mode) {
                        case 'radio':
                            this.selects = [date]
                            this.$emit('input', dateTools.format(date.value, this.valueFormat))
                            this.$emit('change', date)
                            break
                        case 'range':
                            switch (this.selects.length) {
                            case 1:
                                this.selects.push(date)
                                this.selects = this.selects.sort((a, b) => a.value > b.value ? 1 : -1)
                                this.$emit('input', this.getRangeValue())
                                this.$emit('change', this.selects)
                                break
                            default:
                                this.selects = [date]
                                this.updateView()
                                break
                            }
                            break
                        case 'multiple':
                            var index = this.selects.findIndex(item => item.month === value && item.year === this.viewYear)
                            if (index > -1) {
                                this.selects.splice(index, 1)
                            } else {
                                this.selects.push(date)
                            }
                            this.selects.sort((a, b) => a > b ? 1 : -1)
                            this.$emit('input', this.getRangeValue())
                            this.$emit('change', this.selects)
                            break
                        default:
                            this.$emit('change', date)
                            break
                        }
                    }
                } else {
                    this.viewDateType = 0
                    this.viewMonth = value
                    this.prevMonth = value
                    this.$emit('monthChange', date)
                    this.updateView()
                }
            },
            // 点击年份时触发
            handleYearActive(value) {
                var date = this.getDateObject(value)
                if (this.type === 'year') {
                    if (this.isEnabled(date.value)) {
                        switch (this.mode) {
                        case 'radio':
                            value = this.getDateObject(value)
                            this.selects = [value]
                            this.$emit('input', dateTools.format(value.value, this.valueFormat))
                            this.$emit('change', date)
                            break
                        case 'range':
                            switch (this.selects.length) {
                            case 1:
                                this.selects.push(date)
                                this.selects = this.selects.sort((a, b) => a.value > b.value ? 1 : -1)
                                this.$emit('input', this.getRangeValue())
                                this.$emit('change', this.selects)
                                break
                            default:
                                this.selects = [date]
                                this.updateView()
                                break
                            }
                            break
                        case 'multiple':
                            var index = this.selects.findIndex(item => item.year === value)
                            if (index > -1) {
                                this.selects.splice(index, 1)
                            } else {
                                this.selects.push(date)
                            }
                            this.selects.sort((a, b) => a.value > b.value ? 1 : -1)
                            this.$emit('input', this.getRangeValue())
                            this.$emit('change', this.selects)
                            break
                        default:
                            this.$emit('change', date)
                            break
                        }
                    }
                } else {
                    this.viewDateType = 1
                    this.viewYear = value
                    this.prevYear = value
                    this.$emit('yearChange', date)
                    this.updateView()
                }
            },
            // 切换日期选择类型
            handleDateTypeChange() {
                this.viewDateType = Math.min(++this.viewDateType, 2)
            },
            // 点击左右按钮时触发
            handleLRButtonActive(type) {
                if (!this.slideSwitch) {
                    var params
                    switch (this.viewDateType) {
                    case 0:
                        params = type ? this.getNextMonth(this.viewYear, this.viewMonth) : this.getPrevMonth(this.viewYear, this.viewMonth)
                        break
                    case 1:
                        params = [this.viewYear + (type ? 1 : -1)]
                        break
                    case 2:
                        params = [this.viewYearData.slice(type ? -1 : 0)[0] + (type ? 1 : -1)]
                        break
                    }
                    if (params) {
                        if (
                            params[0] >= this.toYear - this.yearRange &&
                            params[0] <= this.toYear + this.yearRange
                        ) {
                            this.setViewDate.apply(this, params)
                        }
                    }
                }
            },
            // 手势滑动时触发
            handleGesture(type) {
                switch (type) {
                case 1:
                    // 向左
                    this.handleLRButtonActive(1)
                    break
                case 2:
                    // 向右
                    this.handleLRButtonActive(0)
                    break
                }
            },
            // 滑动动画结束时触发
            handleSlideEnd() {
                this.prevYear = this.viewYear
                this.prevMonth = this.viewMonth
                this.standbyDateData = null
                this.standbyYearData = null
            }
        }
    }
</script>
<style lang="scss" scoped>

$itemSize: 66rpx;

.sy-calendar {
    position: relative;
    color: #333;
    .flex-center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .week-wrap {
        display: flex;
        height: 96rpx;
        .week-item {
            flex: 1;
            color: #666;
            font-size: 26rpx;
            font-weight: bold;
            .date-wrap {
                width: 66rpx;
                height: 66rpx;
                border-radius: 50%;
                border: solid 1px transparent;
                box-sizing: border-box;
            }
        }
    }
    .toolbar {
        display: flex;
        padding-top: 15rpx;
        .button {
            width: 40rpx;
            height: 40rpx;
            padding: 15rpx 20rpx;
            font-size: 26rpx;
            &:active {
                color: $APP_COLOR;
            }
        }
        .label {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            &:active {
                .text,
                .icon {
                    color: $APP_COLOR;
                }
            }
            .text {
                font-size: 34rpx;
                color: #333;
                font-weight: bold;
            }
            .icon {
                font-size: 22rpx;
                color: #666;
                transform: rotateZ(90deg);
                margin-left: 15rpx;
            }
        }
    }
    .body-wrap {
        overflow: hidden;
    }
}
</style>

