<!--
* @description 图片上传组件
* @author i-yxs
!-->
<template>
    <!--图片选择-->
    <view
        :class="{
            readonly: readonly,
            disabled: disabled,
            overlay: overlay
        }"
        class="sy-upload"
    >
        <template v-if="!hidden">
            <view v-if="showFileList || showActionButton" class="preview-list">
                <!-- 选择文件按钮 -->
                <view v-if="showActionButton" class="preview-item">
                    <view
                        :class="[size, {round: round, circle: circle}]"
                        class="action-button"
                        @tap="handleChooseButton"
                    >
                        <template v-if="!overlay">
                            <view class="action-icon sy-ui-icon-camera" />
                            <view v-if="configOption.actionText" class="action-text">
                                {{ configOption.actionText }}
                            </view>
                        </template>
                    </view>
                </view>
                <template v-if="showFileList">
                    <!-- 默认展示的媒体文件列表 -->
                    <view
                        v-for="(file, index) in fileShowList.mediaList"
                        :key="index"
                        class="preview-item"
                    >
                        <view
                            :class="[size, {round: round, circle: circle}]"
                            class="preview-wrap"
                        >
                            <view
                                v-if="file.fileType === 'video'"
                                class="preview-video"
                                @tap="handlePlayVideo(file)"
                            >
                                <view class="sy-ui-icon-play" />
                            </view>
                            <view v-else class="preview-image">
                                <image
                                    :src="getPreviewPath(file)"
                                    class="preview-image"
                                    mode="aspectFill"
                                    @tap="handlePreviewImage(file)"
                                />
                            </view>
                            <view
                                v-if="configOption.showRemove && !readonly"
                                class="remove-button"
                                @tap="handleDelete(file, 'uploaded')"
                            >
                                <view class="icon sy-ui-icon-close"/>
                            </view>
                        </view>
                    </view>
                    <!-- 正在上传的媒体文件列表 -->
                    <view
                        v-for="file in fileShowList.mediaUpload"
                        :key="file.timestamp"
                        class="preview-item"
                    >
                        <view
                            :class="[size, {round: round, circle: circle}]"
                            class="preview-wrap"
                        >
                            <view v-if="file.fileType === 'video'" class="preview-video" />
                            <view v-else class="preview-image">
                                <image
                                    :src="file.thumb"
                                    mode="aspectFill"
                                />
                            </view>
                            <view v-if="file.progress < 100" class="upload-progress">
                                <view
                                    v-if="file.progress === -1"
                                    class="error-text"
                                    @tap="handleRestart(file)"
                                >
                                    重试
                                </view>
                                <view v-else class="progress-bar">
                                    <view :style="{width: file.progress + '%'}" class="progress" />
                                </view>
                            </view>
                            <view
                                v-if="file.progress === -1 && configOption.showRemove"
                                class="remove-button"
                                @tap="handleDelete(file, 'uploading')"
                            >
                                <view class="icon sy-ui-icon-close"/>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
            <view v-if="showFileList" class="file-list">
                <!-- 默认展示的非媒体文件列表 -->
                <view
                    v-for="(file, index) in fileShowList.fileList"
                    :key="index"
                    class="file-item sy-ui-border-top"
                    @tap="handlePreviewFile(file)"
                >
                    <text class="name sy-ui-folded f1">{{ file.fileName || '未知文件' }}</text>
                    <text v-if="file.downloading" class="progress">{{ file.progress }}%</text>
                    <text
                        v-if="configOption.showRemove && !readonly"
                        class="remove-button sy-ui-icon-close"
                        @tap.stop="handleDelete(file, 'uploaded')"
                    />
                </view>
                <!-- 正在上传的非媒体文件列表 -->
                <view
                    v-for="file in fileShowList.fileUpload"
                    :key="file.timestamp"
                    class="file-item sy-ui-border-top"
                >
                    <text class="name sy-ui-folded f1">{{ file.fileName || '未知文件' }}</text>
                    <text class="progress">{{ file.progress }}%</text>
                    <text
                        v-if="file.progress === -1 && configOption.showRemove"
                        class="remove-button sy-ui-icon-close"
                        @tap="handleDelete(file, 'uploading')"
                    />
                </view>
            </view>
            <view v-if="readonly && !fileList.length" class="input-placeholder">
                {{ placeholder }}
            </view>
        </template>
        <view v-if="!readonly" class="export-canvas">
            <!-- #ifdef MP-WEIXIN -->
            <canvas
                :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
                canvas-id="ImageExportCanvas"
            />
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <canvas
                :canvas-id="canvasId"
                :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
            />
            <!-- #endif -->
        </view>
        <view v-if="videoUrl" class="video-wrap">
            <video
                :src="videoUrl"
                object-fit="fill"
                autoplay
            />
            <view class="close sy-ui-icon-close" @tap="videoUrl = ''" />
        </view>
        <sy-action-sheet
            v-if="!readonly && !disabled"
            :visible.sync="popoverVisible"
            :options="sourceTypeEnum"
            @click="handleSourceChange"
        />
    </view>
</template>
<script>
    // 方法
    import {
        QUEUES_KEY,
        DEFAULT_CONFIG,
        OPEN_FILE_TYPE,
        SOURCE_TYPE_ENUM,
        getFileType,
        getLocation,
        getImageInfo,
        getFileExtension,
        getEllipsisString
    } from './utils'

    export default {
        name: 'SyUpload',
        props: {
            // 组件的尺寸，mini、small、medium、normal
            size: { type: String, default: 'normal' },
            // 是否圆角
            round: { type: Boolean, default: false },
            // 是否圆形
            circle: { type: Boolean, default: false },
            // 配置项
            config: { type: Object, default: () => ({}) },
            // 默认展示的文件列表
            fileList: { type: Array, default: () => [] },
            // 是否只读
            readonly: { type: Boolean, default: false },
            // 是否禁用
            disabled: { type: Boolean, default: false },
            // 是否为覆盖模式，组件变为不可见，覆盖容器内容
            overlay: { type: Boolean, default: false },
            // 是否显示组件，组件变为不可见，可以使用ref获取组件实例
            hidden: { type: Boolean, default: false },
            // 没有值时的占位符
            placeholder: String,
            // 是否绘制前获取地理位置
            locationToBeforeDraw: { type: Boolean, default: false }
        },
        data() {
            return {
                // #ifdef MP-WEIXIN
                canvasId: 'ImageExportCanvas', // canvas的Id
                // #endif
                // #ifndef MP-WEIXIN
                canvasId: `ImageExportCanvas${Date.now()}`, // canvas的Id
                // #endif
                videoUrl: '',
                canvasWidth: 0, // canvas的宽度
                canvasHeight: 0, // canvas的高度
                uploadingList: [], // 上传中的文件列表
                popoverVisible: false // 用于表示source-type弹出层的显示状态
            }
        },
        computed: {
            // 文件展示列表
            fileShowList() {
                let { uploadedList, uploadingList } = this
                return {
                    fileList: uploadedList.filter(v => v.fileType === 'file'),
                    fileUpload: uploadingList.filter(v => v.fileType === 'file'),
                    mediaList: uploadedList.filter(v => ['image', 'video'].includes(v.fileType)),
                    mediaUpload: uploadingList.filter(v => ['image', 'video'].includes(v.fileType))
                }
            },
            // 上传完成的文件列表
            uploadedList() {
                return this.fileList.map(({ fileId, fileName, previewPath }) => {
                    return {
                        fileId,
                        fileType: getFileType(fileName),
                        fileName: getEllipsisString(fileName || '', 40),
                        progress: 0,
                        previewPath,
                        downloading: false
                    }
                })
            },
            // 是否显示文件列表
            showFileList() {
                return !this.overlay && (this.fileList.length || this.uploadingList.length)
            },
            // 是否显示按钮
            showActionButton() {
                return !this.isMaxFileCount && !this.readonly
            },
            // 当前图片数量
            imageCount() {
                return this.fileList.length + this.uploadingList.length
            },
            // 当前配置
            configOption() {
                return Object.assign({}, DEFAULT_CONFIG, this.config)
            },
            // 是否达到最大上传图片张数
            isMaxFileCount() {
                return this.imageCount >= this.configOption.maxFileCount
            },
            // 选择来源列表
            sourceTypeEnum() {
                return SOURCE_TYPE_ENUM.filter(item => this.configOption.sourceType.indexOf(item.value) > -1)
            }
        },
        watch: {
            readonly: {
                immediate: true,
                handler() {
                    // context2d
                    this.context2d = uni.createCanvasContext(this.canvasId, this)
                }
            }
        },
        mounted() {
            // 获取屏幕dpr
            this.dpr = uni.getSystemInfoSync().pixelRatio
            // 队列处理列表，因为所有组件共用一个canvas，所以这里用$root保存队列数据
            this.queues = this.$root[QUEUES_KEY] = this.$root[QUEUES_KEY] || []
        },
        methods: {
            // 获取文件的预览路径
            getPreviewPath(file) {
                if (file) {
                    if (file.previewPath) {
                        return file.previewPath
                    } else {
                        let { fileUrl, videoUrl, fileIdKey, originalUrl, thumbnailUrl } = this.configOption
                        switch (file.fileType) {
                        case 'file': return (fileUrl || originalUrl) + file[fileIdKey]
                        case 'video': return (videoUrl || originalUrl) + file[fileIdKey]
                        case 'image': return `${thumbnailUrl}${file[fileIdKey]}?w=100&h=100`
                        }
                    }
                }
            },
            // 获取文件的原始路径
            getOriginalPath(file) {
                let { fileUrl, videoUrl, fileIdKey, originalUrl } = this.configOption
                switch (file.fileType) {
                case 'file': return (fileUrl || originalUrl) + file[fileIdKey]
                case 'video': return (videoUrl || originalUrl) + file[fileIdKey]
                case 'image': return originalUrl + file[fileIdKey]
                }
            },
            // 获取文件对象
            getFileData(data) {
                let fileData = {
                    fileType: data.type,
                    progress: 0, // 处理进度
                    timestamp: Date.now() - Math.random(),
                    _componentUid: this._uid,
                    _handleQueues: this.handleQueues,
                    _handleComplete: () => {
                        this.handleEmit('complete')
                    }
                }
                switch (data.type) {
                case 'image':
                    Object.assign(fileData, {
                        path: '', // 待上传的图片url
                        thumb: '', // 缩略图
                        original: data.path, // 原始图片
                        source: data.source // 获取图片的方式
                    })
                    break
                case 'video':
                    Object.assign(fileData, {
                        path: data.path,
                        size: data.size,
                        duration: Number(data.duration.toFixed(2))
                    })
                    break
                case 'file':
                    Object.assign(fileData, {
                        path: data.path,
                        size: data.size,
                        fileName: data.name
                    })
                    break
                }
                return fileData
            },
            // 队列处理
            handleQueues(index) {
                this.queuesIndex = index
                const fileData = this.queues[index]
                // 选择完图片进度+10
                fileData.progress = 10
                this.handleEmit('change', { fileData })
                this.drawImage(fileData)
                    .then(path => {
                        // 压缩完成进度+20
                        fileData.path = path
                        fileData.progress = 30
                        this.handleEmit('change', { fileData })
                        return this.drawThumb(fileData)
                    })
                    .then(thumb => {
                        // 缩略图绘制完成进度+20
                        fileData.thumb = thumb
                        fileData.progress = 50
                        this.handleEmit('change', { fileData })
                        /**
                         * 如果action、name有值则上传文件
                         */
                        const config = this.configOption
                        if (config.action && config.name) {
                            return this.uploadFile(fileData.path, res => {
                                // 更新上传进度
                                fileData.progress = (res.progress / 100) * 49 + 50
                                this.handleEmit('change', { fileData })
                            })
                        } else {
                            throw new Error('配置项 action、name 不能为空')
                        }
                    })
                    .then(result => {
                        fileData.progress = 100
                        this.handleEmit('success', {
                            result,
                            fileData
                        })
                        // 上传成功删除当前图片对象
                        this.uploadingList.splice(this.uploadingList.indexOf(fileData), 1)
                        this.nextQueues()
                    })
                    .catch(res => {
                        console.error(res)
                        // 处理失败，还原状态
                        fileData.progress = -1
                        this.handleEmit('fail', { fileData })
                        this.nextQueues()
                    })
            },
            // 开始下一个队列
            nextQueues() {
                if (++this.queuesIndex < this.queues.length) {
                    this.queues[this.queuesIndex]._handleQueues(this.queuesIndex)
                } else {
                    var uids = []
                    this.queues.filter(item => {
                        if (!uids.includes(item._componentUid)) {
                            uids.push(item._componentUid)
                            return true
                        }
                    }).map(item => {
                        item._handleComplete()
                    })
                    this.queuesIndex = -1
                    this.queues.length = 0
                }
            },
            // 加入到队列
            joinQueues(fileData) {
                this.queues.push(fileData)
                if (this.queues.length === 1) {
                    this.queuesIndex = -1
                    this.nextQueues()
                }
            },
            // 绘制图片
            drawImage(fileData) {
                return new Promise((resolve, reject) => {
                    if (fileData.path || fileData.fileType !== 'image') {
                        resolve(fileData.path)
                    } else {
                        const promises = []
                        if (this.locationToBeforeDraw) {
                            // 获取地理位置
                            promises.push(getLocation())
                        }
                        // 获取图片信息
                        promises.push(getImageInfo(fileData.original))

                        var timer = this.handleTimeout(reject)

                        Promise.all(promises).then(res => {
                            clearTimeout(timer)

                            var otherData = {}

                            res.forEach(item => {
                                Object.assign(otherData, item)
                            })
                            /**
                             * 把图片压缩至指定尺寸以下
                             */
                            let width = otherData.imageInfo.width
                            let height = otherData.imageInfo.height
                            const ratio = Math.max(width, height) / this.configOption.exportSize
                            if (ratio > 1) {
                                width = (width / ratio) | 0
                                height = (height / ratio) | 0
                            }
                            width = width / this.dpr
                            height = height / this.dpr

                            this.canvasWidth = width
                            this.canvasHeight = height

                            setTimeout(() => {
                                this.context2d.save()
                                /**
                                 * 抛出drawbefore事件，用户可以自行绘制内容
                                 * 比如可以利用clip限制绘制区域
                                 */
                                this.$emit('drawbefore', {
                                    dpr: this.dpr,
                                    width: width,
                                    height: height,
                                    image: fileData.original,
                                    source: fileData.source,
                                    context2d: this.context2d,
                                    otherData: otherData
                                })
                                this.context2d.drawImage(
                                    fileData.original,
                                    0,
                                    0,
                                    width,
                                    height
                                )
                                /**
                                 * 抛出drawafter事件，用户可以自行绘制内容
                                 * 比如可以在图片上绘制水印
                                 */
                                this.$emit('drawafter', {
                                    dpr: this.dpr,
                                    width: width,
                                    height: height,
                                    image: fileData.original,
                                    source: fileData.source,
                                    context2d: this.context2d,
                                    otherData: otherData
                                })
                                this.context2d.restore()

                                var timer = this.handleTimeout(reject)

                                this.context2d.draw(false, () => {
                                    clearTimeout(timer)
                                    /**
                                     * 延迟300ms
                                     * 解决低配置安卓手机create bitmap failed错误
                                     */
                                    setTimeout(() => {
                                        this.exportImage().then(resolve).catch(reject)
                                    }, 300)
                                })
                            }, 300)
                        }).catch(res => {
                            reject(res)
                        })
                    }
                })
            },
            // 绘制缩略图
            drawThumb(fileData) {
                return new Promise((resolve, reject) => {
                    if (fileData.thumb || fileData.fileType !== 'image') {
                        resolve(fileData.thumb)
                    } else {
                        getImageInfo(fileData.path)
                            .then(({ imageInfo }) => {
                                const wh = 100
                                let sx = 0
                                let sy = 0
                                const min = Math.min(
                                    imageInfo.width,
                                    imageInfo.height
                                )

                                if (imageInfo.width > min) {
                                    sx = (imageInfo.width - min) / 2
                                }
                                if (imageInfo.height > min) {
                                    sy = (imageInfo.height - min) / 2
                                }

                                this.canvasWidth = wh
                                this.canvasHeight = wh

                                setTimeout(() => {
                                    this.context2d.drawImage(
                                        fileData.path,
                                        sx,
                                        sy,
                                        min,
                                        min,
                                        0,
                                        0,
                                        wh,
                                        wh
                                    )
                                    var timer = this.handleTimeout(reject)

                                    this.context2d.draw(false, () => {
                                        clearTimeout(timer)

                                        setTimeout(() => {
                                            this.exportImage()
                                                .then(res => {
                                                    resolve(res)
                                                })
                                                .catch(res => {
                                                    reject(res)
                                                })
                                        }, 300)
                                    })
                                }, 300)
                            })
                            .catch(res => {
                                reject(res)
                            })
                    }
                })
            },
            // 导出图片
            exportImage() {
                return new Promise((resolve, reject) => {
                    var timer = this.handleTimeout(reject)
                    uni.canvasToTempFilePath(
                        {
                            x: 0,
                            y: 0,
                            quality: this.configOption.quality,
                            fileType: this.configOption.fileType,
                            canvasId: this.canvasId,
                            success(res) {
                                resolve(res.tempFilePath)
                            },
                            fail(res) {
                                reject(res)
                            },
                            complete: () => {
                                clearTimeout(timer)
                            }
                        },
                        this
                    )
                })
            },
            // 上传图片
            uploadFile(path, progressUpdate) {
                return new Promise((resolve, reject) => {
                    let timer = this.handleTimeout(reject)
                    let { name, action, headers } = this.configOption
                    let uploadTask = uni.uploadFile({
                        url: action,
                        name,
                        header: headers,
                        filePath: path,
                        success: (res) => {
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                                try {
                                    let data = this.configOption.fixResponse(JSON.parse(res.data))
                                    if (data) {
                                        return resolve(data)
                                    }
                                } catch (err) {
                                    console.error(err, res)
                                }
                            }
                            reject(`上传失败 ${res.statusCode}`)
                        },
                        fail(err) {
                            reject(err)
                        },
                        complete: () => {
                            clearTimeout(timer)
                        }
                    })
                    uploadTask.onProgressUpdate(progressUpdate)
                })
            },
            // 发送事件
            handleEmit(name, data) {
                let uploading = this.uploadingList.filter(item => item.progress >= 0 && item.progress < 100).length
                let uploadfail = this.uploadingList.filter(item => item.progress === -1).length
                if (name !== 'change') {
                    this.$emit(name, {
                        ...data,
                        uploading,
                        uploadfail
                    })
                }
                this.$emit('change', {
                    uploading,
                    uploadfail
                })
            },
            // 超时处理
            handleTimeout(func) {
                return setTimeout(() => {
                    func('处理超时！')
                }, this.configOption.timeout)
            },
            // 点击重试按钮时触发
            handleRestart(fileData) {
                fileData.progress = 0
                this.handleEmit('restart', { fileData })
                this.joinQueues(fileData)
            },
            // 点击选择文件按钮时触发
            handleChooseButton() {
                let { sourceType } = this.configOption
                if (sourceType.length === 1) {
                    let data = {
                        value: sourceType[0]
                    }
                    this.handleSourceChange({ data })
                } else {
                    this.popoverVisible = true
                }
            },
            // 点击选择方式按钮时触发
            handleSourceChange({ data }) {
                switch (data.value) {
                case 'album':
                case 'camera':
                    this.handleChooseMedia(data.value)
                    break
                case 'message':
                    this.handleChooseFile()
                    break
                }
                this.popoverVisible = false
            },
            // 选择图片or视频文件
            handleChooseMedia(type) {
                let { camera, maxFileCount, maxDuration } = this.configOption
                let uniApi = uni.chooseMedia
                // #ifdef H5
                uniApi = uni.chooseImage
                // #endif
                uniApi({
                    count: Math.min(maxFileCount - this.imageCount, 9),
                    camera,
                    mediaType: this.mediaType,
                    sourceType: [type],
                    maxDuration: maxDuration,
                    success: res => {
                        // #ifdef H5
                        let files = Array.prototype.slice.apply(res.tempFiles).map((item, index) => {
                            item.tempFilePath = res.tempFilePaths[index]
                            return item
                        })
                        // #endif
                        // #ifdef MP-WEIXIN
                        let files = Array.prototype.slice.apply(res.tempFiles).map((item) => {
                            item.type = getFileType(item.tempFilePath)
                            return item
                        })
                        // #endif
                        if (files.length > maxFileCount) {
                            files.length = maxFileCount
                        }
                        files = files.map(item => {
                            let fileData
                            if (item.type.indexOf('image') > -1) {
                                fileData = this.getFileData({
                                    type: 'image',
                                    path: item.tempFilePath,
                                    source: type
                                })
                            } else if (item.type.indexOf('video') > -1) {
                                fileData = this.getFileData({
                                    type: 'video',
                                    path: item.tempFilePath,
                                    size: item.size,
                                    duration: Number(item.duration.toFixed(2))
                                })
                            }
                            this.joinQueues(fileData)
                            return fileData
                        })
                        this.uploadingList = this.uploadingList.concat(files)
                        this.handleEmit('choose', { files })
                    },
                    file: res => {
                        console.error(res)
                    }
                })
            },
            // 选择非媒体文件
            handleChooseFile() {
                let { maxFileCount, messageFileType, messageFileExtension } = this.configOption
                uni.chooseMessageFile({
                    count: Math.min(maxFileCount - this.imageCount, 100),
                    type: messageFileType,
                    extension: messageFileExtension,
                    success: res => {
                        let files = Array.prototype.slice.apply(res.tempFiles)
                        if (files.length > maxFileCount) {
                            files.length = maxFileCount
                        }
                        files = files.map(item => {
                            let fileData = this.getFileData(item)
                            this.joinQueues(fileData)
                            return fileData
                        })
                        this.uploadingList = this.uploadingList.concat(files)
                        this.handleEmit('choose', { files })
                    },
                    file: res => {
                        console.error(res)
                    }
                })
            },
            // 预览文件
            handlePreviewFile(file) {
                if (OPEN_FILE_TYPE.includes(getFileExtension(file.fileName))) {
                    if (file.downloading) {
                        return this.showToast('文件下载中')
                    }
                    if (file.previewPath) {
                        uni.openDocument({
                            filePath: file.previewPath,
                            fail: (res) => {
                                this.showToast(res.errMsg)
                            }
                        })
                    } else {
                        file.downloading = true
                        file.downloadTask = uni.downloadFile({
                            url: this.getOriginalPath(file),
                            success: (res) => {
                                if (res.statusCode === 200) {
                                    file.previewPath = res.tempFilePath
                                    file.downloading = false
                                    this.handlePreviewFile(file)
                                } else {
                                    this.showToast(res.errMsg)
                                }
                            },
                            fail: (res) => {
                                this.showToast(res.errMsg)
                            }
                        })
                        file.downloadTask.onProgressUpdate(({ progress }) => {
                            file.progress = progress
                        })
                    }
                } else {
                    this.showToast('不支持打开该类型文件')
                }
            },
            // 图片预览
            handlePreviewImage(file) {
                var current = this.getOriginalPath(file)
                uni.previewImage({
                    current,
                    urls: this.uploadedList.filter(item => item.fileType === 'image').map(item => this.getOriginalPath(item))
                })
            },
            // 点击删除按钮时触发
            handleDelete(file, type) {
                switch (type) {
                case 'uploaded':
                    if (file.downloading) {
                        file.progress = 0
                        file.downloadTask.abort()
                        this.showToast('已取消下载')
                    } else {
                        this.handleEmit('remove', this.uploadedList.indexOf(file))
                    }
                    break
                case 'uploading':
                    this.uploadingList.splice(this.uploadingList.indexOf(file), 1)
                    this.handleEmit('removeFailFile')
                    break
                }
            },
            // 删除上传失败的文件
            handleDeleteUpload(file) {
                this.uploadingList.splice(index, 1)
                this.handleEmit('removeFailFile')
            },
            // 点击播放视频
            handlePlayVideo(file) {
                this.videoUrl = this.getPreviewPath(file)
            }
        }
    }
</script>
<style lang="scss" scoped>

.sy-upload {
    .file-list {
        text-align: left;
        .file-item {
            display: flex;
            align-items: center;
            height: 60rpx;
            color: $APP_COLOR;
            &:active {
                background: #f9f9f9;
            }
            &:first-child {
                &::before {
                    display: none;
                }
            }
            .name {
                flex:1;
                font-size: 24rpx;
                text-decoration: underline;
            }
            .progress {
                color: #999;
                font-size: 24rpx;
            }
            .remove-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60rpx;
                height: 60rpx;
                font-size: 18rpx;
                color: $APP_COLOR;
                margin-left: 20rpx;
            }
        }
    }
    .preview-list {
        display: flex;
        flex-wrap: wrap;
        margin-left: -10rpx;
        .preview-item {
            padding: 10rpx;
        }
        .preview-wrap{
            background: #f5f5f5;
            box-shadow: 0 0 0 1px #f1f1f1;
        }
        .action-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;;
            border: 2rpx dashed $APP_COLOR;
            .action-icon{
                color:  $APP_COLOR;
            }
            .action-text{
                color: #999;
            }
        }
        .preview-wrap,
        .action-button {
            position: relative;
            &.mini {
                width: 80rpx;
                height: 80rpx;
                .action-icon{
                    font-size: 26rpx;
                    line-height: 26rpx;
                }
                .action-text{
                    font-size: 12rpx;
                    line-height: 20rpx;
                }
                .remove-button{
                    right: -15rpx;
                    top: -15rpx;
                    width: 30rpx;
                    height: 30rpx;
                    font-size: 12rpx;
                }
                .preview-video {
                    font-size: 30rpx;
                }
            }
            &.small {
                width: 100rpx;
                height: 100rpx;
                .action-icon{
                    font-size: 28rpx;
                    line-height: 28rpx;
                }
                .action-text{
                    font-size: 16rpx;
                    line-height: 24rpx;
                }
                .remove-button {
                    right: -15rpx;
                    top: -15rpx;
                    width: 30rpx;
                    height: 30rpx;
                    font-size: 12rpx;
                }
                .preview-video {
                    font-size: 40rpx;
                }
            }
            &.medium {
                width: 140rpx;
                height: 140rpx;
                .action-icon{
                    font-size: 36rpx;
                    line-height: 36rpx;
                }
                .action-text{
                    font-size: 20rpx;
                    line-height: 34rpx;
                }
                .remove-button {
                    right: -18rpx;
                    top: -18rpx;
                    width: 36rpx;
                    height: 36rpx;
                    font-size: 13rpx;
                }
                .preview-video {
                    font-size: 50rpx;
                }
            }
            &.normal {
                width: 120rpx;
                height: 120rpx;
                .action-icon{
                    font-size: 30rpx;
                    line-height: 30rpx;
                }
                .action-text{
                    font-size: 18rpx;
                    line-height: 30rpx;
                }
                .remove-button {
                    right: -15rpx;
                    top: -15rpx;
                    width: 30rpx;
                    height: 30rpx;
                    font-size: 12rpx;
                }
                .preview-video {
                    font-size: 50rpx;
                }
            }
            &.round {
                border-radius: 20rpx;
            }
            &.circle {
                border-radius: 50%;
            }
        }
        .preview-image,
        .preview-video {
            width: 100%;
            height: 100%;
            border-radius: inherit;
            image{
                width: 100%;
                height: 100%;
                border-radius: inherit;
            }
        }
        .preview-video {
            background: #222;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .remove-button {
            position: absolute;
            z-index: 2;
            padding: 20rpx;
            margin: -20rpx -20rpx 0 0;
            .icon {
                width: inherit;
                height: inherit;
                color: #fff;
                border-radius: 50%;
                background: $DANGER_COLOR;
                box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .upload-progress {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            border-radius: inherit;
            .error-text {
                color: #fff;
                font-size: 26rpx;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .progress-bar {
                position: absolute;
                left: 10rpx;
                right: 10rpx;
                top: 50%;
                height: 10rpx;
                border-radius: 5rpx;
                transform: translateY(-50%);
                background: #fff;
                .progress {
                    width: 0;
                    height: inherit;
                    border-radius: inherit;
                    background: #23abe8;
                }
            }
        }
    }
    .source-type-select {
        background: #fff;
        border-radius: 40rpx 40rpx 0 0;
        .option-item {
            text-align: center;
            position: relative;
            line-height: 50rpx;
            padding: 26rpx;
            font-size: 32rpx;
            color: #666;
            &:active {
                background: #f9f9f9;
            }
            &:after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                border-width: 0;
                bottom: 0;
                border-bottom: solid 1px #ddd;
                transform: scaleY(0.5);
                transform-origin: 0 100%;
            }
        }
    }
    .export-canvas {
        position: fixed;
        left: -9999px;
        top: -9999px;
        opacity: 0;
        pointer-events: none;
    }
    .video-wrap {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 9999999;
        video {
            width: 100%;
            height: 100%;
        }
        .close {
            position: absolute;
            top: 20rpx;
            right: 20rpx;
            z-index: 100;
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            background: rgba(0,0,0,.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 20rpx;
        }
    }
    &.overlay{
        .preview-list,
        .preview-item,
        .action-button{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: initial!important;
            height: initial!important;
            opacity: 0;
        }
    }
    &.disabled {
        pointer-events: none;
        .preview-list {
            opacity: .7;
        }
    }
}
</style>
