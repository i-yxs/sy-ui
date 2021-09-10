<!--
* @description 加载提示
* @author yxs
!-->
<template>
    <view v-if="value" :style="{color: color, zIndex: zIndex, background: background}" class="sy-loading">
        <view :class="{column: column}" class="main-wrap">
            <view class="icon sy-ui-icon-loading" />
            <slot>
                <view v-if="text" class="text">
                    {{ text }}
                </view>
            </slot>
        </view>
    </view>
</template>
<script>
    import styleVars from '@/uni.scss'
    export default {
        name: 'SyLoading',
        props: {
            // 是否显示
            value: { type: Boolean, default: false },
            // 显示的文本
            text: { type: String, default: '加载中' },
            // 是否纵列显示
            column: { type: Boolean, default: false },
            // 颜色
            color: { type: String, default: styleVars.APP_COLOR },
            zIndex: { type: [String, Number], default: 100 },
            // 背景颜色
            background: { type: String, default: 'rgba(255,255,255,.6)' }
        }
    }
</script>
<style lang="scss" scoped>
.sy-loading {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .main-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
            font-size: 26rpx;
        }
        .text {
            font-size: 26rpx;
            margin-left: 12rpx;
        }
        &.column {
            flex-direction: column;
            .text {
                margin-left: 0;
            }
        }
    }
}
</style>

