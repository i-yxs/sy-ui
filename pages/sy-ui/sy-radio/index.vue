<template>
    <view class="content">
        <view class="title">
            基础用法
        </view>
        <sy-radio v-model="radio1" label="1" text="选项1" />
        <sy-radio v-model="radio1" label="2" text="选项2" />
        <view class="title">
            按钮样式
        </view>
        <sy-radio v-model="radio1" label="1" text="选项1" button />
        <sy-radio v-model="radio1" label="2" text="选项2" button />
        <view class="title">
            禁用状态
        </view>
        <sy-radio v-model="radio1" label="1" text="选项1" disabled />
        <sy-radio v-model="radio1" label="2" text="选项2" disabled />
        <view class="title">
            单选按钮组
        </view>
        <sy-radio-group v-model="radio1" :options="options" />
        <view class="title">
            单选按钮组按钮样式
        </view>
        <sy-radio-group v-model="radio1" :options="options" button />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                radio1: '1',
                options: [
                    { label: '选项1', value: '1' },
                    { label: '选项2', value: '2' },
                    { label: '选项3', value: '3' }
                ]
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
