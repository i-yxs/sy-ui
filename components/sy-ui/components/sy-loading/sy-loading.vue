<!--
* @description 加载提示
* @author yxs
!-->
<template>
    <view v-if="value" :style="styles_" class="sy-loading">
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
    import { objectToCss } from '../../utils'

    export default {
        name: 'SyLoading',
        props: {
            // 是否显示
            value: Boolean,
            // 显示的文本
            text: String,
            // 是否纵列显示
            column: Boolean,
            // 自定义样式
            styles: Object
        },
        computed: {
            styles_() {
                return objectToCss({
                    color: styleVars.APP_COLOR,
                    zIndex: 100,
                    background: 'rgba(255,255,255,.6)',
                    ...this.styles
                })
            }
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
    font-size: 26rpx;
    .main-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
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

