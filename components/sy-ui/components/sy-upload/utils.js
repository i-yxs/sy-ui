
import config from './config'

export const QUEUES_KEY = '____upload_queues____'
export const SOURCE_TYPE_ENUM = [
    { value: 'camera', text: '使用相机拍照' },
    { value: 'album', text: '从相册选择' },
    { value: 'message', text: '从聊天会话选择' }
]
export const OPEN_FILE_TYPE = 'doc,docx,xls,xlsx,ppt,pptx,pdf'.split(',')
// 默认配置
export const DEFAULT_CONFIG = {
    name: '', // 上传的文件字段名
    action: '', // 必选参数，上传的地址
    headers: {}, // 设置上传的请求头部
    timeout: 60000, // 网络超时时长
    actionText: '', // 选择文件按钮的提示文本
    showRemove: true, // 是否显示删除按钮
    exportSize: 1000, // 导出图片的最大宽高
    maxDuration: 30, // 拍摄视频最长拍摄时间，单位秒
    maxFileCount: 9, // 最大上传文件数量 back、front
    camera: 'back', // 使用前置或后置摄像头
    mediaType: ['image', 'video'], // 可选择的文件类型
    sourceType: ['camera', 'album', 'message'], // 指定以什么方式选择文件
    messageFileType: 'all', // 从客户端选择的文件类型 all、video、image、file
    messageFileExtension: void 0, // 根据文件拓展名过滤，仅 messageFileType==file 时有效。每一项都不能是空字符串。默认不过滤
    fileUrl: '', // 指定文件url，与文件url拼接
    videoUrl: '', // 指定视频url，与文件url拼接
    originalUrl: '', // 指定原始图url，与文件url拼接
    thumbnailUrl: '', // 指定缩略图url，与文件url拼接
    fileIdKey: 'path', // 指定预览url为文件对象的某个属性值
    ...config
}
// 文件类型
export const FILE_TYPE = {
    'image': 'bmp,jpg,jpeg,png,gif,webp'.split(','),
    'video': 'mp4,m3u8,ogg,webm'.split(',')
}
// 获取图片对象
export function getImage(src, canvas) {
    return new Promise((resolve, reject) => {
        let img
        // #ifdef MP-WEIXIN
        img = canvas.createImage()
        // #endif
        // #ifdef H5
        img = new Image()
        // #endif
        img.onload = function() {
            resolve(img)
        }
        img.src = src
        img.onerror = reject
    })
}
// 获取文件类型
export function getFileType(fileName) {
    return Object.keys(FILE_TYPE).find(type => {
        return FILE_TYPE[type].findIndex(name => new RegExp(name + '$', 'i').test(fileName)) > -1
    }) || 'file'
}
// Promise方式获取地理位置
export function getLocation() {
    return new Promise(function(resolve, reject) {
        uni.getLocation({
            type: 'gcj02',
            success: resolve,
            fail: reject
        })
    })
}
// Promise方式获取图片信息
export function getImageInfo(path) {
    return new Promise((resolve, reject) => {
        uni.getImageInfo({
            src: path,
            success: resolve,
            fail: reject
        })
    })
}
// 获取文件扩展名
export function getFileExtension(fileName) {
    return fileName.substr(fileName.lastIndexOf('.') + 1)
}
// 截取字符串的指定字节长度
export function substringByte(string, length) {
    let i = 0
    let b = 0
    let l = string.length
    if (length > 0) {
        for (i = 0; i < l; i++) {
            b += string.charCodeAt(i) > 255 ? 2 : 1
            if (b >= length) break
        }
        return string.substring(0, i)
    } else {
        length = Math.abs(length)
        for (i = l; i > 0; i--) {
            b += string.charCodeAt(i) > 255 ? 2 : 1
            if (b >= length) break
        }
        return string.substring(i)
    }
}
// 获取超出指定长度从中间省略的字符串
export function getEllipsisString(string, length) {
    let b = 0
    let l = string.length
    for (let i = 0; i < l; i++) {
        b += string.charCodeAt(i) > 255 ? 2 : 1
    }
    if (b > length) {
        length = length / 2 - 2
        let prefix = string.substring(0, length)
        let suffix = string.substring(string.length - length)
        return substringByte(prefix, length) + '...' + substringByte(suffix, -length)
    }
    return string
}
/**
 * Promise方式setTimeout
 */
export function promiseSetTimeout(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    })
}
