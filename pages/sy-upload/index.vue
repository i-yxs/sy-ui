<template>
    <view class="content">
        <view class="title">
            1、最小尺寸、圆形
        </view>
        <sy-upload
            :file-list="fileList"
            :config="config"
            circle
            size="mini"
            @remove="handleRemove"
            @success="handleSuccess"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        />
        <view class="title">
            2、小型尺寸、圆角
        </view>
        <sy-upload
            :file-list="fileList"
            :config="config"
            round
            size="small"
            @remove="handleRemove"
            @success="handleSuccess"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        />
        <view class="title">
            3、中型尺寸、圆形
        </view>
        <sy-upload
            :file-list="fileList"
            :config="config1"
            circle
            size="medium"
            @remove="handleRemove"
            @success="handleSuccess"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        />
        <view class="title">
            4、默认尺寸、圆角形状
        </view>
        <sy-upload
            :file-list="fileList"
            :config="config1"
            round
            location-to-before-draw
            @remove="handleRemove"
            @success="handleSuccess"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        />
        <view class="title">
            4、仅展示，不可新增、删除
        </view>
        <sy-upload
            :file-list="fileList"
            :config="config2"
            round
        />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                fileList: [
                    {
                        fileId: '0945fa5e-8d8a-4006-845b-dbfff17c62fc',
                        fileName: 'tmp_4cd559684be743cdb1998d40ce888efd5c0059c0672e3c55.png'
                    },
                    {
                        type: 'video',
                        fileId: 'a5b3ed4a-245a-44bb-91fb-3fe53a6c555f',
                        fileName: 'wxe7c86203319fbc61.o6zAJsyCj0TcGz3S9FE7ENgdPVkQ.xu2qJT4HoCVV9e485fd008bfb074e6128e9062a97cc9.mp4'
                    }
                ],
                config: {
                    action: 'https://api.shunone.com/api/file',
                    name: 'file',
                    originalUrl: 'https://api.shunone.com/api/file/download/',
                    fileIdKey: 'fileId',
                    maxFileCount: 9,
                    actionText: '选择文件'
                },
                // 上传图片配置
                config1: {
                    action: 'https://api.shunone.com/api/file',
                    name: 'file',
                    originalUrl: 'https://api.shunone.com/api/file/download/',
                    fileIdKey: 'fileId',
                    actionText: '选择视频',
                    sourceType: ['video']
                },
                // 仅展示用配置，不可新增、删除
                config2: {
                    action: 'https://jsonplaceholder.typicode.com/posts/',
                    name: 'file',
                    originalUrl: 'https://api.shunone.com/api/file/download/',
                    fileIdKey: 'fileId',
                    showRemove: false,
                    maxFileCount: 0,
                    actionText: '选择文件'
                }
            }
        },
        methods: {
            // 点击删除时触发
            handleRemove(index) {
                this.fileList.splice(index, 1)
            },
            // 上传成功时触发
            handleSuccess(model, fileData) {
                this.fileList.push(Object.assign({}, fileData, model.data[0]))
            },
            /**
             * 绘制图片前触发
             */
            handleDrawbefore({ dpr, width, height, image, source, context2d, otherData }) {
                /**
                 * 绘制圆角图片
                 */
                // const roundRect = (w, h, r) => {
                //     if (w < 2 * r) r = w / 2
                //     if (h < 2 * r) r = h / 2
                //     context2d.beginPath()
                //     context2d.moveTo(r, 0)
                //     context2d.arcTo(w, 0, w, h, r)
                //     context2d.arcTo(w, h, 0, h, r)
                //     context2d.arcTo(0, h, 0, 0, r)
                //     context2d.arcTo(0, 0, w, 0, r)
                //     context2d.closePath()
                // }
                // roundRect(width, height, Math.max(width, height) / 2)
                // context2d.clip()
            },
            /**
             * 绘制图片后触发
             */
            handleDrawafter({ dpr, width, height, image, source, context2d, otherData }) {
                // 只有是相机拍摄的才绘制水印
                if (source === 'camera') {
                    /**
                     * 绘制时间水印
                     */
                    const date = new Date()
                    context2d.setTextBaseline('top')
                    context2d.setFillStyle('#f00')
                    context2d.setFontSize(16 / dpr)
                    context2d.fillText(
                        `拍摄时间：${date.getFullYear()}-${date.getMonth() +
                            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                        20 / dpr,
                        20 / dpr
                    )

                    context2d.fillText(
                        `经度：${otherData.location.longitude}`,
                        20 / dpr,
                        45 / dpr
                    )
                    context2d.fillText(
                        `纬度：${otherData.location.latitude}`,
                        20 / dpr,
                        70 / dpr
                    )
                }
            },
            /**
             * 提交验证
             */
            handleSubmit() {
                let errorMsg = ''
                this.imageList.every((item, ridx) => {
                    const count = item.image.length + 1
                    item.upload.every((item, cidx) => {
                        switch (item) {
                        case 10001:
                            errorMsg = `第${ridx + count}个组件的第${cidx +
                            count}张图片处理失败！`
                            return false
                        case 10002:
                            errorMsg = `第${ridx + count}个组件的第${cidx +
                            count}张图片正在处理中！`
                            return false
                        }
                        return true
                    })
                    return !errorMsg
                })

                if (errorMsg) {
                    uni.showToast({
                        mask: false,
                        icon: 'none',
                        title: errorMsg,
                        duration: 2000
                    })
                    return
                }

                console.log(
                    'upload1',
                    this.imageList[0].image.concat(this.imageList[0].upload)
                )
                console.log(
                    'upload2',
                    this.imageList[1].image.concat(this.imageList[1].upload)
                )
                console.log(
                    'upload3',
                    this.imageList[2].image.concat(this.imageList[2].upload)
                )
                console.log(
                    'upload4',
                    this.imageList[3].image.concat(this.imageList[3].upload)
                )
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
