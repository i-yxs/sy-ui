
import TreeNode from './TreeNode'
// 树形控件类
class Tree {
    constructor(data = [], props) {
        this.deep = 999 // 最大显示层级
        this.data = data
        this.allNode = [] // 所有节点列表
        this.selected = [] // 选中的节点路径列表
        this.children = [] // 子节点数据
        this.leafNode = [] // 叶子节点
        this.labelKey = 'label' // 指定label为数据源的某个属性
        this.valueKey = 'value' // 指定value为数据源的某个属性
        this.childrenKey = 'children' // 指定子节点为数据源的某个属性

        this.$root = null // SyTree组件的VUE实例

        this.setProps(props)
        this.setData(data)
    }
    // 设置数据
    setData(data) {
        if (Array.isArray(data)) {
            // 递归生成节点数据
            var recursion = (data, parentNode, path, deep) => {
                if (data && data.length && deep <= this.deep) {
                    return data.map((item, index) => {
                        var node = new TreeNode({
                            path: path + index,
                            level: deep,
                            label: item[this.labelKey],
                            value: item[this.valueKey],
                            parentNode
                        })
                        node.children = recursion(item[this.childrenKey], node, node.path + '.', deep + 1)
                        node.childrenCount = node.children ? node.children.length : 0
                        node.$data = item
                        node.$root = this.$root
                        node.$rootNode = this
                        this.allNode.push(node)
                        return node
                    })
                } else if (parentNode) {
                    // 如果没有子节点，或等于最大显示级别，添加到叶子节点列表
                    this.leafNode.push(parentNode)
                }
            }
            this.children = recursion(data, null, '', 1) || []
        }
    }
    // 设置属性
    setProps(props) {
        if (typeof props === 'object') {
            Object.keys(props).forEach(key => {
                if (key in this) {
                    this[key] = props[key]
                }
            })
        }
    }
    // 筛选节点
    filter(method) {
        if (typeof method === 'function') {
            var recursion = (nodes) => {
                if (nodes.length) {
                    nodes = nodes.map(node => {
                        // 当前节点有子节点且可见的子节点数量大于0，则跳过筛选，直接设置为可见
                        if (node.children && node.children.filter(v => v.visible).length) {
                            node.setVisible(true, false)
                        } else {
                            node.setVisible(!!method(node.$data), false)
                            if (node.visible && this.$root.autoExpandParent) {
                                node.parentNode.setExpandedBubble(true)
                            }
                        }
                        return node.parentNode
                    })
                    recursion(nodes.filter(node => node))
                }
            }
            recursion(this.leafNode)
        }
    }
    // 选中指定key的节点
    setSelectedKey(key) {
        var node = this.allNode.find(item => item.value === key)
        if (node) {
            node.setSelected(true)
        }
    }
    // 展开指定key的节点
    setExpandedKey(key) {
        var node = this.allNode.find(item => item.value === key)
        if (node) {
            node.setExpandedBubble(true)
        }
    }
    // 设置全部节点的展开状态
    setExpandedAll(value) {
        this.leafNode.forEach(node => {
            node.setExpandedBubble(value)
        })
    }
    // 根据key找到节点
    findToKey(key) {
        return this.allNode.find(item => item.value === key)
    }
    // 根据路径找到节点
    findToPath(path) {
        let node = this
        path.split('.').forEach(index => {
            node = node.children[index]
        })
        return node
    }
}
export default Tree
