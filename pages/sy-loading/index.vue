<template>
    <view class="content">
        <view class="title">
            默认加载提示
        </view>
        <view class="container">
            <sy-loading :value="true" />
        </view>
        <view class="title">
            自定义提示文字
        </view>
        <view class="container">
            <sy-loading :value="true" text="拼命加载中" />
        </view>
        <view class="title">
            自定义背景颜色
        </view>
        <view class="container">
            <sy-loading :value="true" text="拼命加载中" color="#fff" background="rgba(64, 158, 255,.8)" />
        </view>
        <view class="title">
            纵列显示
        </view>
        <view class="container">
            <sy-loading :value="true" column />
        </view>
        <view class="title">
            自定义slot
        </view>
        <view class="container">
            <sy-loading :value="true" column>
                <view class="loading-text">
                    自定义slot
                </view>
            </sy-loading>
        </view>
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
            }
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
    .container {
        position: relative;
        width: 100%;
        height: 200rpx;
    }
}
</style>
