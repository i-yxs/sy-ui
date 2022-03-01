
import treeProps from '../sy-tree/props'
import pickerInputProps from '../sy-picker-input/props'

export default {
    ...treeProps,
    ...pickerInputProps,
    title: String, // 弹出框标题文本
    emitPath: Boolean, // 节点选中状态改变时，是否返回由该节点所在的各级菜单的值所组成的数组，默认只返回该节点的值
    required: Boolean, // 是否必需选中一项
    emptyText: { default: '没有找到数据' },
    separator: { type: String, default: '/' }, // 输入框中有多个值时的间隔符
    emptyOption: String, // 当不需要选择任何节点，但是需要显示label，比如设置“全部”，组件会在第一级生成一个label为“全部”，value为null的节点
    showAllLevels: { type: Boolean, default: true } // 输入框中是否显示选中值的完整路径
}
