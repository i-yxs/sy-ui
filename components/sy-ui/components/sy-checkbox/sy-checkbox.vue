<!--
* @description 多选按钮
* @author yxs
!-->
<template>
    <view class="sy-checkbox">
        <view
            :class="{button: button, checked: checked, readonly: readonly, disabled: disabled}"
            :style="{lineHeight: size}"
            class="checkbox-wrap"
            @click="handleActive"
        >
            <view
                v-if="!button"
                :class="iconName"
                :style="{width: size, height: size, color: color, fontSize: size}"
                class="icon"
            />
            <slot>
                <text v-if="text" class="text">
                    {{ text }}
                </text>
            </slot>
        </view>
    </view>
</template>
<script>

    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyCheckbox',
        props: {
            text: String,
            size: { type: String, default: defaultValue.checkbox.size },
            color: { type: String, default: defaultValue.checkbox.color },
            value: { default: false },
            button: { type: Boolean, default: false },
            // 是否只读
            readonly: { type: Boolean, default: false },
            disabled: { type: Boolean, default: false },
            indeterminate: { type: Boolean, default: false },
            // 选中时的值
            trueLabel: { default: true },
            // 没有选中时的值
            falseLabel: { default: false }
        },
        data() {
            return {
                checked: false
            }
        },
        computed: {
            iconName() {
                if (this.indeterminate) {
                    return 'sy-ui-icon-multiple-indeterminate'
                } else {
                    return this.checked ? 'sy-ui-icon-multiple-fill' : 'sy-ui-icon-multiple'
                }
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.checked = this.trueLabel === value
                }
            }
        },
        methods: {
            handleActive() {
                var value = this.value === this.trueLabel ? this.falseLabel : this.trueLabel
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
                background: $APP_COLOR;
            }
            .icon{
                display: none;
            }
            .text {
                margin-left: 0;
            }
        }
        &.readonly {
            pointer-events: none;
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

