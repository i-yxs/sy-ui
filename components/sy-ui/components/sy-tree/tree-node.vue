<!--
* @description 树形控件的节点组件
* @author yc
!-->
<template>
    <view
        v-if="viewData.visible"
        :class="{'sy-ui-border-top': nodeProps.showLineBetween}"
        class="tree-node"
    >
        <view :style="{minHeight: nodeProps.nodeHeight}" class="tree-view">
            <view class="tree-left" @click="handleNodeClick">
                <view
                    v-if="children"
                    :class="[nodeProps.nodeIcon, {expanded: viewData.expanded}]"
                    :style="{width: nodeProps.nodeIconSize, fontSize: nodeProps.nodeIconSize, color: nodeProps.nodeIconColor}"
                    class="tree-icon"
                />
                <view
                    v-else-if="viewData.level > 1"
                    :style="{width: nodeProps.nodeIconSize}"
                    class="tree-icon-block"
                />
                <view class="tree-name">
                    <view :style="{'-webkit-line-clamp': nodeProps.nodeLabelRows}" class="sy-ui-folded">
                        <text>{{ viewData.label }}</text>
                        <text v-if="nodeProps.showNodeCount && children" class="count">
                            ({{ viewData.childrenCount }})
                        </text>
                    </view>
                </view>
            </view>
            <template v-if="nodeProps.selectable">
                <view v-if="nodeProps.multiple" class="tree-right" @click="handleCheckChange">
                    <sy-checkbox :value="viewData.selected" :indeterminate="viewData.indeterminate" size="30rpx" />
                </view>
                <view v-else-if="!children || nodeProps.checkStrictly" class="tree-right" @click="handleCheckChange">
                    <sy-radio :value="viewData.selected" :label="true" size="30rpx" />
                </view>
            </template>
        </view>
        <view v-if="children" :style="{height: childHeight}" class="tree-child">
            <template v-for="item in children">
                <tree-node
                    v-if="item.ready || viewData.expanded || animationing"
                    ref="TreeNode"
                    :key="item.index"
                    @ready="handleNodeReady(item.index)"
                />
            </template>
        </view>
    </view>
</template>
<script>
    import publicProps from './publicProps'
    // 组件
    import TreeNode from './tree-node'
    // 常量
    const WatchProps = [
        'level',
        'label',
        'visible',
        'disabled',
        'selected',
        'expanded',
        'expandedCount',
        'childrenCount',
        'indeterminate'
    ]

    export default {
        name: 'TreeNode',
        components: {
            TreeNode
        },
        props: {
        },
        data() {
            var nodeProps = {}
            Object.keys(publicProps).forEach(key => {
                nodeProps[key] = publicProps[key].default
            })
            return {
                // 子节点列表
                children: null,
                // 视图数据
                viewData: {},
                // 公共节点属性
                nodeProps,
                // 当前节点是否播放动画中
                animationing: false
            }
        },
        computed: {
            childHeight() {
                if (this.viewData.expanded) {
                    if (this.nodeProps.enableAnimate && this.nodeProps.nodeHeight) {
                        return this.viewData.expandedCount * uni.upx2px(Number(this.nodeProps.nodeHeight.replace(/[^\d]+/, ''))) + 'px'
                    }
                    return 'initial'
                }
                return 0
            }
        },
        mounted() {
            // 动画播放计时器
            this.animationTimer = null
            this.$emit('ready')
        },
        methods: {
            // 设置属性
            setProps(props) {
                Object.keys(props).forEach(key => {
                    if (key in this.viewData) {
                        this.viewData[key] = props[key]
                    }
                })
            },
            // 初始化节点数据
            initNodeData(treeNode) {
                var viewData = {}
                WatchProps.forEach(key => {
                    viewData[key] = treeNode[key]
                })
                if (treeNode.children) {
                    this.children = treeNode.children.map((v, index) => {
                        return {
                            index,
                            ready: false
                        }
                    })
                }
                this.viewData = viewData
                this.treeNode = treeNode
            },
            // 更新节点属性
            updateNodeProps(data) {
                Object.keys(data).forEach(key => {
                    this.nodeProps[key] = data[key]
                })
                if (this.treeNode.children) {
                    this.treeNode.children.forEach(node => {
                        if (node.$node) {
                            node.$node.updateNodeProps(data)
                        }
                    })
                }
            },
            // 更新展开状态
            updateExpanded() {
                clearTimeout(this.animationTimer)
                this.animationing = true
                this.animationTimer = setTimeout(() => {
                    this.animationing = false
                }, 300)
            },
            // 子节点准备就绪时触发
            handleNodeReady(index) {
                let $node = this.$refs.TreeNode[index]
                let treeNode = this.treeNode.children[index]
                treeNode.setProps({
                    $node,
                    $parentNode: this
                })
                $node.initNodeData(treeNode)
                $node.updateNodeProps(this.nodeProps)
                this.children[index].ready = true
            },
            // 点击节点时触发
            handleNodeClick() {
                if (this.nodeProps.selectable && !this.treeNode.children) {
                    // 如果节点可以选中，且没有子节点，点击节点则选中该节点
                    this.handleCheckChange()
                } else {
                    if (this.treeNode.children) {
                        // 有子节点时才能展开
                        this.treeNode.setExpanded(!this.treeNode.expanded)
                        this.treeNode.$root.$emit('node-expand', {
                            node: this.treeNode, // 节点对象
                            data: this.treeNode.$data // 节点对于的数据
                        })
                    }
                }
                this.treeNode.$root.$emit('node-click', {
                    node: this.treeNode, // 节点对象
                    data: this.treeNode.$data // 节点对应的数据
                })
            },
            // 点击选择按钮时触发
            handleCheckChange() {
                if (this.nodeProps.selectable) {
                    if (this.nodeProps.multiple) {
                        // 多选
                        this.treeNode.setSelected(!this.treeNode.selected)
                    } else {
                        // 单选时，只有checkStrictly为ture，或没有子节点时才能选中
                        if (this.nodeProps.checkStrictly || !this.children) {
                            this.treeNode.setSelected(true)
                        }
                    }
                    // 触发事件
                    this.treeNode.$root.$emit('check-change', {
                        node: this.treeNode, // 节点对象
                        data: this.treeNode.$data, // 节点对于的数据
                        select: this.treeNode.selected, // 节点的选中状态
                        selected: this.treeNode.$rootNode.selected.map(path => this.treeNode.$rootNode.findToPath(path)) // 选中的节点列表
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.tree-node {
    &::before {
        left: 30rpx;
        right: 30rpx;
    }
    .tree-view {
        position: relative;
        display: flex;
        min-height: 70rpx;
        &:active {
            border-radius: 8rpx;
            background: #f6f6f6;
        }
        .tree-left {
            display: flex;
            align-items: center;
            padding: 0 30rpx;
            flex: 1;
            .tree-name{
                flex: 1;
                line-height: 1.4em;
                padding: 12rpx 0;
                .count{
                    margin-left: 8rpx;
                }
            }
        }
        .tree-right {
            display: flex;
            align-items: center;
            padding: 0 30rpx;
        }
        .tree-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1em;
            margin-right: 30rpx;
            transition: .2s ease-in-out;
            &.expanded{
                transform: rotateZ(90deg);
            }
        }
        .tree-icon-block {
            margin-right: 30rpx;
        }
    }
    .tree-child {
        padding-left: 30rpx;
        overflow: hidden;
        transition: height 0.3s ease-in-out;
    }
}
</style>

