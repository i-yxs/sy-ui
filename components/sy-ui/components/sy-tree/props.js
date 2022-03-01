
export default {
    deep: { default: 999 }, // 最大显示层级
    options: null, // 数据源
    multiple: Boolean, // 是否可以多选
    labelKey: { type: String, default: 'label' }, // 指定label为数据源的某个属性
    valueKey: { type: String, default: 'value' }, // 指定value为数据源的某个属性
    childrenKey: { type: String, default: 'children' }, // 指定子节点为数据源的某个属性
    emptyText: { type: String, default: '没有数据' }, // 内容为空的时候展示的文本
    accordion: Boolean, // 是否每次只能展开一个同级树节点
    selectable: Boolean, // 节点是否可以选中
    nodeIcon: { type: String, default: 'sy-ui-icon-arrow-right-fill' }, // 节点图标
    nodeHeight: { type: String, default: '90rpx' }, // 节点高度
    nodeIconStyle: {
        type: Object,
        default: () => ({
            color: '#999',
            width: '22rpx',
            fontSize: '22rpx'
        })
    }, // 节点图标样式
    showNodeCount: Boolean, // 是否显示可见的子节点数量
    checkStrictly: Boolean, // 是否严格的遵守父子节点不互相关联，默认只能选中叶子节点，设置为true时所有节点都可以选中
    enableAnimate: { type: Boolean, default: true }, // 展开和收起时是否启用动画，必须设置nodeHeight才有效
    nodeLabelRows: { default: 1 }, // 节点label最多显示行数
    showLineBetween: { type: Boolean, default: true }, // 是否显示分隔线
    defaultExpandAll: Boolean, // 是否默认展开所有节点
    autoExpandParent: Boolean, // 展开子节点的时候是否自动展开父节点，数据量较大时谨慎开启
    defaultSelectedValues: Array, // 默认选中的节点的 value 的数组
    defaultExpandedValues: Array // 默认展开的节点的 value 的数组
}
