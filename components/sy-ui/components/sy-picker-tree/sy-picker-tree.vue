<!--
* @description 树形选择器
* @author yxs
!-->
<template>
    <view class="sy-picker-tree">
        <sy-picker-input
            :value="viewValue"
            :height="height"
            :hidden="hidden"
            :overlay="overlay"
            :loading="loading"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIconName"
            :disabled="disabled"
            :clearable="clearable"
            :placeholder="placeholder"
            :input-props="inputProps"
            readonly
            @clear="handleClear"
            @click="visibles.popover = true"
        />
        <sy-popover
            :visible="visibles.popover"
            position="bottom"
            @update="visibles.picker = $event"
            @masktap="visibles.popover = false"
        >
            <view v-if="visibles.picker" class="popover-wrap">
                <view class="head-wrap">
                    {{ title || '请选择' }}
                </view>
                <view class="filter-wrap">
                    <view class="main-wrap">
                        <sy-input
                            v-model="keyword"
                            :height="height"
                            clearable
                            placeholder="输入关键词搜索"
                            prefix-icon="sy-ui-icon-search"
                            confirm-type="search"
                            @clear="handleTreeFilter"
                            @confirm="handleTreeFilter"
                        />
                    </view>
                    <view v-if="showLineBetween" class="block"/>
                </view>
                <view class="body-wrap">
                    <sy-tree
                        ref="Tree"
                        :deep="deep"
                        :label-key="labelKey"
                        :value-key="valueKey"
                        :children-key="childrenKey"
                        :multiple="multiple"
                        :accordion="accordion"
                        :node-height="nodeHeight"
                        :enable-animate="enableAnimate"
                        :check-strictly="checkStrictly"
                        :show-node-count="showNodeCount"
                        :show-line-between="showLineBetween"
                        :default-expand-all="defaultExpandAll"
                        selectable
                        empty-text="没有找到数据"
                        @ready="handleTreeReady"
                        @check-change="handleCheckChange"
                    />
                </view>
                <view class="foot-wrap">
                    <sy-button-group
                        :options="[
                            {text: '取消', name: 'cancel'},
                            {type: 'primary', text: '确定', name: 'confirm'},
                        ]"
                        @cancel="handleCancel"
                        @confirm="handleConfirm"
                    />
                </view>
                <sy-loading :value="filtering" text="加载中..." />
            </view>
        </sy-popover>
    </view>
</template>
<script>
    // 方法
    import Tree from '../sy-tree/Tree'
    import publicProps from '@/components/sy-ui/utils/publicProps'

    export default {
        name: 'SyPickerTree',
        props: {
            title: String, // 弹出框标题文本
            value: { type: null, default: '' },
            emitPath: { type: Boolean, default: false }, // 节点选中状态改变时，是否返回由该节点所在的各级菜单的值所组成的数组，默认只返回该节点的值
            separator: { type: String, default: '/' }, // 输入框中有多个值时的间隔符
            // tree 参数
            deep: { default: 999 },
            options: null,
            labelKey: { default: 'label' },
            valueKey: { default: 'value' },
            multiple: { default: false },
            accordion: { default: false },
            emptyText: { default: '没有数据' },
            nodeHeight: { default: '90rpx' },
            childrenKey: { default: 'children' },
            enableAnimate: { default: true },
            checkStrictly: { default: false },
            showNodeCount: { default: false },
            showLineBetween: { default: true },
            defaultExpandAll: { default: false },
            autoExpandParent: { default: false },
            // 是否必需选中一项
            required: { type: Boolean, default: false },
            ...publicProps.pickerInput
        },
        data() {
            return {
                visibles: {
                    picker: false,
                    popover: false
                },
                keyword: '', // 筛选关键词
                selected: [], // 选中的节点key
                viewValue: '', // 输入框显示的值
                emitValue: '', // 返回的值
                filtering: false
            }
        },
        computed: {
            suffixIconName() {
                if (!this.readonly && !this.disabled) {
                    return this.loading ? 'sy-ui-icon-loading' : this.suffixIcon
                }
                return ''
            }
        },
        watch: {
            options: {
                deep: true,
                handler(data) {
                    this.setOptions(data)
                }
            },
            deep() { this.setOptions() },
            value() { this.updateViewData() },
            labelKey() { this.setOptions() },
            valueKey() { this.setOptions() },
            childrenKey() { this.setOptions() }
        },
        mounted() {
            // 当前选中的节点列表
            this.selectNode = []
            // 初始化源数据
            this.setOptions(this.options)
        },
        methods: {
            show() {
                if (!this.readonly && !this.disabled) {
                    this.visibles.popover = true
                }
            },
            hide() {
                this.visibles.popover = false
            },
            // 设置基础数据
            setOptions(data = []) {
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
                if (this.$Tree) {
                    this.$Tree.setOptions(data)
                }
                // 更新视图value
                this.updateViewData()
            },
            // 获取value
            getEmitValue() {
                var value = ''
                if (this.multiple) {
                    if (this.emitPath) {
                        value = this.selectNode.map(node => node.getParentNodeAll().map(node => node.value))
                    } else {
                        value = this.selectNode.map(node => node.value)
                    }
                } else if (this.selectNode.length) {
                    if (this.emitPath) {
                        value = this.selectNode[0].getParentNodeAll().map(node => node.value)
                    } else {
                        value = this.selectNode[0].value
                    }
                }
                return value
            },
            // 根据value更新视图数据
            updateViewData() {
                var value = this.value
                var isArray = Array.isArray(value)
                if (this.multiple) {
                    // 多选，value应为数组
                    if (isArray) {
                        if (this.emitPath) {
                            value = value.filter(v => Array.isArray(v))
                            // emitPath为ture时，value的每一项也应为数组
                            this.selected = value.map(v => v.slice(-1))
                            this.viewValue = value.map(item => {
                                item = item.map(key => this.$tree.findToKey(key))
                                if (item.filter(node => node)) {
                                    return item.map(node => node.label).join(this.separator)
                                }
                            }).filter(item => item).join(',')
                        } else {
                            this.selected = [...value]
                            this.viewValue = value.map(key => this.$tree.findToKey(key)).filter(node => node).map(node => node.label).join(this.separator)
                        }
                    } else {
                        this.selected = []
                        this.viewValue = ''
                    }
                } else {
                    // 单选
                    if (this.emitPath) {
                        // emitPath为ture时，value应为数组
                        if (isArray) {
                            this.selected = value.slice(-1)
                            this.viewValue = value.map(key => this.$tree.findToKey(key)).filter(node => node).map(node => node.label).join(this.separator)
                        } else {
                            this.selected = []
                            this.viewValue = ''
                        }
                    } else {
                        this.selected = [value]
                        this.viewValue = (this.$tree.findToKey(value) || {}).label
                    }
                }
                if (this.$Tree) {
                    this.handleTreeReady(this.$Tree)
                }
                this.selectNode = this.selected.map(key => this.$tree.findToKey(key)).filter(node => node)
            },
            // tree组件准备就绪时触发
            handleTreeReady() {
                this.$Tree = this.$refs.Tree
                if (this.$Tree) {
                    this.$Tree.setOptions(this.$tree.data)
                    this.selected.forEach(key => {
                        this.$Tree.setSelectedKey(key)
                        this.$Tree.setExpandedKey(key)
                    })
                }
            },
            // 根据关键词筛选节点
            handleTreeFilter() {
                if (this.$Tree) {
                    this.filtering = true
                    this.$nextTick(() => {
                        this.$Tree.filter((data) => {
                            return data[this.labelKey].indexOf(this.keyword) > -1
                        })
                        this.filtering = false
                    })
                }
            },
            // tree组件节点选中状态发生变化时触发
            handleCheckChange(data) {
                this.selectNode = data.selected
            },
            // 点击清空按钮时触发
            handleClear() {
                this.$emit('clear')
                this.$emit('input', '')
                this.$emit('change', '')
            },
            // 点击取消按钮时触发
            handleCancel() {
                this.selectNode = []
                this.visibles.popover = false
                this.$emit('cancel')
            },
            // 点击确定按钮时触发
            handleConfirm() {
                if (this.required && !this.selectNode.length) {
                    return this.showToast('请至少选择一项')
                }
                let value = this.getEmitValue()
                this.visibles.popover = false
                this.$emit('input', value)
                this.$emit('change', {
                    value,
                    node: this.selectNode
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.popover-wrap{
    position: relative;
    display: flex;
    flex-direction: column;
    height: 90vh;
    color: #333;
    background: #fff;
    .head-wrap{
        color: #333;
        line-height: 48rpx;
        text-align: center;
        font-weight: bold;
        font-size: 34rpx;
        padding: 24rpx;
    }
    .filter-wrap{
        text-align: left;
        padding: 0 30rpx 10rpx;
        .main-wrap {
            padding: 0 30rpx;
            background: #F8F8F8;
            border-radius: 35rpx;
        }
        .block {
            height: 10rpx;
        }
    }
    .body-wrap{
        flex:1;
        overflow: auto;
    }
    .foot-wrap {
        padding: 30rpx;
        background: #fff;
    }
}
</style>

