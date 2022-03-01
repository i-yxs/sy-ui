/**
 * 系统稳定数据
 */

// API
import resourceApi from '@/api/resource'
// 工具
import enums from '@/utils/enum'

const dict = {
    state: {
        // 字典
        dict: {},
    },
    getters: {
    },
    actions: {
        initBaseData({ dispatch }) {
            // 异步请求
            // 同步请求
            return Promise.all([
                dispatch('queryDict')
            ])
        },
        // 获取字典数据
        async queryDict({ state }) {
            // let data = await resourceApi.getAllDict()
            let dict = {}
            // data.forEach(item => {
            //     dict[item.value] = item.children.map(v => {
            //         return {
            //             value: v.value,
            //             label: v.label
            //         }
            //     })
            // })
            Object.keys(enums).forEach(key => {
                dict[key] = enums[key]
            })
            state.dict = dict
        }
    }
}

export default dict
