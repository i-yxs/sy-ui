<!--
* @description 按钮
* @author yxs
!-->
<template>
    <view
        :class="[{plain: plain, inline: inline, loading: loading, disabled: disabled}, type]"
        :style="style"
        class="sy-button"
        @click="$emit('click', $event)"
    >
        <view v-if="loading" class="button-icon loading-icon sy-ui-icon-loading" />
        <view v-if="prefixIcon" :class="prefixIcon" class="button-icon prefix-icon" />
        <slot>
            <view v-if="text" class="button-text">
                {{ text }}
            </view>
        </slot>
        <view v-if="suffixIcon" :class="suffixIcon" class="button-icon suffix-icon" />
    </view>
</template>
<script>

    import { jsonToCss } from '@/components/sy-ui/utils'
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyButton',
        props: {
            // 按钮类型 primary success warning danger
            type: String,
            // 是否朴素按钮
            plain: { type: Boolean, default: false },
            // 按钮文本
            text: String,
            // 是否内联按钮
            inline: { type: Boolean, default: false },
            // 是否加载中
            loading: { type: Boolean, default: false },
            // 是否禁用
            disabled: { type: Boolean, default: false },
            // 头部图标
            prefixIcon: String,
            // 尾部图标
            suffixIcon: String,
            // 自定义样式
            styles: Object
        },
        computed: {
            style() {
                return jsonToCss({
                    ...defaultValue.button.styles,
                    ...this.styles
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-button{
    display: flex;
    align-items: center;
    justify-content: center;
    color: $APP_COLOR;
    background: #fff;
    border: solid 1px $APP_COLOR;
    padding: 0 30rpx;
    box-sizing: border-box;
    transition: all .2s;
    &:active{
        background: #f9f9f9;
    }
    &.primary{
        color: #fff;
        background: $APP_COLOR;
        border: solid 1px transparent;
        &:active{
            background: $APP_COLOR_ACTIVE;
        }
    }
    &.success{
        color: #fff;
        background: $SUCCESS_COLOR;
        border: solid 1px $SUCCESS_COLOR;
        &:active{
            background: $SUCCESS_COLOR_ACTIVE;
        }
    }
    &.warning{
        color: #fff;
        background: $WARNING_COLOR;
        border: solid 1px $WARNING_COLOR;
        &:active{
            background: $WARNING_COLOR_ACTIVE;
        }
    }
    &.danger{
        color: #fff;
        background: $DANGER_COLOR;
        border: solid 1px $DANGER_COLOR;
        &:active{
            background: $DANGER_COLOR_ACTIVE;
        }
    }
    &.info{
        color: #fff;
        background: $INFO_COLOR;
        border: solid 1px $INFO_COLOR;
        &:active{
            background: $INFO_COLOR_ACTIVE;
        }
    }
    &.plain {
        background: #fff;
        &.primary{
            color: $APP_COLOR;
            border: solid 1px $APP_COLOR;
        }
        &.success{
            color: $SUCCESS_COLOR;
            border: solid 1px $SUCCESS_COLOR;
        }
        &.warning{
            color: $WARNING_COLOR;
            border: solid 1px $WARNING_COLOR;
        }
        &.danger{
            color: $DANGER_COLOR;
            border: solid 1px $DANGER_COLOR;
        }
        &.info{
            color: $INFO_COLOR;
            border: solid 1px $INFO_COLOR;
        }
        &:active{
            background: #f9f9f9;
        }
    }
    &.inline{
        display: inline-flex;
        & + .sy-button.inline{
            margin-left: 30rpx;
        }
    }
    &.loading,
    &.disabled{
        opacity: .6;
        pointer-events: none;
    }
    &.disabled{
        color: #fff;
        background: #C7C7CC;
        border: solid 1px #C7C7CC;
    }
    .button-text{
        font-weight: bold;
    }
    .button-icon{
        display: inline-block;
        & + .button-text {
            margin-left: 16rpx;
        }
        & + .suffix-icon {
            margin-right: 16rpx;
        }
    }
}
/* #ifdef MP-WEIXIN */
sy-button{
    display: flex;
}
sy-button + sy-button .inline{
    margin-left: 30rpx;
}
/* #endif */
</style>

