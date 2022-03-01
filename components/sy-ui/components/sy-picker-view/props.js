export default {
    mode: { type: String, default: 'selector' }, // 选择器的模式 selector、multiSelector、time、date、linkage
    value: null,
    height: { type: String, default: '200rpx' }, // 选择器的高度
    options: null, // 数据源
    labelKey: { type: String, default: 'label' }, // 指定选择器的标签为数据源的某个属性
    valueKey: { type: String, default: 'value' }, // 指定选择器的值为数据源的某个属性
    // time、date选择器属性
    min: String, // 可选的最晚时间
    max: String, // 可选的最早时间
    format: String, // 日期格式YYYY-MM-DD 时间格式hh(HH):mm:ss
    indicatorStyle: { type: String, default: 'height:44px;' }, // 选中框的样式
    // linkage选择器参数
    deep: { type: [Number, String], default: 999 }, // 最大节点深度
    emitPath: Boolean, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
    childrenKey: { type: String, default: 'children' } // 指定节点子节点列表为节点对象的某个属性值
}
