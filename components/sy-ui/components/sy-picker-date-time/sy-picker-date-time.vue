<!--
* @description 日期选择器
* @author yxs
!-->
<template>
    <view class="sy-picker-date">
        <sy-picker-input
            :value="viewValue"
            :height="height"
            :hidden="hidden"
            :overlay="overlay"
            :loading="loading"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIconName"
            :disabled="disabled"
            :clearable="clearable"
            :placeholder="placeholder"
            :input-props="inputProps"
            readonly
            @click="show"
            @clear="handleClear"
        />
        <sy-popover
            :visible="visibles.popover"
            position="bottom"
            @update="visibles.picker = $event"
            @masktap="handleCancel"
        >
            <view v-if="visibles.picker" class="popover-wrap">
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
                                :min="min"
                                :max="max"
                                :format="formats[1]"
                                mode="time"
                                suffix-icon=""
                                placeholder="选择时间"
                            />
                        </view>
                    </view>
                    <sy-calendar
                        :value="dateValue"
                        :marker="marker"
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
            </view>
        </sy-popover>
    </view>
</template>
<script>
    // 方法
    import dateTools from '@/components/sy-ui/utils/dateTools'
    import publicProps from '@/components/sy-ui/utils/publicProps'
    // 组件

    export default {
        name: 'SyPickerDate',
        props: {
            // 选择的值
            value: { type: String, default: '' },
            // 显示在输入框中的格式
            format: { type: String, default: 'YYYY-MM-DD HH:mm:ss' },
            // 选中日期后的默认具体时刻，默认当前时间
            defaultTime: { type: String },
            // 日历 参数
            min: null,
            max: null,
            marker: null,
            valueFormat: { default: 'YYYY-MM-DD HH:mm:ss' },
            firstDayOfWeek: null,
            ...publicProps.pickerInput
        },
        data() {
            return {
                visibles: {
                    picker: false,
                    popover: false
                },
                viewValue: '',
                dateValue: '',
                timeValue: ''
            }
        },
        computed: {
            values() {
                var date = new Date()
                var value = this.value.split(' ')
                value[0] = dateTools.format(value[0], this.formats[0]) || dateTools.format(date, this.formats[0])
                value[1] = dateTools.format(value[1] || this.defaultTime, this.formats[1]) || dateTools.format(date, this.formats[1])
                return value
            },
            formats() {
                var format = this.format.split(' ')
                format[0] = format[0] || 'YYYY-MM-DD'
                format[1] = format[1] || 'HH:mm:ss'
                return format
            },
            suffixIconName() {
                if (!this.readonly && !this.disabled) {
                    return this.loading ? 'sy-ui-icon-loading' : this.suffixIcon
                }
                return ''
            }
        },
        watch: {
            value: {
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
                if (!this.readonly && !this.disabled) {
                    this.visibles.popover = true
                }
            },
            hide() {
                this.visibles.popover = false
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
                var inputValue = dateTools.format(this.viewValue, this.valueFormat)
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

