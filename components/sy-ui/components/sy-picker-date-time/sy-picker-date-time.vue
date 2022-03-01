<!--
* @description 日期选择器
* @author yxs
!-->
<template>
    <view class="sy-picker-date">
        <sy-picker-input
            :props="pickerInputProps"
            @click="show"
            @clear="handleClear"
        />
        <sy-popover
            v-model="popover.content"
            :visible="popover.visible"
            position="bottom"
            @masktap="handleCancel"
        >
            <view v-if="popover.content" class="popover-wrap">
                <view class="body-wrap">
                    <view class="input-wrap sy-ui-border-bottom">
                        <view class="item">
                            <sy-input
                                v-model="dateValue"
                                readonly
                                placeholder="选择日期"
                            />
                        </view>
                        <view class="item" @touchstart="updateDefaultTime">
                            <sy-picker
                                v-model="timeValue"
                                :min="__props.min"
                                :max="__props.max"
                                :format="formats[1]"
                                mode="time"
                                suffix-icon=""
                                placeholder="选择时间"
                            />
                        </view>
                    </view>
                    <sy-calendar
                        :value="dateValue"
                        :value-format="formats[0]"
                        :first-day-of-week="firstDayOfWeek"
                        mode="radio"
                        type="date"
                        @input="handleCalendarChange"
                    />
                </view>
                <view class="foot-wrap sy-ui-border-top">
                    <view class="button-wrap">
                        <sy-button-group
                            :options="[
                                {text: '取消', name: 'cancel'},
                                {type: 'primary', text: '确定', name: 'confirm'},
                            ]"
                            @cancel="handleCancel"
                            @confirm="handleConfirm"
                        />
                    </view>
                </view>
                <sy-safe-area-inset />
            </view>
        </sy-popover>
    </view>
</template>
<script>
    // 方法
    import props from './props'
    import mixinProps, { assignProps } from '../../mixin/props'
    import dateTools from '../../utils/dateTools'
    // 组件

    export default {
        name: 'SyPickerDateTime',
        mixins: [mixinProps],
        props,
        data() {
            return {
                popover: {
                    content: false,
                    visible: false
                },
                viewValue: '',
                dateValue: '',
                timeValue: ''
            }
        },
        computed: {
            values() {
                let date = new Date()
                let value = (this.__props.value || '').split(' ')
                value[0] = dateTools.format(value[0], this.formats[0]) || dateTools.format(date, this.formats[0])
                value[1] = dateTools.format(value[1] || this.__props.defaultTime, this.formats[1]) || dateTools.format(date, this.formats[1])
                return value
            },
            formats() {
                let format = this.__props.format.split(' ')
                format[0] = format[0] || 'YYYY-MM-DD'
                format[1] = format[1] || 'HH:mm:ss'
                return format
            },
            pickerInputProps() {
                return assignProps('SyPickerInput', {
                    ...this.__props,
                    value: this.viewValue
                })
            }
        },
        watch: {
            '__props.value': {
                immediate: true,
                handler(value) {
                    if (value) {
                        this.updateViewValue()
                    } else {
                        this.viewValue = ''
                    }
                }
            }
        },
        methods: {
            show() {
                if (this.__props.readonly || this.__props.loading || this.__props.disabled) return
                this.popover.visible = true
            },
            hide() {
                this.popover.visible = false
            },
            updateViewValue() {
                this.updateDefaultTime()
                this.viewValue = `${this.dateValue} ${this.timeValue}`
            },
            // 更新默认时间
            updateDefaultTime() {
                if (!this.dateValue) {
                    this.dateValue = this.values[0]
                }
                if (!this.timeValue) {
                    this.timeValue = this.values[1]
                }
            },
            // 点击清空按钮时触发
            handleClear() {
                this.dateValue = ''
                this.timeValue = ''
                this.$emit('clear')
                this.$emit('input', '')
                this.$emit('change', '')
            },
            // 日期改变时触发
            handleCalendarChange(value) {
                if (value) {
                    this.dateValue = dateTools.format(value, this.formats[0])
                } else {
                    this.dateValue = ''
                }
                this.updateDefaultTime()
                this.inputValue = value
            },
            // 点击取消按钮时触发
            handleCancel() {
                if (this.viewValue) {
                    var values = this.viewValue.split(' ')
                    this.dateValue = values[0]
                    this.timeValue = values[1]
                } else {
                    this.dateValue = ''
                    this.timeValue = ''
                }
                this.hide()
                this.$emit('cancel')
            },
            // 点击确定按钮时触发
            handleConfirm() {
                this.updateViewValue()
                var inputValue = dateTools.format(this.viewValue, this.__props.valueFormat)
                this.$emit('input', inputValue)
                this.$emit('change', inputValue)
                this.hide()
            }
        }
    }
</script>
<style lang="scss" scoped>
.popover-wrap{
    background: #fff;
    border-radius: 30rpx 30rpx 0 0;
    .input-wrap {
        display: flex;
        padding: 20rpx;
        .item {
            flex: 1;
            text-align: center;
            background: #F8F8F8;
            border-radius: 70rpx;
            padding: 0 30rpx;
            & + .item {
                margin-left: 30rpx;
            }
        }
    }
    .foot-wrap {
        .button-wrap {
            padding: 30rpx;
            background: #fff;
        }
    }
}
</style>

