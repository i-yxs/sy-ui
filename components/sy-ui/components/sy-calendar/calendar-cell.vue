<!--
* @description 日历
* @author 易超
!-->
<template>
    <view class="calendar-cell">
        <!-- 天 -->
        <view
            v-if="['date', 'week'].includes(calendarProps.type)"
            :class="{
                'visible': viewDateType === 0,
                'zoom-out': viewDateType > 0
            }"
            data-type="date"
            class="table"
        >
            <view
                v-for="item in viewDateData"
                :key="item.format"
                :class="{
                    range: isRange,
                    close: isClose(item, 'date'),
                    start: isStart(item, 'date'),
                    current: isCurrent(item, 'date'),
                    selected: isSelectedDate(item),
                }"
                class="cell min flex-center"
                @click="handleDateClick(item)"
            >
                <view
                    :class="{gray: item.month !== viewMonth}"
                    class="text flex-center sy-ui-din-medium"
                >
                    {{ item.date | numberPad }}
                    <calendar-marker v-if="markers[item.format]" :date="item.format" />
                </view>
            </view>
        </view>
        <!-- 月 -->
        <view
            v-if="calendarProps.type !== 'year'"
            :class="{
                'visible': viewDateType === 1,
                'zoom-in': viewDateType < 1,
                'zoom-out': viewDateType > 1
            }"
            data-type="month"
            class="table"
        >
            <view
                v-for="month in monthData"
                :key="month"
                :class="{
                    range: isRange,
                    close: isClose(month, 'month'),
                    start: isStart(month, 'month'),
                    current: isCurrent(month, 'month'),
                    selected: isSelectedMonth(month),
                }"
                class="cell big flex-center"
                @click="handleMonthClick(month)"
            >
                <view class="text flex-center sy-ui-din-medium">
                    {{ month + 1 }}{{ dict.month }}
                    <calendar-marker v-if="markers[getMonthFormat(month)]" :date="getMonthFormat(month)" />
                </view>
            </view>
        </view>
        <!-- 年 -->
        <view
            :class="{
                'visible': viewDateType === 2,
                'zoom-in': viewDateType < 2
            }"
            data-type="year"
            class="table"
        >
            <view
                v-for="year in viewYearData"
                :key="year"
                :class="{
                    range: isRange,
                    close: isClose(year, 'year'),
                    start: isStart(year, 'year'),
                    current: isCurrent(year, 'year'),
                    selected: isSelectedYear(year),
                }"
                class="cell big flex-center"
                @click="handleYearClick(year)"
            >
                <view class="text flex-center sy-ui-din-medium">
                    {{ year }}
                    <calendar-marker v-if="markers[year]" :date="year" />
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { numberPad } from '../../utils'
    // 组件
    import CalendarMarker from './calendar-marker'

    export default {
        name: 'CalendarCell',
        components: {
            CalendarMarker
        },
        props: {
            type: { type: String, default: 'enter' }
        },
        data() {
            return {
                monthData: new Array(12).fill(0).map((_, i) => i)
            }
        },
        inject: ['provideComponent'],
        computed: {
            dict() {
                return this.provideComponent.dict
            },
            markers() {
                return this.provideComponent.markers
            },
            isRange() {
                return this.calendarProps.mode === 'range' || this.calendarProps.type === 'week'
            },
            selected() {
                return this.provideComponent.selected
            },
            viewYear() {
                return this.provideComponent.swiperConfig[this.type].viewYear
            },
            viewMonth() {
                return this.provideComponent.swiperConfig[this.type].viewMonth
            },
            viewDateData() {
                return this.provideComponent.swiperConfig[this.type].viewDateData
            },
            viewYearData() {
                return this.provideComponent.swiperConfig[this.type].viewYearData
            },
            viewDateType() {
                return this.provideComponent.viewDateType
            },
            calendarProps() {
                return this.provideComponent.__props
            }
        },
        methods: {
            // 指定日期是否为选中的最早日期
            isStart(value, type) {
                let selected = this.selected
                if (selected.length) {
                    let date = selected[0]
                    switch (type) {
                    case 'date':
                        return date.format === value.format
                    case 'month':
                        return date.month === value && this.viewYear === date.year
                    case 'year':
                        return date.year === value
                    }
                }
                return false
            },
            // 指定日期是否为选中的最晚日期
            isClose(value, type) {
                let selected = this.selected
                if (selected.length) {
                    let date = selected.slice(-1)[0]
                    switch (type) {
                    case 'date':
                        return date.format === value.format
                    case 'month':
                        return date.month === value && this.viewYear === date.year
                    case 'year':
                        return date.year === value
                    }
                }
                return false
            },
            // 指定日期是否为今天
            isCurrent(value, type) {
                switch (type) {
                case 'date':
                    return this.provideComponent.$calendar.toDate === value.date && this.provideComponent.$calendar.toMonth === value.month && this.provideComponent.$calendar.toYear === value.year
                case 'month':
                    return this.provideComponent.$calendar.toMonth === value && this.provideComponent.$calendar.toYear === this.viewYear
                case 'year':
                    return this.provideComponent.$calendar.toYear === value
                }
            },
            // 判断指定日期是否选中
            isSelectedDate(date) {
                let mode = this.calendarProps.mode
                let type = this.calendarProps.type
                let selected = this.selected
                if (mode === 'range' || type === 'week') {
                    switch (selected.length) {
                    case 0: return false
                    case 1:
                        return selected[0].format === date.format
                    default:
                        return selected[0].value <= date.value && selected.slice(-1)[0].value >= date.value
                    }
                } else if (mode === 'radio') {
                    if (selected[0]) {
                        return selected[0].format === date.format
                    }
                    return false
                } else if (mode === 'multiple') {
                    return !!selected.find(item => item.format === date.format)
                }
            },
            // 判断指定月份是否选中
            isSelectedMonth(month) {
                let selected = this.selected
                switch (this.calendarProps.mode) {
                case 'radio':
                    if (selected[0]) {
                        return selected[0].month === month && selected[0].year === this.viewYear
                    }
                    return false
                case 'range':
                    if (selected.length === 0) {
                        return false
                    } else if (selected.length === 1) {
                        return selected[0].month === month && selected[0].year === this.viewYear
                    } else {
                        let date = new Date(this.viewYear, month, 1)
                        let sdate = new Date(selected[0].year, selected[0].month, 1)
                        let edate = new Date(selected.slice(-1)[0].year, selected.slice(-1)[0].month, 1)
                        return sdate <= date && edate >= date
                    }
                case 'multiple':
                    return !!selected.find(item => item.month === month && item.year === this.viewYear)
                }
            },
            // 判断指定年份是否选中
            isSelectedYear(year) {
                let selected = this.selected
                switch (this.calendarProps.mode) {
                case 'radio':
                    if (selected[0]) {
                        return selected[0].year === year
                    }
                    return false
                case 'range':
                    if (selected.length === 0) {
                        return false
                    } else if (selected.length === 1) {
                        return selected[0].year === year
                    } else {
                        return selected[0].year <= year && selected.slice(-1)[0].year >= year
                    }
                case 'multiple':
                    return !!selected.find(item => item.year === year)
                }
            },
            // 获取月份格式化文本
            getMonthFormat(month) {
                return this.viewYear + '-' + numberPad(month + 1)
            },
            // 点击日期时触发
            handleDateClick(date) {
                this.$emit('date-click', date)
            },
            // 点击月份时触发
            handleMonthClick(month) {
                this.$emit('month-click', month)
            },
            // 点击年份时触发
            handleYearClick(year) {
                this.$emit('year-click', year)
            }
        }
    }
</script>
<style lang="scss" scoped>
.calendar-cell {
    position: relative;
    height: 480rpx;
    .flex-center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .table {
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        height: 480rpx;
        opacity: 0;
        display: flex;
        flex-wrap: wrap;
        pointer-events: none;
        transform: scale3d(1, 1, 1);
        transition: .3s ease-in-out;
        &.visible {
            opacity: 1;
            pointer-events: initial;
        }
        &.zoom-in {
            transform: scale3d(1.5, 1.5, 1);
        }
        &.zoom-out {
            transform: scale3d(.75, .75, 1);
        }
        .cell {
            position: relative;
            width: calc(100% / 7);
            height: 80rpx;
            .text {
                position: relative;
                z-index: 2;
                border-radius: 50%;
                border: solid 1px transparent;
                box-sizing: border-box;
                &.gray {
                    color: #bbb;
                }
            }
            &.min {
                width: calc(100% / 7);
                height: 80rpx;
                font-size: 28rpx;
                .text {
                    width: 66rpx;
                    height: 66rpx;
                }
                &::before {
                    height: 66rpx;
                }
                &:nth-child(7n + 1) {
                    &.selected {
                        &::before {
                            display: none;
                        }
                    }
                }
            }
            &.big {
                width: calc(100% / 4);
                height: 160rpx;
                font-size: 32rpx;
                .text {
                    width: 140rpx;
                    height: 140rpx;
                }
                &::before {
                    height: 140rpx;
                }
                &:nth-child(4n + 1) {
                    &.selected {
                        &::before {
                            display: none;
                        }
                    }
                }
            }
            &:active {
                .text {
                    background: #f5f5f5;
                }
            }
            &.current {
                .text {
                    background: rgba($APP_COLOR, .1);
                    border-color: $APP_COLOR;
                }
            }
            &.selected {
                &.range {
                    .text {
                        border-radius: 0;
                    }
                    & + .selected {
                        &::before {
                            content: '';
                            position: absolute;
                            left: -50%;
                            right: 50%;
                            background: $APP_BACKGROUND;
                        }
                    }
                    &.start {
                        .text {
                            border-radius: 50% 0 0 50%;
                        }
                    }
                    &.close {
                        .text {
                            border-radius: 0 50% 50% 0;
                        }
                    }
                    &.start.close {
                        .text {
                            border-radius: 50%;
                        }
                    }
                }
                .text {
                    color: #fff;
                    background: $APP_BACKGROUND;
                }
            }
        }
    }
}
</style>

