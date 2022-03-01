<!--
* @description 多行输入框
* @author yxs
!-->
<template>
    <view
        :style="style"
        :class="{disabled: __props.disabled}"
        class="sy-textarea"
    >
        <view class="input-wrap">
            <view v-if="__props.readonly || !__props.allowInput" class="input-text">
                <text v-if="isEmpty(inputValue)" class="input-placeholder">{{ __props.placeholder }}</text>
                <text v-else>{{ viewValue }}</text>
            </view>
            <textarea
                v-else-if="visible"
                :style="{height: __props.height}"
                :value="viewValue"
                :focus="__props.focus"
                :fixed="__props.fixed"
                :cursor="__props.cursor"
                :disabled="__props.disabled"
                :maxlength="__props.maxlength"
                :autoHeight="__props.autoHeight"
                :confirmType="__props.confirmType"
                :confirmHold="__props.confirmHold"
                :placeholder="__props.placeholder"
                :holdKeyboard="__props.holdKeyboard"
                :cursorSpacing="__props.cursorSpacing"
                :selectionEnd="__props.selectionEnd"
                :selectionStart="__props.selectionStart"
                :showConfirmBar="__props.showConfirmBar"
                :adjustPosition="__props.adjustPosition"
                disableDefaultPadding
                placeholderClass="input-placeholder"
                @blur="handleBlur"
                @focus="handleFocus"
                @input="handleInput"
                @confirm="$emit('confirm', $event)"
                @linechange="$emit('linechange', $event)"
                @keyboardheightchange="$emit('keyboardheightchange', $event)"
            />
            <view v-else :style="{height: __props.height}"/>
        </view>
        <view v-if="__props.showWordLimit && __props.maxlength" class="word-number">
            {{ viewValue.length + '/' + __props.maxlength }}
        </view>
    </view>
</template>
<script>
    import props from './props'
    import mixinProps from '../../mixin/props'
    import { objectToCss } from '../../utils'

    export default {
        name: 'SyTextarea',
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
            style() {
                return objectToCss(this.__props.styles)
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
                    let value = this.__props.value
                    if (value === null || value === void 0) {
                        value = ''
                    }
                    this.inputCount = 0
                    this.viewValue = String(value)
                    this.inputValue = value
                }
            },
            // 失去焦点时触发
            handleBlur(e) {
                let viewValue = String(this.viewValue)
                let inputValue = String(this.inputValue)
                if (inputValue !== viewValue) {
                    viewValue = inputValue
                }
                this.viewValue = viewValue
                this.$emit('blur', e)
            },
            // 获得焦点时触发
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
            // 输入时触发
            handleInput(e) {
                this.setValue(e.detail.value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-textarea{
    .input-wrap{
        position: relative;
        display: flex;
        textarea {
            width: 100%;
            height: 100%;
        }
        textarea,
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

