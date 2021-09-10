<template>
    <view class="content">
        <view class="title">
            默认按钮
        </view>
        <sy-button text="默认按钮" />
        <view class="title">
            主要按钮
        </view>
        <sy-button type="primary" text="主要按钮" />
        <view class="title">
            禁用状态
        </view>
        <sy-button type="primary" disabled text="主要按钮" />
        <view class="title">
            内联按钮
        </view>
        <sy-button inline height="60rpx" radius="30rpx" font-size="24rpx" text="主要按钮" />
        <sy-button type="primary" inline height="60rpx" radius="30rpx" font-size="24rpx" text="主要按钮" />
        <view class="title">
            图标按钮
        </view>
        <sy-button type="primary" prefix-icon="sy-ui-icon-search" />
        <view class="title">
            带图标
        </view>
        <sy-button type="primary" prefix-icon="sy-ui-icon-search" text="主要按钮" />
        <view class="title">
            加载中
        </view>
        <sy-button type="primary" loading text="加载中..." />
        <view class="title">
            按钮组
        </view>
        <sy-button-group
            :options="[
                {text: '按钮1'},
                {type: 'primary', text: '按钮2'},
            ]"
        />
        <view class="title">
            垂直方向按钮组
        </view>
        <sy-button-group
            :options="[
                {text: '默认按钮'},
                {type: 'primary', text: '主要按钮'},
                {type: 'success', text: '成功按钮'},
                {type: 'warning', text: '警告按钮'},
                {type: 'danger', text: '危险按钮'},
                {type: 'info', text: '信息按钮'},
            ]"
            vertical
        />
        <view class="title">
            朴素按钮
        </view>
        <sy-button-group
            :options="[
                {type: 'primary', text: '主要按钮',plain: true},
                {type: 'success', text: '成功按钮',plain: true},
                {type: 'warning', text: '警告按钮',plain: true},
                {type: 'danger', text: '危险按钮',plain: true},
                {type: 'info', text: '信息按钮',plain: true},
            ]"
            vertical
        />
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
}
</style>
