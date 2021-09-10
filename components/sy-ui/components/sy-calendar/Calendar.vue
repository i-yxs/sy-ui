<!--
* @description 日历
* @author 易超
!-->
<template>
    <view class="calendar">
        <!-- 天 -->
        <view
            v-if="['date', 'week'].includes(config.type)"
            :class="{visible: config.viewDateType === 0, 'zoom-out': config.viewDateType}"
            class="tabel-wrap"
        >
            <view
                v-for="item in config.viewDateData"
                :key="item.format"
                :class="{range: config.isRange, select: isSelectDate(item), current: isToday(item), fringe: isFringe(item)}"
                class="min-cell flex-center"
                @click="handleDateActive(item)"
            >
                <view :class="{gray: item.month !== config.viewMonth}" class="date-wrap flex-center sy-ui-din-medium">
                    {{ item.date | numberPad }}
                    <calendar-marker v-if="markerConfig[item.format]" :config="markerConfig[item.format]" />
                </view>
            </view>
        </view>
        <!-- 月 -->
        <view
            v-if="!['year'].includes(config.type)"
            :class="{visible: config.viewDateType === 1, 'zoom-in': config.viewDateType < 1, 'zoom-out': config.viewDateType > 1}"
            class="tabel-wrap"
        >
            <view
                v-for="month in monthData"
                :key="month"
                :class="{select: isSelectMonth(month), current: isThisMonth(month)}"
                class="big-cell flex-center"
                @click="handleMonthActive(month)"
            >
                <view class="item-wrap flex-center sy-ui-din-medium">
                    {{ month + 1 }}{{ config.languageConfig.month }}
                    <calendar-marker v-if="markerConfig[getMonthFormat(month)]" :config="markerConfig[getMonthFormat(month)]" />
                </view>
            </view>
        </view>
        <!-- 年 -->
        <view :class="{visible: config.viewDateType === 2, 'zoom-in': config.viewDateType < 2}" class="tabel-wrap">
            <view
                v-for="year in config.viewYearData"
                :key="year"
                :class="{select: isSelectYear(year), current: isThisYear(year)}"
                class="big-cell flex-center"
                @click="handleYearActive(year)"
            >
                <view class="item-wrap flex-center sy-ui-din-medium">
                    {{ year }}
                    <calendar-marker v-if="markerConfig[year]" :config="markerConfig[year]" />
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import { numberPad } from '@/components/sy-ui/utils'
    // 组件
    import CalendarMarker from './CalendarMarker'

    export default {
        name: 'Calendar',
        components: {
            CalendarMarker
        },
        props: {
            // 配置
            config: {
                type: Object,
                default: () => ({})
            },
            // 选中列表
            selects: {
                type: Array,
                default: () => []
            },
            // 标记点
            marker: {
                type: [Object, String],
                default: () => ({})
            }
        },
        data() {
            for (var i = 0, monthData = []; i < 12; i++) {
                monthData.push(i)
            }
            return {
                monthData
            }
        },
        computed: {
            markerConfig() {
                if (typeof this.marker === 'string') {
                    return JSON.parse(this.marker)
                }
                return this.marker || {}
            }
        },
        methods: {
            // 判断指定日期是否今天
            isToday(date) {
                return this.config.toDate === date.date && this.config.toMonth === date.month && this.config.toYear === date.year
            },
            // 判断指定日期是否当月
            isThisMonth(month) {
                return this.config.toMonth === month && this.config.toYear === this.config.viewYear
            },
            // 判断指定日期是否今年
            isThisYear(year) {
                return this.config.toYear === year
            },
            // 判断指定日期是否选中
            isSelectDate(date) {
                var mode = this.config.mode
                var type = this.config.type
                if (mode === 'range' || type === 'week') {
                    switch (this.selects.length) {
                    case 0: return false
                    case 1:
                        return this.selects[0].format === date.format
                    default:
                        return this.selects[0].value <= date.value && this.selects[1].value >= date.value
                    }
                } else if (mode === 'radio') {
                    if (this.selects[0]) {
                        return this.selects[0].format === date.format
                    }
                    return false
                } else if (mode === 'multiple') {
                    return !!this.selects.find(item => item.format === date.format)
                }
            },
            // 判断指定月份是否选中
            isSelectMonth(month) {
                switch (this.config.mode) {
                case 'radio':
                    if (this.selects[0]) {
                        return this.selects[0].month === month && this.selects[0].year === this.config.viewYear
                    }
                    return false
                case 'range':
                    switch (this.selects.length) {
                    case 0: return false
                    case 1: return this.selects[0].month === month && this.selects[0].year === this.config.viewYear
                    default:
                        var date = new Date(this.config.viewYear, month, 1)
                        var sDate = new Date(this.selects[0].year, this.selects[0].month, 1)
                        var eDate = new Date(this.selects[1].year, this.selects[1].month, 1)
                        return sDate <= date && eDate >= date
                    }
                case 'multiple':
                    return !!this.selects.find(item => item.month === month && item.year === this.config.viewYear)
                }
            },
            // 判断指定年份是否选中
            isSelectYear(year) {
                switch (this.config.mode) {
                case 'radio':
                    if (this.selects[0]) {
                        return this.selects[0].year === year
                    }
                    return false
                case 'range':
                    switch (this.selects.length) {
                    case 0: return false
                    case 1: return this.selects[0].year === year
                    default: return this.selects[0].year <= year && this.selects[1].year >= year
                    }
                case 'multiple':
                    return !!this.selects.find(item => item.year === year)
                }
            },
            // 判断指定日期是否等于开始or结束日期
            isFringe(date) {
                if (this.config.mode === 'range') {
                    var [sDate, eDate] = this.selects
                    return (sDate || {}).format === date.format || (eDate || {}).format === date.format
                }
                return false
            },
            // 获取月份格式化文本
            getMonthFormat(month) {
                return this.config.viewYear + '-' + numberPad(month + 1)
            },
            // 点击日期时触发
            handleDateActive(date) {
                this.$emit('dateActive', date)
            },
            // 点击月份时触发
            handleMonthActive(month) {
                this.$emit('monthActive', month)
            },
            // 点击年份时触发
            handleYearActive(year) {
                this.$emit('yearActive', year)
            }
        }
    }
</script>
<style lang="scss" scoped>

$itemSize: 66rpx;

.calendar {
    position: relative;
    height: 480rpx;
    overflow: hidden;
    .gray {
        color: #bbb;
    }
    .date-wrap {
        width: 66rpx;
        height: 66rpx;
        border-radius: 50%;
        border: solid 1px transparent;
        box-sizing: border-box;
    }
    .flex-center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tabel-wrap {
        position: absolute;
        left: 0;
        right: 0;
        top:0;
        bottom: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        opacity: 0;
        pointer-events: none;
        transform: scale3d(1, 1, 1);
        transition: .3s ease-in-out;
        .min-cell {
            position: relative;
            width: calc(100% / 7);
            height: 80rpx;
            .marker {
                position: absolute;
                text-align: center;
                border-radius: 50%;
                transform: translate3d(-50%, -50%, 0);
            }
            .date-wrap {
                position: relative;
                z-index: 2;
            }
            &:active {
                .date-wrap {
                    background: #f5f5f5;
                }
            }
            &.current {
                calendar-marker,
                .calendar-marker {
                    display: none;
                }
                .date-wrap {
                    background: rgba($APP_COLOR, .1);
                    border-color: $APP_COLOR;
                }
            }
            &.select {
                calendar-marker,
                .calendar-marker {
                    display: none;
                }
                .date-wrap {
                    color: #fff;
                    background: $APP_COLOR;
                }
                &.range {
                    .date-wrap {
                        border-radius: 0;
                    }
                }
                &.fringe {
                    .date-wrap {
                        border-radius: 50%;
                    }
                }
                & + .select {
                    &::before {
                        content: '';
                        position: absolute;
                        left: -50%;
                        right: 50%;
                        height: $itemSize;
                        background: $APP_COLOR;
                    }
                }
            }
            &:nth-child(7n + 1) {
                &.select {
                    &::before {
                        display: none;
                    }
                }
            }
        }
        .big-cell {
            position: relative;
            width: calc(100% / 4);
            height: 160rpx;
            font-size: 32rpx;
            padding: 1px;
            box-sizing: border-box;
            .item-wrap {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: solid 1px transparent;
                box-sizing: border-box;
            }
            &:active {
                .item-wrap {
                    background: #f5f5f5;
                }
            }
            &.current {
                calendar-marker,
                .calendar-marker {
                    display: none;
                }
                .item-wrap {
                    background: rgba($APP_COLOR, .1);
                    border-color: $APP_COLOR;
                }
            }
            &.select {
                calendar-marker,
                .calendar-marker {
                    display: none;
                }
                .item-wrap {
                    color: #fff;
                    background: $APP_COLOR;
                }
            }
        }
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
    }
}
</style>

