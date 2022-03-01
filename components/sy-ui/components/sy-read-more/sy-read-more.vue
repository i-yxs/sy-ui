<!--
* @description 阅读更多
* @author yxs
!-->
<template>
    <view class="sy-read-more">
        <view :style="{maxHeight: maxHeight}" class="body-wrap">
            <view class="content">
                <slot/>
            </view>
            <view v-if="!status && showButton" class="shadow"/>
        </view>
        <view
            v-if="showButton"
            :class="{close: status}"
            :style="_buttonStyle"
            class="foot-wrap"
            @click="handleOpen"
        >
            <view class="text">{{ status ? openText : closeText }}</view>
            <view class="icon sy-ui-icon-arrow-right"/>
        </view>
    </view>
</template>
<script>

    import { objectToCss, getElementRect } from '../../utils'

    export default {
        name: 'SyReadMore',
        props: {
            // 内容超出此高度才会显示展开按钮，单位rpx
            height: { type: [String, Number], default: 340 },
            // 折叠时的提示文本
            openText: { type: String, default: '收起' },
            // 展开时的提示文本
            closeText: { type: String, default: '展开' },
            // 按钮样式
            buttonStyle: Object
        },
        data() {
            return {
                // 展开状态
                status: false,
                // 是否显示展开按钮
                showButton: false
            }
        },
        computed: {
            maxHeight() {
                return this.status ? '' : this.height + 'rpx'
            },
            _buttonStyle() {
                return objectToCss(this.buttonStyle)
            }
        },
        mounted() {
            this.init()
        },
        updated() {
            this.init()
        },
        methods: {
            init() {
                getElementRect('.content', this).then(res => {
                    this.showButton = res[0].height > uni.upx2px(this.height)
                })
            },
            handleOpen() {
                this.status = !this.status
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-read-more{
    position: relative;
    .body-wrap {
        position: relative;
        overflow: hidden;
        .shadow {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 200rpx;
            background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
        }
    }
    .foot-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: $APP_COLOR;
        line-height: 40rpx;
        &.close {
            .icon {
                transform: rotateZ(-90deg);
            }
        }
        .text {
            margin-right: 10rpx;
        }
        .icon {
            transform: rotateZ(90deg);
        }
    }
}
</style>

