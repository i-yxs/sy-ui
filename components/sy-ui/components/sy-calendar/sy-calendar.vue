<!--
* @description 日历
* @author yxs
!-->
<template>
    <view class="sy-calendar" catchtouchmove>
        <sy-loading :value="loading" :style="{ borderRadius: '30rpx 30rpx 0 0' }" column text="加载中"/>
        <view v-if="['date', 'week'].includes(type)" class="week-wrap">
            <view
                v-for="(week, idx) in weeksData"
                :key="idx"
                class="week-item flex-center"
            >
                {{ week.label }}
            </view>
        </view>
        <view class="toolbar sy-ui-border-top">
            <view class="button flex-center sy-ui-icon-arrow-left" @click="handleViewChange('left')"/>
            <view class="label" @click="handleDateTypeChange">
                <view class="text">{{ viewDate }}</view>
                <view class="icon sy-ui-icon-arrow-right-fill" />
            </view>
            <view class="button flex-center sy-ui-icon-arrow-right" @click="handleViewChange('right')"/>
        </view>
        <sy-gesture-swiper
            ref="gestureSwiper"
            @change="handleViewChange"
        >
            <template v-slot="{type}">
                <calendar-cell
                    :type="type"
                    provideKey="provideData"
                    @date-click="handleDateClick"
                    @month-click="handleMonthClick"
                    @year-click="handleYearClick"
                />
            </template>
        </sy-gesture-swiper>
    </view>
</template>
<script>
    // 工具
    import props from './props'
    import mixinProps from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'
    import { numberPad } from '../../utils'
    import dateTools from '../../utils/dateTools'
    import Calendar from './Calendar'
    // 组件
    import CalendarCell from './calendar-cell'

    export default {
        name: 'SyCalendar',
        components: {
            CalendarCell
        },
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                // 字典
                dict: {
                    weeks: '一二三四五六日',
                    year: '年',
                    month: '月'
                },
                // 选中的日期
                selected: [],
                // 显示的年月日
                viewYear: 0,
                viewMonth: 0,
                // 显示的日期类型
                viewDateType: 0,
                // 手势滑块组件配置
                swiperConfig: {
                    enter: {
                        viewDateData: [],
                        viewYearData: []
                    },
                    leave: {
                        viewDateData: [],
                        viewYearData: []
                    }
                }
            }
        },
        computed: {
            // 标记点
            markers() {
                if (this.provideData) {
                    return this.provideData.markers || {}
                }
                return {}
            },
            // 视图日期
            viewDate() {
                switch (this.viewDateType) {
                case 0: return this.viewYear + this.dict.year + numberPad(this.viewMonth + 1) + this.dict.month
                case 1: return this.viewYear + this.dict.year
                case 2:
                    var viewYearData = this.swiperConfig.enter.viewYearData
                    return viewYearData[0] + this.dict.year + '-' + viewYearData.slice(-1)[0] + this.dict.year
                }
            },
            // 周数据列表
            weeksData() {
                let weeks = this.dict.weeks.split('').map((label, index) => {
                    return {
                        label,
                        value: index + 1
                    }
                })
                let first = this.firstDayOfWeek - 1
                return weeks.slice(first, 7).concat(weeks.slice(0, first - 7))
            }
        },
        watch: {
            '__props.type': {
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
            },
            '__props.value'(value) {
                this.$calendar.set(value)
                this.updateViewData()
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        created() {
            this.$calendar = new Calendar(this)
            // 创建组件时，设置视图年月为当前选中的第一个日期的年月
            let selected = this.selected[0]
            if (selected) {
                this.viewYear = selected.year
                this.viewMonth = selected.month
            } else {
                this.viewYear = this.$calendar.toYear
                this.viewMonth = this.$calendar.toMonth
            }
            this.updateViewData()
        },
        methods: {
            // 设置日期并动画切换到指定视图
            setViewDate(year = this.viewYear, month = this.viewMonth) {
                if (year !== this.viewYear) {
                    this.$emit('year-change', this.$calendar.createDate(year))
                }
                if (month !== this.viewMonth) {
                    this.$emit('month-change', this.$calendar.createDate(year, month))
                }
                this.swiperConfig.leave = { ...this.swiperConfig.enter }
                this.swiperConfig.enter = {
                    viewYear: year,
                    viewMonth: month,
                    viewYearData: this.$calendar.getYearRange(year),
                    viewDateData: this.$calendar.getDateRange(year, month)
                }
                this.$refs.gestureSwiper.play(new Date(year, month, 1) > new Date(this.viewYear, this.viewMonth, 1) ? 'left' : 'right')
                this.viewYear = year
                this.viewMonth = month
            },
            // 获取范围选择时的value
            getRangeValue() {
                let defaultTime = this.__props.defaultTime || []
                return this.selected.map((item, index) => {
                    let hms = String(defaultTime[index]).split(/[^\d+]/).filter(v => v)
                    let date = dateTools.parse(item.value)
                    hms[0] && date.setHours(hms[0])
                    hms[1] && date.setMinutes(hms[1])
                    hms[2] && date.setSeconds(hms[2])
                    hms[3] && date.setMilliseconds(hms[3])
                    return dateTools.format(date, this.__props.valueFormat)
                })
            },
            // 获取当前视图的日期范围
            getDateRangeToView() {
                let {
                    viewYear,
                    viewYearData,
                    viewDateData
                } = this.swiperConfig.enter
                switch (this.__props.type) {
                case 'date':
                case 'week':
                    return [
                        viewDateData[0].format,
                        viewDateData.at(-1).format
                    ]
                case 'month':
                    return [
                        `${viewYear}-01-01`,
                        `${viewYear}-12-01`
                    ]
                case 'year':
                    return [
                        viewYearData[0].format,
                        viewYearData.at(-1).format
                    ]
                }
            },
            // 获取月份格式化文本
            getMonthFormat(month) {
                return this.viewYear + '-' + numberPad(month + 1)
            },
            // 更新视图数据
            updateViewData() {
                this.swiperConfig.enter = {
                    viewYear: this.viewYear,
                    viewMonth: this.viewMonth,
                    viewYearData: this.$calendar.getYearRange(this.viewYear),
                    viewDateData: this.$calendar.getDateRange(this.viewYear, this.viewMonth)
                }
            },
            // 点击日期时触发
            handleDateClick(date) {
                if (this.isEmpty(this.__props.mode)) return
                switch (this.__props.type) {
                case 'date':
                    // 日期选择
                    if (this.$calendar.isOptional(date.value)) {
                        switch (this.__props.mode) {
                        case 'radio':
                            this.selected = [date]
                            this.$emit('input', dateTools.format(date.value, this.__props.valueFormat))
                            this.$emit('change', date)
                            break
                        case 'range':
                            switch (this.selected.length) {
                            case 1:
                                this.selected.push(date)
                                this.selected = this.selected.sort((a, b) => a.value > b.value ? 1 : -1)
                                this.$emit('input', this.getRangeValue())
                                this.$emit('change', this.selected)
                                break
                            default:
                                this.selected = [date]
                                this.updateViewData()
                                break
                            }
                            break
                        case 'multiple':
                            var index = this.selected.findIndex(item => item.format === date.format)
                            if (index > -1) {
                                this.selected.splice(index, 1)
                            } else {
                                this.selected.push(date)
                            }
                            this.selected.sort((a, b) => a.value > b.value ? 1 : -1)
                            this.$emit('input', this.getRangeValue())
                            this.$emit('change', this.selected)
                            break
                        default:
                            this.$emit('change', date)
                            break
                        }
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
                    var selected = []
                    selected.push(this.$calendar.createDate(date.getFullYear(), date.getMonth(), date.getDate()))
                    date.setDate(date.getDate() + 6)
                    selected.push(this.$calendar.createDate(date.getFullYear(), date.getMonth(), date.getDate()))
                    if (this.$calendar.isOptional(selected[0].value) && this.$calendar.isOptional(selected.slice(-1)[0].value)) {
                        this.selected = selected
                        this.$emit('input', this.getRangeValue())
                        this.$emit('change', this.selected)
                    }
                }
            },
            // 点击月份时触发
            handleMonthClick(value) {
                if (this.isEmpty(this.__props.mode)) return
                let date = this.$calendar.createDate(this.viewYear, value)
                if (this.__props.type === 'month') {
                    if (this.$calendar.isOptional(date.value)) {
                        switch (this.__props.mode) {
                        case 'radio':
                            this.selected = [date]
                            this.$emit('input', dateTools.format(date.value, this.__props.valueFormat))
                            this.$emit('change', date)
                            break
                        case 'range':
                            switch (this.selected.length) {
                            case 1:
                                this.selected.push(date)
                                this.selected = this.selected.sort((a, b) => a.value > b.value ? 1 : -1)
                                this.$emit('input', this.getRangeValue())
                                this.$emit('change', this.selected)
                                break
                            default:
                                this.selected = [date]
                                this.updateViewData()
                                break
                            }
                            break
                        case 'multiple':
                            var index = this.selected.findIndex(item => item.month === value && item.year === this.viewYear)
                            if (index > -1) {
                                this.selected.splice(index, 1)
                            } else {
                                this.selected.push(date)
                            }
                            this.selected.sort((a, b) => a > b ? 1 : -1)
                            this.$emit('input', this.getRangeValue())
                            this.$emit('change', this.selected)
                            break
                        default:
                            this.$emit('change', date)
                            break
                        }
                    }
                } else {
                    this.viewDateType = 0
                    this.viewMonth = value
                    this.$emit('month-change', date)
                    this.updateViewData()
                }
            },
            // 点击年份时触发
            handleYearClick(value) {
                if (this.isEmpty(this.__props.mode)) return
                let date = this.$calendar.createDate(value)
                if (this.__props.type === 'year') {
                    if (this.$calendar.isOptional(date.value)) {
                        switch (this.__props.mode) {
                        case 'radio':
                            value = this.$calendar.createDate(value)
                            this.selected = [value]
                            this.$emit('input', dateTools.format(value.value, this.__props.valueFormat))
                            this.$emit('change', date)
                            break
                        case 'range':
                            switch (this.selected.length) {
                            case 1:
                                this.selected.push(date)
                                this.selected = this.selected.sort((a, b) => a.value > b.value ? 1 : -1)
                                this.$emit('input', this.getRangeValue())
                                this.$emit('change', this.selected)
                                break
                            default:
                                this.selected = [date]
                                this.updateViewData()
                                break
                            }
                            break
                        case 'multiple':
                            var index = this.selected.findIndex(item => item.year === value)
                            if (index > -1) {
                                this.selected.splice(index, 1)
                            } else {
                                this.selected.push(date)
                            }
                            this.selected.sort((a, b) => a.value > b.value ? 1 : -1)
                            this.$emit('input', this.getRangeValue())
                            this.$emit('change', this.selected)
                            break
                        default:
                            this.$emit('change', date)
                            break
                        }
                    }
                } else {
                    this.viewDateType = 1
                    this.viewYear = value
                    this.$emit('year-change', date)
                    this.updateViewData()
                }
            },
            // 视图年月改变时触发
            handleViewChange(type) {
                if (this.$refs.gestureSwiper.playing) return
                let params
                let isLeft = type === 'left'
                switch (this.viewDateType) {
                case 0:
                    params = isLeft ? this.$calendar.getNextMonth(this.viewYear, this.viewMonth) : this.$calendar.getPrevMonth(this.viewYear, this.viewMonth)
                    break
                case 1:
                    params = [this.viewYear + (isLeft ? 1 : -1)]
                    break
                case 2:
                    params = [this.swiperConfig.enter.viewYearData.slice(isLeft ? -1 : 0)[0] + (isLeft ? 1 : -1)]
                    break
                }
                if (params) {
                    if (
                        params[0] >= this.$calendar.toYear - this.yearRange &&
                        params[0] <= this.$calendar.toYear + this.yearRange
                    ) {
                        this.setViewDate.apply(this, params)
                    }
                }
            },
            // 切换日期选择类型
            handleDateTypeChange() {
                this.viewDateType = Math.min(++this.viewDateType, 2)
            }
        }
    }
</script>
<style lang="scss" scoped>
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
}
</style>

