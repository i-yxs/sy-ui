<!--
* @description 树形控件的节点组件
* @author yc
!-->
<template>
    <view
        v-if="props.visible"
        :class="{'sy-ui-border-top': treeProps.showLineBetween}"
        class="tree-node"
    >
        <view :style="{minHeight: treeProps.nodeHeight}" class="tree-view">
            <view class="tree-left" @click="handleNodeClick">
                <view
                    v-if="children"
                    :class="[treeProps.nodeIcon, {expanded: props.expanded}]"
                    :style="nodeIconStyle"
                    class="tree-icon"
                />
                <view
                    v-else-if="props.level > 1"
                    :style="nodeIconStyle"
                    class="tree-icon-block"
                />
                <view class="tree-name">
                    <view :style="{'-webkit-line-clamp': treeProps.nodeLabelRows}" class="sy-ui-folded">
                        <text>{{ props.label }}</text>
                        <text v-if="treeProps.showNodeCount && children" class="count">
                            ({{ props.childrenCount }})
                        </text>
                    </view>
                </view>
            </view>
            <template v-if="treeProps.selectable">
                <view v-if="treeProps.multiple" class="tree-right" @click="handleCheckChange">
                    <sy-checkbox :value="props.selected" :indeterminate="props.indeterminate" size="30rpx" />
                </view>
                <view v-else-if="!children || treeProps.checkStrictly" class="tree-right" @click="handleCheckChange">
                    <sy-radio :value="props.selected" :label="true" size="30rpx" />
                </view>
            </template>
        </view>
        <view v-if="children" :style="{height: childHeight}" class="tree-child">
            <template v-for="path in children">
                <tree-node
                    v-if="props.expanded || animationing"
                    :key="path"
                    :path="path"
                />
            </template>
        </view>
    </view>
</template>
<script>
    import { objectToCss } from '../../utils'
    // 组件
    import TreeNode from './tree-node'

    export default {
        name: 'TreeNode',
        components: {
            TreeNode
        },
        props: {
            path: String
        },
        data() {
            return {
                props: {},
                // 子节点列表
                children: null,
                // 当前节点是否播放动画中
                animationing: false
            }
        },
        inject: ['provideComponent'],
        computed: {
            treeProps() {
                return this.provideComponent.__props
            },
            childHeight() {
                if (this.props.expanded) {
                    if (this.treeProps.enableAnimate && this.treeProps.nodeHeight) {
                        return this.props.expandedCount * uni.upx2px(Number(this.treeProps.nodeHeight.replace(/[^\d]+/, ''))) + 'px'
                    }
                    return 'initial'
                }
                return 0
            },
            nodeIconStyle() {
                return objectToCss(this.treeProps.nodeIconStyle)
            }
        },
        mounted() {
            this.treeNode = this.provideComponent.$tree.findToPath(this.path)
            this.treeNode.$vue = this
            // 获取子节点
            if (this.treeNode.children) {
                this.children = this.treeNode.children.map(node => node.path)
            }
            // 设置节点属性
            let props = {}
            ;[
                'level',
                'label',
                'visible',
                'disabled',
                'selected',
                'expanded',
                'expandedCount',
                'childrenCount',
                'indeterminate'
            ].forEach(key => {
                props[key] = this.treeNode[key]
            })
            this.props = props
        },
        methods: {
            // 设置属性
            setProps(props) {
                Object.keys(props).forEach(key => {
                    if (key in this.props) {
                        this.props[key] = props[key]
                    }
                })
            },
            // 更新展开状态
            updateExpanded() {
                clearTimeout(this.animationTimer)
                this.animationing = true
                this.animationTimer = setTimeout(() => {
                    this.animationing = false
                }, 300)
            },
            // 点击节点时触发
            handleNodeClick() {
                if (this.treeProps.selectable && !this.treeNode.children) {
                    // 如果节点可以选中，且没有子节点，点击节点则选中该节点
                    this.handleCheckChange()
                } else {
                    if (this.treeNode.children) {
                        // 有子节点时才能展开
                        this.treeNode.setExpanded(!this.treeNode.expanded)
                        this.provideComponent.$emit('node-expand', {
                            path: this.path,
                            data: this.treeNode.data // 节点对于的数据
                        })
                    }
                }
                this.provideComponent.$emit('node-click', {
                    path: this.path,
                    data: this.treeNode.data // 节点对应的数据
                })
            },
            // 点击选择按钮时触发
            handleCheckChange() {
                if (this.treeProps.selectable) {
                    if (this.treeProps.multiple) {
                        // 多选
                        this.treeNode.setSelected(!this.treeNode.selected)
                    } else {
                        // 单选时，只有checkStrictly为ture，或没有子节点时才能选中
                        if (this.treeProps.checkStrictly || !this.children) {
                            this.treeNode.setSelected(true)
                        }
                    }
                    // 触发事件
                    this.provideComponent.$emit('check-change', {
                        path: this.path, // 节点路径
                        data: this.treeNode.data, // 节点对于的数据
                        selected: this.treeNode.selected // 节点的选中状态
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

