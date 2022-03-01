<template>
    <view class="content">
        <sy-button-group
            :options="[
                {type: 'primary',text: '从中间弹出', value: 'center'},
                {type: 'primary', text: '从上方弹出', value: 'top'},
                {type: 'primary', text: '从下方弹出', value: 'bottom'},
                {type: 'primary', text: '从左边弹出', value: 'left'},
                {type: 'primary', text: '从右边弹出', value: 'right'},
            ]"
            column
            @click="handleButtonClick"
        />
        <sy-popover
            :position="position"
            :visible="visible"
            @masktap="visible = false"
        >
            <view :class="position" class="popover-content">
                弹出框的方向：{{ position }}
            </view>
        </sy-popover>
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                visible: false,
                position: ''
            }
        },
        methods: {
            handleButtonClick({ data }) {
                this.visible = true
                this.position = data.value
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
    .popover-content{
        background: #fff;
        &.center{
            width: 80vw;
            height: 80vh;
        }
        &.top,
        &.bottom{
            width: 100vw;
            height: 60vh;
        }
        &.left,
        &.right{
            width: 60vw;
            height: 100vh;
        }
    }
}
</style>
