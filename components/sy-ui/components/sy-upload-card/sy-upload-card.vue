<!--
* @description 上传组件卡片样式
* @author yxs
!-->
<template>
    <view
        :class="[`style${__props.styleType}`, {
            readonly: __props.readonly,
            disabled: __props.disabled
        }]"
        class="upload-card"
    >
        <view v-if="fileData" class="preview" @click="handlePreviewImage">
            <image :src="previewPath" mode="aspectFill" />
        </view>
        <view v-else class="icon sy-ui-icon-camera" @click="handleChooseButton" />
        <view class="text">
            <template v-if="__props.readonly && !fileList.length">
                {{ __props.placeholder }}
            </template>
            <template v-else>
                {{ __props.label }}
            </template>
        </view>
        <view v-if="!__props.readonly" class="button" @click.stop="handleChooseButton">
            {{ uploading ? '上传中...' : '更换' }}
        </view>
        <sy-upload
            ref="SyUpload"
            :props="uploadProps"
            hidden
            @drawbefore="$emit('drawbefore', $event)"
            @drawafter="$emit('drawafter', $event)"
            @choose="handleUploadChoose"
            @complete="handleUploadComplete"
            @fail="handleUploadFail"
            @success="handleUploadSuccess"
        />
    </view>
</template>
<script>
    // 方法
    import props from './props'
    import mixinProps, { assignProps } from '../../mixin/props'
    import {
        previewImgSrc,
        baseImgSrc
    } from '@/utils'
    // 组件

    export default {
        name: 'SyUploadCard',
        mixins: [mixinProps],
        props,
        data() {
            return {
                fileData: null,
                uploading: false
            }
        },
        computed: {
            fileList() {
                if (this.fileData) {
                    return [this.fileData]
                }
                return []
            },
            previewPath() {
                let data = this.fileData
                if (data) {
                    if (data.previewPath) {
                        return data.previewPath
                    } else {
                        return previewImgSrc + data.fileId
                    }
                }
                return ''
            },
            originalPath() {
                let data = this.fileData
                if (data) {
                    return baseImgSrc + data.fileId
                }
                return ''
            },
            uploadProps() {
                return assignProps('SyUpload', {
                    ...this.__props,
                    fileList: this.fileList
                })
            }
        },
        watch: {
            '__props.value': {
                deep: true,
                immediate: true,
                handler(value) {
                    this.fileData = value
                }
            }
        },
        methods: {
            // 上传组件选择文件时触发
            handleUploadChoose(data) {
                let fileData = data.files[0]
                this.fileData = {
                    previewPath: fileData.original
                }
                this.uploading = true
                this.$emit('choose', data)
            },
            // 上传组件全部上传完成时触发
            handleUploadComplete(data) {
                this.uploading = false
                this.$emit('complete', data)
            },
            // 上传组件上传失败时触发
            handleUploadFail(data) {
                this.fileData = null
                uni.showToast({
                    title: '上传失败，请重试',
                    icon: 'none',
                    duration: 2000
                })
                this.$emit('fail', data)
            },
            // 上传组件上传成功时触发
            handleUploadSuccess(data) {
                this.fileData = data
                this.$emit('success', data)
            },
            // 点击更换按钮时触发
            handleChooseButton() {
                if (this.uploading || this.__props.readonly || this.__props.disabled) return
                this.$refs.SyUpload.handleChooseButton()
            },
            // 图片预览
            handlePreviewImage() {
                if (this.uploading || this.__props.disabled) return
                uni.previewImage({
                    current: this.originalPath,
                    urls: [this.originalPath]
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.upload-card{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 40rpx;
    border: 2rpx solid $APP_COLOR;
    .preview {
        position: relative;
        z-index: 21;
        background: #eee;
        image{
            width: 100%;
            height: 100%;
            border-radius: inherit;
        }
    }
    &.style1 {
        padding: 30rpx;
        .preview {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
        }
        .icon {
            width: 120rpx;
            height: 120rpx;
            line-height: 120rpx;
            background: $APP_BACKGROUND;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            font-size: 46rpx;
        }
        .text{
            color: #999;
            margin-top: 15rpx;
        }
        .button {
            position: absolute;
            padding: 30rpx;
            right: 0;
            top: 0;
            color: $APP_COLOR;
            font-size: 22rpx;
        }
    }
    &.style2 {
        padding-bottom: 52rpx;
        height: 182rpx;
        overflow: hidden;
        .preview {
            position: absolute;
            top: 12rpx;
            left: 12rpx;
            right: 12rpx;
            bottom: 52rpx;
            border-radius: 40rpx 40rpx 0 0;
        }
        .icon {
            color: $APP_COLOR;
            font-size: 52rpx;
            margin-top: 12rpx;
        }
        .text{
            font-size: 22rpx;
            color: #999;
            margin-top: 12rpx;
            line-height: 30rpx;
        }
        .button {
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 52rpx;
            background: $APP_BACKGROUND;
            text-align: center;
            line-height: 52rpx;
            color: #fff;
            font-size: 22rpx;
        }
    }
    &.readonly {
        &.style2 {
            padding-bottom: 0;
            height: 234rpx;
            .preview {
                bottom: 12rpx;
                border-radius: 40rpx;
            }
        }
    }
    &.disabled {
        view {
            opacity: .7;
        }
    }
}
</style>
