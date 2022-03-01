<!--
* @description 单选按钮
* @author yxs
!-->
<template>
    <view class="sy-radio">
        <view
            :class="{
                button: __props.button,
                checked: checked,
                disabled: __props.disabled
            }"
            :style="{ lineHeight: __props.size }"
            class="radio-wrap"
            @click="handleActive"
        >
            <view
                :class="checked ? 'sy-ui-icon-radio-fill' : 'sy-ui-icon-radio'"
                :style="{
                    width: __props.size,
                    height: __props.size,
                    lineHeight: __props.size,
                    color: __props.color,
                    fontSize: __props.size
                }"
                class="icon"
            />
            <slot>
                <text v-if="__props.text" class="text">
                    {{ __props.text }}
                </text>
            </slot>
        </view>
    </view>
</template>
<script>

    import props from './props'
    import mixinProps from '../../mixin/props'

    export default {
        name: 'SyRadio',
        mixins: [mixinProps],
        props,
        data() {
            return {
                checked: false
            }
        },
        watch: {
            '__props.value': {
                immediate: true,
                handler(value) {
                    this.checked = this.__props.label === value
                }
            }
        },
        methods: {
            handleActive() {
                if (this.__props.readonly) return
                let value = this.__props.label
                if (this.__props.isCancel) {
                    value = this.__props.value === value ? '' : value
                }
                this.$emit('input', value)
                this.$emit('change', value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-radio{
    display: inline-flex;
    .radio-wrap {
        display: inline-flex;
        align-items: center;
        .icon{
            display: inline-flex;
        }
        .text {
            margin-left: 16rpx;
        }
        &.button {
            min-width: 150rpx;
            height: 52rpx;
            line-height: 52rpx;
            padding: 0 30rpx;
            font-weight: bold;
            color: $APP_COLOR;
            border: 1px solid $APP_COLOR;
            border-radius: 35rpx;
            justify-content: center;
            box-sizing: border-box;
            transition: .2s ease-in-out;
            &.checked {
                color: #fff;
                background: $APP_BACKGROUND;
            }
            .icon{
                display: none;
            }
            .text {
                margin-left: 0;
            }
        }
        &.disabled{
            pointer-events: none;
            color: #c0c4cc;
            .icon{
                color: #e2e2e2 !important;
            }
        }
    }
}
</style>

