<template>
    <view class="content">
        <view class="title">
            基础用法
        </view>
        <sy-steps v-model="step" :options="steps1" />
        <view class="title">
            居中显示，可以手动切换进度
        </view>
        <sy-steps v-model="step" :options="steps2" align-center click-change />
        <view class="title">
            垂直方向显示
        </view>
        <sy-steps v-model="step" :options="steps1" vertical />
        <view class="title">
            垂直方向居中显示
        </view>
        <sy-steps v-model="step" :options="steps2" vertical align-center />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                step: 0,
                steps1: [
                    { title: '步骤1', content: '这是一段很长很长很长很长很长很长很长的描述' },
                    { title: '步骤2', content: '这是一段很长很长很长很长很长很长很长的描述' },
                    { title: '步骤3', content: '这是一段很长很长很长很长很长很长很长的描述' }
                ],
                steps2: [
                    { title: '步骤1', content: '这是一段很长很长很长很长很长很长很长的描述' },
                    { title: '步骤2', content: '这是一段很长很长很长很长很长很长很长的描述' },
                    { title: '步骤3', content: '这是一段很长很长很长很长很长很长很长的描述' },
                    { title: '步骤4', content: '这是一段很长很长很长很长很长很长很长的描述' }
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
