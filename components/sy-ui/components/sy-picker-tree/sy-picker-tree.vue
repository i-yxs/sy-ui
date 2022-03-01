<!--
* @description 树形选择器
* @author yxs
!-->
<template>
    <view class="sy-picker-tree">
        <sy-picker-input
            :props="pickerInputProps"
            @clear="handleClear"
            @click="show"
        />
        <sy-popover
            v-model="popover.content"
            :visible="popover.visible"
            position="bottom"
            @masktap="handleCancel"
        >
            <view v-if="popover.content" class="popover-wrap">
                <view class="head-wrap">
                    <view class="title-wrap">{{ __props.title || '请选择' }}</view>
                    <view class="filter-wrap">
                        <view class="search-wrap">
                            <sy-input
                                v-model="keyword"
                                clearable
                                placeholder="输入关键词搜索"
                                prefix-icon="sy-ui-icon-search"
                                confirm-type="search"
                                @clear="handleTreeFilter"
                                @confirm="handleTreeFilter"
                            />
                        </view>
                        <view v-if="__props.multiple" class="selected-all" @click="handleSelectedAll">
                            <text class="text">全选</text>
                            <sy-checkbox
                                :value="selectedAll"
                                :indeterminate="indeterminate"
                                size="30rpx"
                            />
                        </view>
                    </view>
                </view>
                <view v-if="__props.showLineBetween" class="line-between"/>
                <view class="body-wrap">
                    <sy-tree
                        ref="Tree"
                        :props="treeProps"
                        provide-key="options_"
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
                <sy-safe-area-inset />
                <sy-loading
                    :value="filtering"
                    :styles="{
                        borderRadius: '30rpx 30rpx 0 0'
                    }"
                    text="加载中"
                />
            </view>
        </sy-popover>
    </view>
</template>
<script>
    // 方法
    import store from '@/store'
    import Tree from '../sy-tree/Tree'
    import props from './props'
    import { getProperty } from '../../utils'
    import mixinProps, { assignProps } from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'

    export default {
        name: 'SyPickerTree',
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                popover: {
                    content: false,
                    visible: false
                },
                keyword: '', // 筛选关键词
                selected: [], // 选中的节点key
                viewValue: '', // 输入框显示的值
                emitValue: '', // 返回的值
                filtering: false,
                selectedAll: false,
                indeterminate: false,
                selectedValues: []
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
                if (this.__props.emptyOption) {
                    return [
                        {
                            [this.__props.labelKey]: this.__props.emptyOption,
                            [this.__props.valueKey]: null
                        },
                        ...options
                    ]
                }
                return options
            },
            treeProps() {
                return assignProps('SyTree', {
                    ...this.__props,
                    selectable: true,
                    defaultSelectedValues: this.selectedValues,
                    defaultExpandedValues: this.selectedValues
                })
            },
            pickerInputProps() {
                return assignProps('SyPickerInput', {
                    ...this.__props,
                    value: this.viewValue
                })
            }
        },
        watch: {
            options_() {
                this.updateOptions()
            }
        },
        mounted() {
            // watch
            [
                'deep',
                'labelKey',
                'valueKey',
                'provideData',
                'childrenKey',
                'emptyOption'
            ].forEach(key => {
                this.$watch('__props.' + key, this.updateOptions)
            })
            ;[
                'value',
                'multiple',
                'showAllLevels'
            ].forEach(key => {
                this.$watch('__props.' + key, this.updateViewData)
            })
            // 实例化Tree类
            this.$tree = new Tree({
                $vue: this
            })
            this.updateOptions()
            // 当前选中的节点列表
            this.selectedNodes = []
        },
        methods: {
            show() {
                if (this.__props.readonly || this.__props.loading || this.__props.disabled) return
                this.popover.visible = true
            },
            hide() {
                this.keyword = ''
                this.popover.visible = false
            },
            // 更新数据源
            updateOptions() {
                this.$tree.deep = this.__props.deep
                this.$tree.labelKey = this.__props.labelKey
                this.$tree.valueKey = this.__props.valueKey
                this.$tree.childrenKey = this.__props.childrenKey
                this.$tree.setData(this.options_)
                // 更新视图value
                this.updateViewData()
            },
            // 获取value
            getEmitValue() {
                let value = ''
                if (this.__props.multiple) {
                    if (this.__props.emitPath) {
                        value = this.selectedNodes.map(node => node.getParentNodeAll().map(node => node.value))
                    } else {
                        value = this.selectedNodes.map(node => node.value)
                    }
                } else if (this.selectedNodes.length) {
                    if (this.__props.emitPath) {
                        value = this.selectedNodes[0].getParentNodeAll().map(node => node.value)
                    } else {
                        value = this.selectedNodes[0].value
                    }
                }
                return value
            },
            // 根据value更新视图数据
            updateViewData() {
                let value = this.__props.value
                if (this.__props.multiple) {
                    // 多选，value应为数组
                    if (Array.isArray(value)) {
                        if (this.__props.emitPath) {
                            value = value.filter(v => Array.isArray(v))
                            // emitPath为ture时，value的每一项也应为数组
                            this.selected = value.map(v => v.slice(-1))
                            if (this.__props.showAllLevels) {
                                this.viewValue = value.map(item => {
                                    return item.map(v => this.$tree.findToKey(v)).filter(v => v).map(v => v.label).join(this.__props.separator)
                                }).filter(v => v).join(',')
                            } else {
                                this.viewValue = this.selected.map(item => this.$tree.findToKey(item)).filter(v => v).map(v => v.label).join(',')
                            }
                        } else {
                            this.selected = [...value]
                            let nodes = value.map(key => this.$tree.findToKey(key)).filter(node => node)
                            if (this.__props.showAllLevels) {
                                this.viewValue = nodes.map(node => node.getParentNodeAll().map(node => node.label).join(this.separator)).join(',')
                            } else {
                                this.viewValue = nodes.map(node => node.label).join(this.__props.separator)
                            }
                        }
                    } else {
                        this.selected = []
                        this.viewValue = ''
                    }
                    this.selectedValues = this.__props.value || []
                    this.updateSelectedAll()
                } else {
                    // 单选
                    if (this.__props.emitPath) {
                        // emitPath为ture时，value应为数组
                        if (Array.isArray(value)) {
                            this.selected = value.slice(-1)
                            if (this.__props.showAllLevels) {
                                this.viewValue = value.map(key => this.$tree.findToKey(key)).filter(node => node).map(node => node.label).join(this.__props.separator)
                            } else {
                                this.viewValue = (this.$tree.findToKey(this.selected[0]) || {}).label
                            }
                        } else {
                            this.selected = []
                            this.viewValue = ''
                        }
                        this.selectedValues = this.__props.value
                    } else {
                        this.selected = [value]
                        if (this.__props.showAllLevels) {
                            let node = this.$tree.findToKey(value)
                            this.viewValue = node ? node.getParentNodeAll().map(node => node.label).join(this.__props.separator) : ''
                        } else {
                            this.viewValue = (this.$tree.findToKey(value) || {}).label
                        }
                        this.selectedValues = [this.__props.value]
                    }
                }
                this.selectedNodes = this.selected.map(key => this.$tree.findToKey(key)).filter(node => node)
            },
            // 更新全选状态
            updateSelectedAll() {
                let nodes = this.__props.emitPath ? this.$tree.allNode : this.$tree.leafNode
                this.selectedAll = nodes.findIndex(node => {
                    return this.selectedValues.indexOf(node.value) === -1
                }) === -1
                this.indeterminate = !this.selectedAll && this.selectedValues.length > 0
            },
            // 根据关键词筛选节点
            handleTreeFilter() {
                this.filtering = true
                this.$nextTick(() => {
                    this.$refs.Tree.filter((data) => {
                        return data[this.__props.labelKey].indexOf(this.keyword) > -1
                    })
                    this.filtering = false
                    this.handleCheckChange()
                })
            },
            // tree组件节点选中状态发生变化时触发
            handleCheckChange() {
                let refTree = this.$refs.Tree
                let nodes = this.__props.emitPath ? refTree.$tree.allNode : refTree.$tree.leafNode
                nodes = nodes.filter(node => node.visible)
                this.selectedNodes = refTree.getCheckedNodes()
                this.selectedValues = this.selectedNodes.map(v => v.value)
                this.selectedAll = nodes.findIndex(node => this.selectedValues.indexOf(node.value) === -1) === -1
                this.indeterminate = !this.selectedAll && nodes.findIndex(node => this.selectedValues.includes(node.value)) > -1
            },
            // 点击清空按钮时触发
            handleClear() {
                this.$emit('clear')
                this.$emit('input', '')
                this.$emit('change', '')
            },
            // 点击取消按钮时触发
            handleCancel() {
                this.hide()
                this.updateViewData()
                this.$emit('cancel')
            },
            // 点击确定按钮时触发
            handleConfirm() {
                if (this.__props.required && !this.selectedNodes.length) {
                    return this.showToast('请至少选择一项！')
                }
                let value = this.getEmitValue()
                this.hide()
                this.$emit('input', value)
                this.$emit('change', {
                    value,
                    nodes: this.selectedNodes
                })
            },
            // 点击全选按钮时触发
            handleSelectedAll() {
                let Tree = this.$refs.Tree
                if (Tree) {
                    let value = !this.selectedAll
                    Tree.$tree.leafNode.forEach(node => {
                        if (node.visible) {
                            node.setSelected(value)
                        }
                    })
                    this.handleCheckChange()
                }
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
    border-radius: 30rpx 30rpx 0 0;
    .head-wrap{
        .title-wrap {
            color: #333;
            line-height: 48rpx;
            text-align: center;
            font-weight: bold;
            font-size: 34rpx;
            padding: 24rpx;
        }
        .filter-wrap{
            display: flex;
            align-items: center;
            padding: 0 30rpx 10rpx;
            .search-wrap {
                flex: 1;
                padding: 0 30rpx;
                text-align: left;
                background: #F8F8F8;
                border-radius: 35rpx;
            }
            .selected-all {
                display: flex;
                align-items: center;
                margin-left: 30rpx;
                .text{
                    color: $APP_COLOR;
                    font-size: 24rpx;
                    margin-right: 10rpx;
                }
            }
        }
    }
    .line-between {
        height: 10rpx;
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

