
export default {
    name: 'file',
    fileIdKey: 'fileId',
    action: '上传url',
    originalUrl: '下载源文件url',
    thumbnailUrl: '下载预览文件url',
    headers: {
        token: 'token'
    },
    fixResponse: function(response) {
        switch (response.code) {
        case 200:
            return response.data
        default:
            uni.showToast({
                icon: 'none',
                title: response.msg || '网络错误！',
                duration: 2000
            })
            return
        }
    }
}
