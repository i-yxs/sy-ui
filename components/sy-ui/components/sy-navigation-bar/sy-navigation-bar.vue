<!--
* @description 导航栏
* @author yxs
!-->
<template>
    <view :style="{height: isSpaceUsage ? height : ''}" class="navigation-bar">
        <view
            :style="{
                zIndex: zIndex,
                color: color,
                backgroundColor: backgroundColor
            }"
            class="sy-navigation-bar"
        >
            <view :style="{height: statusBarHeight + 'px'}" class="status-bar"/>
            <view class="navigation-bar">
                <view class="left-cell">
                    <view v-if="back" class="back-button sy-ui-icon-left" @click="handleBackButton" />
                    <slot name="left" />
                </view>
                <view class="title-wrap sy-ui-folded f1">
                    <slot>{{ title }}</slot>
                </view>
                <view class="right-cell">
                    <slot name="right" />
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import styleVars from '@/uni.scss'
    import { systemInfo } from '@/components/sy-ui/utils'

    export default {
        name: 'SyNavigationBar',
        props: {
            // 标题
            title: { type: String, default: '' },
            // 字体颜色
            color: { type: String, default: '#fff' },
            // zIndex
            zIndex: { type: [String, Number], default: 1000 },
            // 是否占用高度
            isSpaceUsage: { type: Boolean, default: false },
            // 背景颜色
            backgroundColor: { type: String, default: styleVars.APP_COLOR },
            // 是否显示后退按钮
            back: { type: [Boolean, String], default: false }
        },
        data() {
            return {
                statusBarHeight: 20
            }
        },
        computed: {
            height() {
                return (this.statusBarHeight + 44) + 'px'
            }
        },
        mounted() {
            this.statusBarHeight = systemInfo.statusBarHeight
            this.$emit('ready', this.statusBarHeight + 44)
        },
        methods: {
            // 点击后退按钮时触发
            handleBackButton() {
                if (this.back === 'event') {
                    this.$emit('back')
                } else {
                    var pages = getCurrentPages()
                    if (pages.length > 1) {
                        uni.navigateBack()
                    } else {
                        uni.reLaunch({
                            url: '/pages/tabBar/home'
                        })
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
$height: 40px;
.navigation-bar {
    .sy-navigation-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        transition: .4s ease-in;
        .navigation-bar {
            position: relative;
            display: flex;
            height: 44px;
            .left-cell {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                top: 0;
                left: 0;
                height: $height;
            }
            .right-cell {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                top: 0;
                right: 0;
                height: $height;
            }
            .title-wrap {
                width: 100%;
                font-size: 17px;
                font-weight: bold;
                text-align: center;
                line-height: $height;
            }
            .back-button {
                display: flex;
                align-items: center;
                height: $height;
                padding: 0 12px;
                font-size: 16px;
                box-sizing: border-box;
            }
        }
    }
}
</style>

