<!--
* @description 模态弹窗
* @author yxs
!-->
<template>
    <sy-popover
        :visible="visible"
        position="center"
    >
        <view class="sy-modal">
            <view v-if="title" class="head-wrap sy-ui-border-bottom">
                <view class="title">{{ title }}</view>
            </view>
            <view class="body-wrap">
                <view class="content">
                    <slot name="content">{{ content }}</slot>
                </view>
            </view>
            <view class="foot-wrap flex">
                <view v-if="showCancel" class="button" @tap="handleCancel">
                    <sy-button :text="cancelText" plain/>
                </view>
                <view class="button" @tap="handleConfirm">
                    <sy-button :text="confirmText" type="primary"/>
                </view>
            </view>
        </view>
    </sy-popover>
</template>
<script>
    export default {
        name: 'SyModal',
        props: {
            title: String,
            content: String,
            visible: { type: Boolean, default: false },
            showCancel: { type: Boolean, default: false },
            cancelText: { type: String, default: '取消' },
            confirmText: { type: String, default: '确定' }
        },
        data() {
            return {
            }
        },
        watch: {
        },
        methods: {
            // 点击取消按钮时触发
            handleCancel() {
                this.$emit('update:visible', false)
                this.$emit('cancel')
            },
            // 点击确定按钮时触发
            handleConfirm() {
                this.$emit('confirm')
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-modal {
    width: 620rpx;
    background: #fff;
    border-radius: 30rpx;
    padding: 30rpx 60rpx;
    box-sizing: border-box;
    .head-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 34rpx;
        font-weight: bold;
        padding-bottom: 30rpx;
    }
    .body-wrap {
        padding: 30rpx 0;
    }
    .foot-wrap {
        padding: 10rpx 0 30rpx;
        .button {
            flex: 1;
            & + .button {
                margin-left: 50rpx;
            }
        }
    }
}
</style>
