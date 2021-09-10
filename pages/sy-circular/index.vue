<template>
    <view class="content">
        <view class="title">
            默认圆环
        </view>
        <sy-circular
            :value="progress1"
            size="300rpx"
        >
            <view class="progress">
                {{ progress1 * 100 }}%
            </view>
        </sy-circular>
        <view class="title">
            自定义最大值
        </view>
        <sy-circular
            :value="progress2"
            size="300rpx"
            max-value="100"
            width="30rpx"
        >
            <view class="progress">
                {{ progress2 }}%
            </view>
        </sy-circular>
        <view class="title">
            自定义开始角度
        </view>
        <sy-circular
            :start-angle="180"
            :value="progress2"
            size="300rpx"
            max-value="100"
            width="30rpx"
        >
            <view class="progress">
                {{ progress2 }}%
            </view>
        </sy-circular>
        <view class="title">
            自定义结束角度
        </view>
        <sy-circular
            :start-angle="240"
            :end-angle="120"
            :value="progress2"
            size="300rpx"
            max-value="100"
            width="30rpx"
        >
            <view class="progress">
                {{ progress2 }}%
            </view>
        </sy-circular>
        <view class="title">
            镜像
        </view>
        <sy-circular
            :value="progress2"
            mirror
            size="300rpx"
            max-value="100"
            width="30rpx"
        >
            <view class="progress">
                {{ progress2 }}%
            </view>
        </sy-circular>
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                progress1: 0.01,
                progress2: 0
            }
        },
        onLoad(param) {
            var incr = 1
            this.timer = setInterval(() => {
                if ((incr > 0 && this.progress2 >= 100) || (incr < 0 && this.progress2 <= 1)) {
                    incr = incr > 0 ? -1 : 1
                }
                this.progress2 += incr
            }, 16)
        },
        onUnload() {
            clearInterval(this.timer)
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
.content{
    padding: 30rpx;
    background: #fff;
    .title{
        display: block;
        color: #333;
        font-size: 26rpx;
        font-weight: bold;
        border-left: solid 6rpx #ddd;
        padding-left: 12rpx;
        margin: 12rpx 0;
    }
    .progress{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
