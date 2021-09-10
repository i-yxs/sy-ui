<!--
* @description 多行输入框
* @author yxs
!-->
<template>
    <view
        :style="style"
        :class="{disabled: disabled, readonly: readonly}"
        class="sy-textarea"
    >
        <view class="input-wrap">
            <view v-if="readonly" class="input-text">
                <text v-if="isEmpty(inputValue)" class="input-placeholder">
                    {{ placeholder }}
                </text>
                <text v-else>
                    {{ viewValue }}
                </text>
            </view>
            <view
                v-else
                :style="{height: height}"
                class="textarea"
            >
                <textarea
                    :style="{height: height, display: visible ? 'block' : 'none'}"
                    :value="viewValue"
                    :focus="focus"
                    :fixed="fixed"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :autoHeight="autoHeight"
                    :placeholder="placeholder"
                    :confirm-type="confirmType"
                    :cursor="nativeProps.cursor"
                    :confirm-hold="nativeProps.confirmHold"
                    :holdKeyboard="nativeProps.holdKeyboard"
                    :cursorSpacing="nativeProps.cursorSpacing"
                    :selectionEnd="nativeProps.selectionEnd"
                    :selectionStart="nativeProps.selectionStart"
                    :showConfirmBar="nativeProps.showConfirmBar"
                    :adjustPosition="nativeProps.adjustPosition"
                    disableDefaultPadding
                    placeholderClass="input-placeholder"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    @input="handleInput"
                    @confirm="$emit('confirm', $event)"
                    @linechange="$emit('linechange', $event)"
                    @keyboardheightchange="$emit('keyboardheightchange', $event)"
                />
            </view>
        </view>
        <view v-if="showWordLimit && maxlength" class="word-number">
            {{ valueLength + '/' + maxlength }}
        </view>
    </view>
</template>
<script>
    import { jsonToCss } from '@/components/sy-ui/utils'
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyTextarea',
        props: {
            value: null,
            focus: null,
            fixed: { type: Boolean, default: false },
            styles: Object,
            height: { default: defaultValue.textarea.height }, // 输入框的高度
            readonly: { type: Boolean, default: false }, // 是否只读
            disabled: { type: Boolean, default: false }, // 是否禁用
            maxlength: { default: defaultValue.textarea.maxlength }, // 可输入的最大长度
            quickInput: null, // 是否启用快速输入模式，启用时当input获取焦点且value等于指定值时，自动清空value，从而避免用户还需要删除原来的值
            autoHeight: { type: Boolean, default: false }, // 是否自动增高，设置auto-height时，style.height不生效
            placeholder: String, // 没有值时的占位符
            confirmType: String, // 设置键盘右下角按钮的文字，仅在type='text'时生效
            showWordLimit: { type: Boolean, default: false }, // 是否显示输入字数统计
            nativeProps: { type: Object, default: () => ({}) }// 其他原生属性
        },
        data() {
            return {
                visible: true,
                viewValue: '',
                inputValue: '',
                showPasswordFlag: true
            }
        },
        computed: {
            style() {
                return jsonToCss(this.styles)
            },
            valueLength() {
                return (this.inputValue || '').length
            }
        },
        watch: {
            value() {
                this.updateValue()
            }
        },
        mounted() {
            // 记录input的value变化时的次数，触发value监听时减一，只有等于0时才会更新viewValue
            this.inputCount = 0
            this.updateValue()
        },
        methods: {
            // 设置value
            setValue(value) {
                this.inputCount += 1
                this.inputValue = value
                this.$emit('input', value)
            },
            // 更新value
            updateValue() {
                if (--this.inputCount <= 0) {
                    var value = this.value
                    if (value === null || value === undefined) {
                        value = ''
                    }
                    this.inputCount = 0
                    this.viewValue = String(value)
                    this.inputValue = value
                }
            },
            // 失去焦点时触发
            handleBlur(e) {
                if (String(this.inputValue) !== this.viewValue) {
                    this.viewValue = String(this.inputValue)
                }
                this.$emit('blur', e)
            },
            // 获得焦点时触发
            handleFocus(e) {
                let viewValue = this.inputValue
                let inputValue = this.inputValue
                if (Array.isArray(this.quickInput)) {
                    if (this.quickInput.findIndex(v => String(v) === String(inputValue)) > -1) {
                        viewValue = ''
                    }
                } else if (String(this.quickInput) === String(inputValue)) {
                    viewValue = ''
                }
                this.viewValue = viewValue
                this.$emit('focus', e)
            },
            // 输入时触发
            handleInput(e) {
                this.setValue(e.detail.value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-textarea{
    display: flex;
    flex-direction: column;
    .input-wrap{
        position: relative;
        display: flex;
        .textarea {
            textarea {
                width: 100%;
                height: 100%;
                font-size: inherit;
            }
        }
        .textarea,
        .input-text{
            flex: 1;
            line-height: inherit;
            font-size: inherit;
            color: inherit;
            word-wrap: break-word;
            word-break: break-all;
        }
    }
    .word-number{
        color: #bbb;
        font-size: 24rpx;
        text-align: right;
    }
    &.disabled{
        background-color: #f5f7fa;
        color: #c0c4cc;
    }
}
</style>

