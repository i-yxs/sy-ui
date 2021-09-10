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
                    <sy-calendar
                        :value="inputValue"
                        :mode="mode"
                        :type="type"
                        :loading="loading"
                        :default-time="defaultTime"
                        :value-format="valueFormat"
                        :first-day-of-week="firstDayOfWeek"
                        @input="handleInput"
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
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyPickerDate',
        props: {
            value: null,
            format: { type: String, default: defaultValue.pickerDate.format }, // 显示在输入框中的格式
            separator: { type: String, default: defaultValue.pickerDate.separator }, // 选择范围时的分隔符
            defaultTime: Array, // 选择器打开时默认显示的时间
            // 日历 参数
            type: { default: 'date' },
            mode: { default: 'radio' },
            valueFormat: { default: defaultValue.pickerDate.valueFormat }, // 绑定值的格式
            firstDayOfWeek: { default: defaultValue.pickerDate.firstDayOfWeek }, // 周起始日 1-7
            ...publicProps.pickerInput
        },
        data() {
            return {
                visibles: {
                    picker: false,
                    popover: false
                },
                viewValue: '',
                inputValue: this.value
            }
        },
        computed: {
            suffixIconName() {
                if (!this.readonly && !this.disabled) {
                    return this.loading ? 'sy-ui-icon-loading' : this.suffixIcon
                }
                return ''
            }
        },
        watch: {
            value(value) {
                this.inputValue = value
                this.updateViewValue()
            }
        },
        mounted() {
            this.updateViewValue()
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
            // 更新视图value
            updateViewValue(value = this.inputValue) {
                var label = ''
                if (!this.isEmpty(value)) {
                    if (this.type === 'week') {
                        if (Array.isArray(value) && value.length) {
                            label = dateTools.format(value[0], this.format)
                        }
                    } else {
                        switch (this.mode) {
                        case 'range':
                        case 'multiple':
                            if (Array.isArray(value)) {
                                label = value.map(item => {
                                    return dateTools.format(item, this.format)
                                }).join(this.separator)
                            }
                            break
                        case 'radio':
                        default:
                            if (typeof value === 'string') {
                                label = dateTools.format(value, this.format)
                            }
                            break
                        }
                    }
                }
                this.viewValue = label
            },
            // 点击清空按钮时触发
            handleClear() {
                this.handleInput('')
                this.$emit('clear')
                this.$emit('input', '')
                this.$emit('change', '')
            },
            // 选中值改变时触发
            handleInput(value) {
                this.inputValue = value
            },
            // 点击取消按钮时触发
            handleCancel() {
                this.inputValue = this.value
                this.hide()
                this.$emit('cancel')
            },
            // 点击确定按钮时触发
            handleConfirm() {
                var pass = true
                switch (this.mode) {
                case 'radio':
                    pass = !!this.inputValue
                    break
                default:
                    pass = !!(this.inputValue && this.inputValue.length)
                    break
                }
                if (pass) {
                    this.hide()
                    this.updateViewValue()
                    this.$emit('input', this.inputValue)
                    this.$emit('change', this.inputValue)
                } else {
                    this.showToast('请至少选择一项')
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.popover-wrap{
    background: #fff;
    .foot-wrap {
        .button-wrap {
            padding: 30rpx;
            background: #fff;
        }
    }
}
</style>

