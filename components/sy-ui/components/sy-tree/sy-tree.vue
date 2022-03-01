<!--
* @description 树形控件
* @author yxs
!-->
<template>
    <view :class="{'sy-ui-border-bottom': showBottomLineBetween}" class="sy-tree">
        <block v-for="path in nodeList" :key="path">
            <tree-node
                :path="path"
            />
        </block>
        <view v-if="!nodeList.length" class="empty-text">
            <text>{{ emptyText }}</text>
        </view>
    </view>
</template>
<script>
    // 工具
    import store from '@/store'
    import Tree from './Tree'
    import props from './props'
    import { getProperty } from '../../utils'
    import mixinProps from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'
    // 组件
    import TreeNode from './tree-node'

    export default {
        name: 'SyTree',
        components: {
            TreeNode
        },
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                // 节点列表
                nodeList: []
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        computed: {
            options_() {
                let options = this.isEmpty(this.provideData) ? this.__props.options : this.provideData
                if (typeof options === 'string') {
                    options = getProperty(store.state.baseData, options)
                }
                options = Array.isArray(options) ? options : []
                return options
            },
            showBottomLineBetween() {
                return this.showLineBetween && this.nodeList.length
            }
        },
        watch: {
            options_: 'updateOptions'
        },
        mounted() {
            // watch
            [
                'deep',
                'labelKey',
                'valueKey',
                'childrenKey'
            ].forEach(key => {
                this.$watch('__props.' + key, this.updateOptions)
            })
            // 实例化Tree类
            this.$tree = new Tree({
                $vue: this
            })
            this.updateOptions()
            this.$emit('ready')
        },
        methods: {
            // 筛选节点
            filter(method) {
                this.$tree.filter(method)
            },
            // 更新数据源
            updateOptions() {
                this.$tree.deep = this.__props.deep
                this.$tree.labelKey = this.__props.labelKey
                this.$tree.valueKey = this.__props.valueKey
                this.$tree.childrenKey = this.__props.childrenKey
                this.$tree.setData(this.options_)
                this.nodeList = this.$tree.children.map(node => node.path)
                // 是否默认展开全部节点
                if (this.__props.defaultExpandAll) {
                    this.setExpandedAll(true)
                } else {
                    // 默认展开指定节点
                    if (Array.isArray(this.__props.defaultExpandedValues)) {
                        this.__props.defaultExpandedValues.forEach(key => {
                            this.setExpandedKey(key)
                        })
                    }
                    // 默认选中指定节点
                    if (Array.isArray(this.__props.defaultSelectedValues)) {
                        this.__props.defaultSelectedValues.forEach(key => {
                            this.setSelectedKey(key)
                        })
                    }
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
            // 获取被选中的节点所组成的数组
            getCheckedNodes() {
                return this.$tree.selected.map(path => this.$tree.findToPath(path))
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

