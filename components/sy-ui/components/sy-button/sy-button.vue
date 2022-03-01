<!--
* @description 按钮
* @author yxs
!-->
<template>
    <view
        :class="[__props.type, {
            plain: __props.plain,
            inline: __props.inline,
            loading: __props.loading,
            disabled: __props.disabled
        }]"
        :style="styles_"
        class="sy-button"
        @click="$emit('click', $event)"
    >
        <view v-if="__props.loading" class="button-icon loading-icon sy-ui-icon-loading" />
        <view v-if="__props.prefixIcon" :class="__props.prefixIcon" class="button-icon prefix-icon" />
        <slot>
            <view v-if="__props.text" class="button-text">
                {{ __props.text }}
            </view>
        </slot>
        <view v-if="__props.suffixIcon" :class="__props.suffixIcon" class="button-icon suffix-icon" />
        <button
            v-if="__props.openType"
            :loading="__props.loading"
            :disabled="__props.disabled"
            :open-type="__props.openType"
            @click.stop
            @contact="$emit('contact', $event)"
            @getUserInfo="$emit('getuserinfo', $event)"
            @chooseAvatar="$emit('chooseavatar', $event)"
            @getphonenumber="$emit('getphonenumber', $event)"
        />
    </view>
</template>
<script>

    import props from './props'
    import mixinProps from '../../mixin/props'
    import { objectToCss } from '../../utils'

    export default {
        name: 'SyButton',
        mixins: [mixinProps],
        props,
        computed: {
            styles_() {
                return objectToCss({
                    height: '90rpx',
                    borderRadius: '45rpx',
                    fontSize: '30rpx',
                    ...this.__props.styles
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-button{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $APP_COLOR;
    background: #fff;
    border: solid 1px $APP_COLOR;
    padding: 0 30rpx;
    box-sizing: border-box;
    transition: background all .2s;
    &:active{
        background: #f9f9f9;
    }
    &.primary{
        color: #fff;
        background: $APP_BACKGROUND;
        border: solid 1px transparent;
        &:active{
            background: $APP_BACKGROUND_ACTIVE;
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
        line-height: 1em;
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
    button {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
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

