import fly from '@/utils/fly'

export default {
    // 获取字典数据
    getAllDict(params) {
        return fly.request({
            url: 'getAllDict',
            method: 'get',
            params
        })
    }
}
