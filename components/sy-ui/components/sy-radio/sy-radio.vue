<!--
* @description 单选按钮
* @author yxs
!-->
<template>
    <view class="sy-radio">
        <view
            :class="{ button: button, checked: checked, readonly: readonly, disabled: disabled }"
            :style="{ lineHeight: size }"
            class="radio-wrap"
            @tap="handleActive"
        >
            <view
                :class="checked ? 'sy-ui-icon-radio-fill' : 'sy-ui-icon-radio'"
                :style="{ width: size, height: size, lineHeight: size, color: color, fontSize: size }"
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
        name: 'SyRadio',
        props: {
            text: String,
            value: null,
            label: { default: '' },
            size: { type: String, default: defaultValue.checkbox.size },
            color: { type: String, default: defaultValue.checkbox.color },
            button: { type: Boolean, default: false },
            // 是否可以取消选中
            isCancel: { type: Boolean, default: false },
            // 是否只读
            readonly: { type: Boolean, default: false },
            disabled: { type: Boolean, default: false }
        },
        data() {
            return {
                checked: false
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.checked = this.label === value
                }
            }
        },
        methods: {
            handleActive() {
                var value = this.label
                if (this.isCancel) {
                    value = this.value === value ? '' : value
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
            height: 50rpx;
            line-height: 50rpx;
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
        &.hidden {
            display: none;
        }
    }
}
</style>

