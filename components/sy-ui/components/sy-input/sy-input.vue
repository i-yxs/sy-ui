<!--
* @description 输入框
* @author yxs
!-->
<template>
    <view
        :class="{disabled: __props.disabled}"
        class="sy-input"
    >
        <view class="extend">
            <slot name="prepend" />
        </view>
        <view
            v-if="__props.prefixIcon"
            :style="_prefixIconStyle"
            class="input-icon prefix-icon"
        >
            <view :class="__props.prefixIcon" />
        </view>
        <view :style="{minHeight: __props.height}" class="input-wrap">
            <!-- 如果组件状态为只读，使用文本标签代替input标签 -->
            <view
                v-if="__props.readonly || !__props.allowInput"
                :class="[__props.rows ? `f${__props.rows}` : '']"
                class="input-text sy-ui-folded"
            >
                <text v-if="isEmpty(inputValue)" class="input-placeholder">{{ __props.placeholder }}</text>
                <text v-else>{{ viewValue }}</text>
            </view>
            <input
                v-else-if="visible"
                :style="{height: __props.height, lineHeight: __props.height}"
                :type="__props.type"
                :value="viewValue"
                :focus="__props.focus"
                :cursor="__props.cursor"
                :password="__props.password && showPasswordFlag"
                :disabled="__props.disabled"
                :maxlength="__props.maxlength"
                :placeholder="__props.placeholder"
                :confirmType="__props.confirmType"
                :confirmHold="__props.confirmHold"
                :alwaysEmbed="__props.alwaysEmbed"
                :holdKeyboard="__props.holdKeyboard"
                :selectionEnd="__props.selectionEnd"
                :selectionStart="__props.selectionStart"
                :cursorSpacing="__props.cursorSpacing"
                :adjustPosition="__props.adjustPosition"
                placeholderClass="input-placeholder"
                @blur="handleBlur"
                @focus="handleFocus"
                @input="handleInput"
                @confirm="handleConfirm"
                @keyboardheightchange="$emit('keyboardheightchange', $event)"
            >
            <view v-else :style="{height: __props.height}" class="block-placeholder"/>
            <template v-if="!__props.disabled">
                <view
                    v-if="__props.clearable && !isEmpty(inputValue) && !__props.readonly"
                    class="tools-button"
                    @click.stop="handleClear"
                >
                    <text :style="_suffixIconStyle" class="clear-button sy-ui-icon-close-fill" />
                </view>
                <view
                    v-if="__props.showPassword && __props.password"
                    :class="showPasswordFlag ? 'sy-ui-icon-eye-close' : 'sy-ui-icon-eye-open'"
                    :style="_suffixIconStyle"
                    class="tools-button"
                    @click.stop="handleShowPasswordChange"
                />
            </template>
            <view v-if="__props.showWordLimit && __props.maxlength" class="word-number">
                {{ viewValue.length + '/' + __props.maxlength }}
            </view>
        </view>
        <view
            v-if="__props.suffixIcon"
            :style="_suffixIconStyle"
            class="input-icon suffix-icon"
        >
            <view :class="__props.suffixIcon" />
        </view>
        <view class="extend">
            <slot name="append" />
        </view>
    </view>
</template>
<script>

    import props from './props'
    import mixinProps from '../../mixin/props'
    import { objectToCss, moneyFormat } from '../../utils'

    export default {
        name: 'SyInput',
        mixins: [mixinProps],
        props,
        data() {
            return {
                visible: true,
                viewValue: '',
                inputValue: '',
                showPasswordFlag: true
            }
        },
        computed: {
            _prefixIconStyle() {
                return objectToCss(this.__props.prefixIconStyle)
            },
            _suffixIconStyle() {
                return objectToCss(this.__props.suffixIconStyle)
            }
        },
        watch: {
            '__props.value'() {
                this.updateValue()
            }
        },
        mounted() {
            // 记录input的value变化时的次数，触发value监听时-1，只有等于0时才会更新viewValue
            // 用于解决连续输入时，$emit发送到父组件，父组件更新value，再更新到子组件这段时间的延迟，导致文本跳动的问题
            this.inputCount = 0
            this.updateValue()

            if (this.__props.moneyMode && !this.__props.focus) {
                this.viewValue = moneyFormat(this.__props.value)
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
                    let value = this.__props.value
                    if (value === null || value === void 0) {
                        value = ''
                    }
                    this.viewValue = String(value)
                    this.inputCount = 0
                    this.inputValue = value
                }
            },
            handleBlur(e) {
                let viewValue = String(this.viewValue)
                let inputValue = String(this.inputValue)
                if (inputValue !== viewValue) {
                    viewValue = inputValue
                }
                if (this.moneyMode) {
                    viewValue = moneyFormat(inputValue)
                }
                this.viewValue = viewValue
                this.$emit('blur', e)
            },
            handleFocus(e) {
                let viewValue = String(this.inputValue)
                let inputValue = String(this.inputValue)
                if (Array.isArray(this.__props.quickInput)) {
                    if (this.__props.quickInput.findIndex(v => String(v) === inputValue) > -1) {
                        viewValue = ''
                    }
                } else if (String(this.__props.quickInput) === inputValue) {
                    viewValue = ''
                }
                this.viewValue = viewValue
                this.$emit('focus', e)
            },
            handleInput(e) {
                this.setValue(e.detail.value)
            },
            handleClear() {
                this.viewValue = String(this.inputValue)
                this.$nextTick(() => {
                    this.viewValue = ''
                    this.setValue('')
                    this.$emit('clear')
                    this.$emit('change')
                })
            },
            handleConfirm(e) {
                this.$emit('confirm', e)
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
        .input-text,
        .block-placeholder{
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
}
</style>

