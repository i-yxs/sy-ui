export default {
    min: null, // 可选的最早日期
    max: null, // 可选的最晚日期
    mode: String, // 选择模式 radio：单选 range：范围选择 multiple：多选
    type: { type: String, default: 'date' }, // 选择类型 date: 日期选择器 week：星期选择器 month：月份选择器 year：年份选择器
    value: null, // 选择的值
    loading: Boolean, // 是否加载状态
    defaultTime: Array, // 范围选择时选中日期所使用的当日内具体时刻
    valueFormat: { type: String, default: 'YYYY-MM-DD' }, // 绑定值的格式
    language: { type: String, default: 'zh' }, // 语言
    yearRange: { type: Number, default: 100 }, // 可选择的年份范围（指当前年份的前后多少年份）
    firstDayOfWeek: { type: Number, default: 1 } // 周起始日（可选1-7）
}
