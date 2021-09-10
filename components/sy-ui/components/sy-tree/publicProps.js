export default {
    // 节点图标
    nodeIcon: { type: String, default: 'sy-ui-icon-arrow-right-fill' },
    // 节点高度
    nodeHeight: { type: String, default: '90rpx' },
    // 节点图标大小
    nodeIconSize: { type: String, default: '22rpx' },
    // 节点图标大小
    nodeIconColor: { type: String, default: '#999' },
    // 是否可以多选
    multiple: { type: Boolean, default: false },
    // 节点是否可以选中
    selectable: { type: Boolean, default: false },
    // 是否显示可见的子节点数量
    showNodeCount: { type: Boolean, default: false },
    // 是否显示分隔线
    showLineBetween: { type: Boolean, default: false },
    // 是否严格的遵守父子节点不互相关联，默认只能选中叶子节点，设置为true时所有节点都可以选中
    checkStrictly: { type: Boolean, default: false },
    // 展开和收起时是否启用动画，必须设置nodeHeight才有效
    enableAnimate: { type: Boolean, default: true },
    // 节点label最多显示行数
    nodeLabelRows: { type: [Number, String], default: 1 }
}
