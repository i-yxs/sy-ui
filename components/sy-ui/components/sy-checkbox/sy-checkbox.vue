<!--
* @description 多选按钮
* @author yxs
!-->
<template>
    <view class="sy-checkbox">
        <view
            :class="{
                button: __props.button,
                checked: checked,
                readonly: __props.readonly,
                disabled: __props.disabled
            }"
            :style="{lineHeight: __props.size}"
            class="checkbox-wrap"
            @click="handleActive"
        >
            <view
                v-if="!__props.button"
                :class="iconName"
                :style="{
                    width: __props.size,
                    height: __props.size,
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
        name: 'SyCheckbox',
        mixins: [mixinProps],
        props,
        data() {
            return {
                checked: false
            }
        },
        computed: {
            iconName() {
                if (this.__props.indeterminate) {
                    return 'sy-ui-icon-multiple-indeterminate'
                } else {
                    return this.checked ? 'sy-ui-icon-multiple-fill' : 'sy-ui-icon-multiple'
                }
            }
        },
        watch: {
            '__props.value': {
                immediate: true,
                handler(value) {
                    this.checked = this.__props.trueLabel === value
                }
            }
        },
        methods: {
            handleActive() {
                if (this.__props.readonly) return
                let value = this.__props.value === this.__props.trueLabel ? this.__props.falseLabel : this.__props.trueLabel
                this.$emit('input', value)
                this.$emit('change', value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-checkbox{
    display: inline-flex;
    .checkbox-wrap {
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
            height: 50rpx;
            line-height: 50rpx;
            padding: 0 30rpx;
            font-weight: bold;
            color: $APP_COLOR;
            border: 1px solid $APP_COLOR;
            border-radius: 25rpx;
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

