// 全局混入
import {
    checkFeature
} from '@/utils'

export default {
    filters: {
        checkFeature
    },
    methods: {
        checkFeature,
        // 设置自定义底部栏选中项
        setCustomTabBar(index) {
            let page = this.$mp.page
            if (typeof page.getTabBar === 'function' && page.getTabBar()) {
                page.getTabBar().setData({
                    selected: index
                })
            }
        }
    }
}
