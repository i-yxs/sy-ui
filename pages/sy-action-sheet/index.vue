<template>
    <view class="content">
        <view class="title">
            操作菜单
        </view>
        <sy-button text="唤起" @click="visible = true"/>
        <sy-action-sheet
            :visible.sync="visible"
            :options="options"
            @click="handleClick"
        />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                options: [
                    { text: '选项1' },
                    { text: '选项2', disabled: true },
                    { text: '选项3' }
                ],
                visible: false
            }
        },
        methods: {
            handleClick({ data, index }) {
                this.showToast(`你点击了${data.text}`)
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
