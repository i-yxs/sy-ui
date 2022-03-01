
// 全局混入
import {
    getDict,
    isEmpty,
    numberPad,
    systemInfo,
    moneyFormat,
    getDictProp
} from '../utils'
import dateTools from '../utils/dateTools'

export default {
    data() {
        return {
            safeAreaInsetBottom: systemInfo.screenHeight - systemInfo.safeArea.bottom
        }
    },
    filters: {
        // 数字补零
        numberPad,
        // 日期格式化
        dateFormat: (value, format = 'YYYY-MM-DD') => {
            return dateTools.format(value, format) || '- -'
        },
        // 金额格式化
        moneyFormat,
        // 获取字典属性
        getDictProp
    },
    methods: {
        isEmpty,
        getDict,
        getDictProp
    }
}
