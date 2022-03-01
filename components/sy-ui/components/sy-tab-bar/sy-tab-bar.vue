<!--
* @description 底部栏
* @author yxs
!-->
<template>
    <view
        v-if="items"
        :style="{height: height, paddingBottom: safeAreaInsetBottom + 'px'}"
        class="sy-tab-bar"
    >
        <view
            :style="styles_"
            :class="{fixed: fixed}"
            class="fixed-wrap"
        >
            <view
                v-for="(item, index) in items"
                :key="index"
                :class="{active: value === index}"
                class="item"
                @click="handleActive(item, index)"
            >
                <text :class="item.icon" class="icon"/>
                <text class="text">{{ item.label }}</text>
            </view>
        </view>
    </view>
</template>
<script>
    import { objectToCss } from '../../utils'
    export default {
        name: 'SyTabBar',
        props: {
            value: Number,
            items: Array,
            fixed: Boolean,
            styles: Object,
            height: { type: String, default: '128rpx' }
        },
        computed: {
            styles_() {
                return objectToCss({
                    zIndex: 50,
                    ...this.styles,
                    height: this.height,
                    paddingBottom: `${this.safeAreaInsetBottom}px`
                })
            }
        },
        methods: {
            handleActive(data, index) {
                if (this.value !== index) {
                    if (data.url) {
                        uni.redirectTo({
                            url: data.url
                        })
                    }
                    this.$emit('input', index)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-tab-bar {
    width: 100%;
    height: 50rpx;
    .fixed-wrap {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 50;
        background: #fff;
        display: flex;
        box-shadow: 0 0 30rpx -6rpx rgba(180, 180, 180, 0.24);
        &.fixed {
            position: fixed;
        }
        .item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #999;
            &.active {
                color: $APP_COLOR;
            }
            .iconfont {
                font-size: 46rpx;
                line-height: 1em;
            }
            .text {
                font-size: 26rpx;
                margin-top: 6rpx;
            }
        }
    }
}
</style>

