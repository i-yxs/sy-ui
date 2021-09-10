// 树节点类
class TreeNode {
    constructor(props) {
        this.path = '' // 节点的路径
        this.level = 0 // 节点的级别
        this.label = '' // 节点的标签
        this.value = '' // 节点的值
        this.visible = true // 节点是否显示
        this.children = null // 子节点列表
        this.selected = false // 节点是否选中
        this.expanded = false // 节点是否展开
        this.parentNode = null // 父节点
        this.expandedCount = 0 // 子孙节点展开的数量，用于计算节点高度
        this.childrenCount = 0 // 子孙节点的总数
        this.indeterminate = false // 子孙节点是否只选中部分

        this.$data = null // 节点所对应的数据
        this.$node = null // 节点的VUE实例
        this.$root = null // SyTree组件的VUE实例
        this.$rootNode = null // 根节点的VUE实例
        this.$parentNode = null // 父节点的VUE实例

        this.setProps(props)
    }
    // 设置属性
    setProps(props) {
        Object.keys(props).forEach(key => {
            if (key in this) {
                this[key] = props[key]
            }
        })
    }
    // 设置可见状态
    setVisible(value = this.expanded, isBubbleUpdate = true) {
        this.visible = !!value
        // 更新子节点数量
        if (this.visible && this.children) {
            this.childrenCount = this.children.filter(item => item.visible).length
        } else {
            this.childrenCount = 0
        }
        // 更新实例属性
        if (this.$node) {
            this.$node.setProps({
                visible: this.visible,
                childrenCount: this.childrenCount
            })
        }
        // 更新展开数量
        this.setExpanded(this.expanded, true, false)
        // 更新父节点数据
        if (isBubbleUpdate && this.parentNode) {
            this.parentNode.setVisible()
        }
    }
    // 同时设置当前节点及所有父节点的可见状态
    setVisibleBubble(value) {
        this.setVisible(value, false)
        if (this.parentNode) {
            this.parentNode.setVisibleBubble(value)
        }
    }
    // 设置展开状态
    setExpanded(value = this.expanded, isBubbleUpdate = true, accordion = this.$root.accordion) {
        this.expanded = !!value
        // 更新展开数量
        if (this.expanded && this.children) {
            this.expandedCount = this.children.filter(item => item.visible).reduce((a, b) => {
                return a + b.expandedCount + 1
            }, 0)
        } else {
            this.expandedCount = 0
        }
        if (accordion) {
            // 展开状态为ture，关闭同级别的其他展开的节点
            if ((this.expanded && this.parentNode) || this.level === 1) {
                (this.parentNode || this.$rootNode).children.forEach(node => {
                    if (node !== this && node.expanded) {
                        node.setExpanded(false, true, false)
                    }
                })
            }
        }
        // 更新实例属性
        if (this.$node) {
            this.$node.setProps({
                expanded: this.expanded,
                expandedCount: this.expandedCount
            })
            this.$node.updateExpanded()
        }
        // 更新父节点数据
        if (isBubbleUpdate && this.parentNode) {
            if (this.$root.autoExpandParent && this.expanded) {
                this.setExpandedBubble(value)
            } else {
                this.parentNode.setExpanded(this.parentNode.expanded, true, accordion)
            }
        }
    }
    // 同时设置当前节点及所有父节点的展开状态
    setExpandedBubble(value) {
        this.setExpanded(value, false, false)
        if (this.parentNode) {
            this.parentNode.setExpandedBubble(value)
        }
    }
    // 设置选中状态
    setSelected(value = this.selected, isBubbleUpdate = true) {
        value = !!value
        // 获取组件配置
        if (this.$root.multiple) {
            // 多选
            this.selected = value
            this.indeterminate = false
            if (this.$root.checkStrictly) {
                if (this.selected) {
                    if (this.$rootNode.selected.indexOf(this.path) === -1) {
                        this.$rootNode.selected.push(this.path)
                    }
                } else {
                    this.$rootNode.selected.splice(this.$rootNode.selected.indexOf(this.path), 1)
                }
            } else {
                // checkStrictly为false时，节点和叶子节点是不同的处理
                if (this.children) {
                    // 普通节点改变选中状态，会同时改变所有节点的选中状态
                    this.children.forEach(node => {
                        node.setSelected(value)
                    })
                } else {
                    // 叶子节点改变选中状态时，需要通知所有父节点更新状态
                    if (this.selected) {
                        if (this.$rootNode.selected.indexOf(this.path) === -1) {
                            this.$rootNode.selected.push(this.path)
                        }
                    } else {
                        this.$rootNode.selected.splice(this.$rootNode.selected.indexOf(this.path), 1)
                    }
                    // 更新父节点选中状态
                    if (isBubbleUpdate && this.parentNode) {
                        this.parentNode.updateSelected()
                    }
                }
            }
        } else {
            // 单选时，只有checkStrictly为ture，或没有子节点时才能改变选中状态
            if (this.$root.checkStrictly || !this.children) {
                this.selected = value
                // 如果是选中状态，则取消已选中的节点
                if (this.selected) {
                    this.$rootNode.selected.forEach(path => {
                        if (this.path !== path) {
                            this.$rootNode.findToPath(path).setSelected(false)
                        }
                    })
                    this.$rootNode.selected = [this.path]
                }
            }
        }
        // 更新实例属性
        if (this.$node) {
            this.$node.setProps({
                selected: this.selected,
                indeterminate: this.indeterminate
            })
        }
    }
    // 更新选中状态
    updateSelected(isBubbleUpdate = true) {
        // 多选且checkStrictly为false时，根据子节点选中状态更新选中状态
        if (this.$root.multiple && !this.$root.checkStrictly && this.children) {
            this.selected = this.children.findIndex(node => !node.selected) === -1
            this.indeterminate = !this.selected && this.children.findIndex(node => node.selected || node.indeterminate) > -1
            // 更新实例属性
            if (this.$node) {
                this.$node.setProps({
                    selected: this.selected,
                    indeterminate: this.indeterminate
                })
            }
            // 更新父节点
            if (isBubbleUpdate && this.parentNode) {
                this.parentNode.updateSelected()
            }
        }
    }
    // 获取节点的所有父元素及当前节点的列表
    getParentNodeAll() {
        var list = []
        var node = this.$rootNode
        this.path.split('.').forEach(index => {
            node = node.children[index]
            list.push(node)
        })
        return list
    }
}
export default TreeNode
