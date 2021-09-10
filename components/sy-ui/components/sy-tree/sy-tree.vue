<!--
* @description 树形控件
* @author yxs
!-->
<template>
    <view :class="{'sy-ui-border-bottom': showBottomLineBetween}" class="sy-tree">
        <block v-for="index in nodeList" :key="index">
            <tree-node
                ref="TreeNode"
                @ready="handleNodeReady(index)"
            />
        </block>
        <view v-if="!nodeList.length" class="empty-text">
            <text>{{ emptyText }}</text>
        </view>
    </view>
</template>
<script>
    import Tree from './Tree'
    import publicProps from './publicProps'
    // 组件
    import TreeNode from './tree-node'
    // 常量
    const watch = {}
    Object.keys(publicProps).forEach(key => {
        watch[key] = function() {
            this.updateNodeProps()
        }
    })
    export default {
        name: 'SyTree',
        components: {
            TreeNode
        },
        props: {
            // 最大显示层级
            deep: { type: [Number, String], default: 999 },
            // 源数据
            options: { type: [Array, String] },
            // 指定label为数据源的某个属性
            labelKey: { type: String, default: 'label' },
            // 指定value为数据源的某个属性
            valueKey: { type: String, default: 'value' },
            // 指定子节点为数据源的某个属性
            childrenKey: { type: String, default: 'children' },
            // 是否每次只能展开一个同级树节点
            accordion: { type: Boolean, default: false },
            // 内容为空的时候展示的文本
            emptyText: { type: String, default: '没有数据' },
            // 是否默认展开所有节点
            defaultExpandAll: { type: Boolean, default: false },
            // 展开子节点的时候是否自动展开父节点，数据量较大时谨慎开启
            autoExpandParent: { type: Boolean, default: false },
            // 默认选中的节点的 value 的数组
            defaultSelectedValues: { type: Array, default: () => [] },
            // 默认展开的节点的 value 的数组
            defaultExpandedValues: { type: Array, default: () => [] },
            // 公共节点属性
            ...publicProps
        },
        data() {
            return {
                // 节点列表
                nodeList: []
            }
        },
        computed: {
            showBottomLineBetween() {
                return this.showLineBetween && this.nodeList.length
            }
        },
        watch: {
            options: {
                deep: true,
                handler() {
                    this.setOptions()
                }
            },
            deep() { this.setOptions() },
            labelKey() { this.setOptions() },
            valueKey() { this.setOptions() },
            childrenKey() { this.setOptions() },
            defaultExpandAll(value) {
                if (value) {
                    this.expandAllNode()
                }
            },
            ...watch
        },
        mounted() {
            // 节点属性
            this.nodeProps = {}
            // 初始化源数据
            if (this.options) {
                this.setOptions()
            }
            // 组件准备就绪事件
            this.$emit('ready')
        },
        methods: {
            // 筛选节点
            filter(method) {
                this.$tree.filter(method)
            },
            // 设置基础数据
            setOptions(data = this.options || []) {
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data) || []
                    } catch (err) {
                        data = []
                    }
                }
                this.$tree = new Tree(data, {
                    deep: this.deep,
                    labelKey: this.labelKey,
                    valueKey: this.valueKey,
                    childrenKey: this.childrenKey,
                    $root: this
                })
                this.nodeList = this.$tree.children.map((v, index) => index)
                this.updateNodeProps()
                // 是否默认展开全部节点
                if (this.defaultExpandAll) {
                    this.setExpandedAll(true)
                } else {
                    // 默认展开指定节点
                    this.defaultExpandedValues.forEach(key => {
                        this.setExpandedKey(key)
                    })
                    // 默认选中指定节点
                    this.defaultSelectedValues.forEach(key => {
                        this.setSelectedKey(key)
                    })
                }
            },
            // 选中指定key的节点
            setSelectedKey(key) {
                this.$tree.setSelectedKey(key)
            },
            // 展开指定key的节点
            setExpandedKey(key) {
                this.$tree.setExpandedKey(key)
            },
            // 设置全部节点的展开状态
            setExpandedAll(value) {
                this.$tree.setExpandedAll(value)
            },
            // 更新节点属性
            updateNodeProps() {
                Object.keys(publicProps).forEach(key => {
                    this.nodeProps[key] = this[key]
                })
                this.$tree.children.forEach(item => {
                    if (item.$node) {
                        item.$node.updateNodeProps(this.nodeProps)
                    }
                })
            },
            // 节点准备就绪
            handleNodeReady(index) {
                let $node = this.$refs.TreeNode[index]
                let treeNode = this.$tree.children[index]
                treeNode.setProps({
                    $node
                })
                $node.initNodeData(treeNode)
                $node.updateNodeProps(this.nodeProps)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-tree{
    position: relative;
    font-size: 30rpx;
    color: #333;
    text-align: left;
    &::after {
        left: 30rpx;
        right: 30rpx;
    }
    .empty-text{
        padding: 200rpx 0;
        text-align: center;
        color: #999;
        font-size: 26rpx;
    }
}
</style>

