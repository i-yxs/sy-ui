<!--
* @description 输入框
* @author yxs
!-->
<template>
    <view
        :class="{disabled: disabled, readonly: readonly}"
        class="sy-input"
    >
        <view class="extend">
            <slot name="prepend" />
        </view>
        <view
            v-if="prefixIcon"
            :style="prefixIconStyle"
            class="input-icon prefix-icon"
        >
            <view :class="prefixIcon" />
        </view>
        <view :style="{minHeight: height}" class="input-wrap">
            <!-- 如果组件状态为只读，使用文本标签代替input标签 -->
            <view
                v-if="readonly"
                :class="[`f${rows}`]"
                class="input-text sy-ui-folded"
            >
                <view v-if="isEmpty(inputValue)" class="input-placeholder" >
                    {{ placeholder }}
                </view>
                <view v-else>
                    {{ viewValue }}
                </view>
            </view>
            <input
                v-else
                :style="{height: height, lineHeight: height}"
                :type="type"
                :value="viewValue"
                :focus="focus"
                :password="password && showPasswordFlag"
                :disabled="disabled"
                :maxlength="maxlength"
                :placeholder="placeholder"
                :confirmType="confirmType"
                :cursor="nativeProps.cursor"
                :confirmHold="nativeProps.confirmHold"
                :cursorSpacing="nativeProps.cursorSpacing"
                :holdKeyboard="nativeProps.holdKeyboard"
                :selectionEnd="nativeProps.selectionEnd"
                :selectionStart="nativeProps.selectionStart"
                :adjustPosition="nativeProps.adjustPosition"
                placeholder-class="input-placeholder"
                @blur="handleBlur"
                @focus="handleFocus"
                @input="handleInput"
                @confirm="handleConfirm"
                @keyboardheightchange="handleEvent('keyboardheightchange', $event)"
            >
            <view
                v-if="clearable && viewValue && !readonly"
                class="tools-button"
                @click.stop="handleClear"
            >
                <text class="clear-button sy-ui-icon-close-fill" />
            </view>
            <view
                v-if="showPassword && password"
                :class="showPasswordFlag ? 'sy-ui-icon-eye-close' : 'sy-ui-icon-eye-open'"
                class="tools-button"
                @click.stop="handleShowPasswordChange"
            />
            <view v-if="showWordLimit && maxlength" class="word-number">
                {{ viewValue.length + '/' + maxlength }}
            </view>
        </view>
        <view
            v-if="suffixIcon"
            :style="suffixIconStyle"
            class="input-icon suffix-icon"
        >
            <view :class="suffixIcon" />
        </view>
        <view class="extend">
            <slot name="append" />
        </view>
    </view>
</template>
<script>

    import { jsonToCss, moneyFormat } from '@/components/sy-ui/utils'
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyInput',
        props: {
            type: { type: String, default: 'text' },
            rows: { default: defaultValue.input.rows }, // 最多显示行数，
            value: null,
            focus: null,
            height: { default: defaultValue.input.height }, // 输入框的高度
            readonly: { type: Boolean, default: false }, // 是否只读
            disabled: { type: Boolean, default: false }, // 是否禁用
            password: { type: Boolean, default: false }, // 是否是密码类型
            clearable: { type: Boolean, default: false }, // 是否可清空
            maxlength: { default: defaultValue.input.maxlength }, // 可输入的最大长度
            prefixIcon: String, // 输入框头部图标
            suffixIcon: String, // 输入框尾部图标
            prefixIconStyles: { type: Object, default: defaultValue.input.iconStyle }, // 图标颜色
            suffixIconStyles: { type: Object, default: defaultValue.input.iconStyle }, // 图标颜色
            quickInput: null, // 是否启用快速输入模式，启用时当input获取焦点且value等于指定值时，自动清空value，从而避免用户还需要删除原来的值
            placeholder: String, // 没有值时的占位符
            confirmType: { type: String, default: 'done' }, // 设置键盘右下角按钮的文字，仅在type='text'时生效
            showPassword: { type: Boolean, default: false }, // 是否显示切换密码图标
            showWordLimit: { type: Boolean, default: false }, // 是否显示输入字数统计
            moneyMode: { type: Boolean, default: false }, // 是否启用金额模式，失去焦点时会以金额格式显示
            nativeProps: { type: Object, default: () => ({}) } // 其他原生属性
        },
        data() {
            return {
                viewValue: '',
                inputValue: '',
                showPasswordFlag: true
            }
        },
        computed: {
            isEdit() {
                return !this.disabled && !this.readonly
            },
            prefixIconStyle() {
                return jsonToCss(this.prefixIconStyles)
            },
            suffixIconStyle() {
                return jsonToCss(this.suffixIconStyles)
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

            if (this.moneyMode) {
                this.viewValue = moneyFormat(this.value)
            }
        },
        methods: {
            setValue(value) {
                this.inputCount++
                this.inputValue = value
                this.$emit('input', value)
            },
            updateValue() {
                if (--this.inputCount <= 0) {
                    var value = this.value
                    if (value === null || value === undefined) {
                        value = ''
                    }
                    this.viewValue = String(value)
                    this.inputCount = 0
                    this.inputValue = value
                }
            },
            handleEvent(name, value) {
                setTimeout(() => {
                    this.$emit(name, value)
                }, 300)
            },
            handleBlur(e) {
                let viewValue = this.viewValue
                let inputValue = this.inputValue
                if (String(inputValue) !== viewValue) {
                    viewValue = String(inputValue)
                }
                if (this.moneyMode) {
                    viewValue = moneyFormat(inputValue)
                }
                this.viewValue = viewValue
                this.$emit('blur', e)
            },
            handleFocus(e) {
                let viewValue = this.inputValue
                let inputValue = this.inputValue
                if (this.moneyMode) {
                    viewValue = inputValue
                }
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
            handleInput(e) {
                this.setValue(e.detail.value)
            },
            handleClear() {
                this.viewValue = this.inputValue
                this.$nextTick(() => {
                    this.viewValue = ''
                    this.setValue('')
                    this.$emit('clear')
                    this.$emit('change')
                })
            },
            handleConfirm(e) {
                this.handleEvent('confirm', e)
                this.$emit('change')
            },
            handleShowPasswordChange() {
                this.showPasswordFlag = !this.showPasswordFlag
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-input{
    display: flex;
    .input-wrap{
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        input,
        .input-text{
            flex: 1;
            height: inherit;
            line-height: inherit;
            font-size: inherit;
            color: inherit;
            word-wrap: break-word;
            word-break: break-all;
        }
        .tools-button{
            width: 50rpx;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36rpx;
            color: #666;
            &:last-child {
                margin-right: -12rpx;
            }
        }
        .word-number{
            color: #bbb;
            font-size: 24rpx;
        }
        .clear-button{
            display: inline-block;
            text-align: center;
            width: 28rpx;
            height: 28rpx;
            font-size: 28rpx;
            line-height: 28rpx;
            color: #999;
        }
    }
    .input-icon{
        display: flex;
        align-items: center;
        color: #c5c5c5;
        &.prefix-icon{
            margin-right: 16rpx;
        }
        &.suffix-icon{
            margin-left: 16rpx;
        }
    }
    &.disabled{
        background-color: #f5f7fa;
        color: #c0c4cc;
    }
}
</style>

