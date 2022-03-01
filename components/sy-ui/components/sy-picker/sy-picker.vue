<!--
* @description 选择器
* @author yxs
!-->
<template>
    <view class="sy-picker">
        <sy-picker-input
            :props="pickerInputProps"
            @click="show"
            @clear="handleClear"
        />
        <sy-popover
            v-model="popover.content"
            :visible="popover.visible"
            position="bottom"
            @masktap="handleCancel"
        >
            <view v-if="popover.content" class="popover-wrap">
                <view v-if="__props.allowCreate && __props.mode === 'selector'" class="head-wrap">
                    <view class="input-wrap">
                        <view class="input">
                            <sy-input
                                v-model="createInput.value"
                                :placeholder="__props.createPlaceholder"
                                height="70rpx"
                                clearable
                                confirm-type="done"
                                @blur="createInput.focus = false"
                                @focus="createInput.focus = true"
                                @confirm="handleCreateOption"
                            />
                        </view>
                        <view :class="{active: createInput.focus || createInput.value}" class="button">
                            <sy-button
                                :styles="{
                                    height: '54rpx',
                                    fontSize: '24rpx',
                                    borderRadius: '30rpx'
                                }"
                                type="primary"
                                text="确定"
                                @click="handleCreateOption" />
                        </view>
                    </view>
                </view>
                <view class="body-wrap">
                    <sy-picker-view
                        ref="SyPickerView"
                        :props="pickerViewProps"
                    />
                </view>
                <view class="foot-wrap">
                    <view class="item">
                        <sy-button text="取消" @click="handleCancel" />
                    </view>
                    <view class="item">
                        <sy-button type="primary" text="确定" @click="handleConfirm" />
                    </view>
                </view>
                <sy-safe-area-inset />
            </view>
        </sy-popover>
    </view>
</template>
<script>

    import store from '@/store'
    import props from './props'
    import { getProperty } from '../../utils'
    import dateTools from '../../utils/dateTools'
    import mixinProps, { assignProps } from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'

    export default {
        name: 'SyPicker',
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                popover: {
                    content: false,
                    visible: false
                },
                viewValue: '',
                createInput: {
                    value: '',
                    focus: false
                },
                createOptions: []
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
            pickerViewProps() {
                return assignProps('SyPickerView', {
                    ...this.__props,
                    height: '260rpx',
                    options: [
                        ...this.createOptions,
                        ...this.options_
                    ]
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
            '__props.value'() {
                this.updateViewValue()
            },
            options_() {
                this.updateOptions()
            }
        },
        mounted() {
            this.updateOptions()
        },
        methods: {
            // 显示弹出层
            show() {
                if (this.__props.readonly || this.__props.loading || this.__props.disabled) return
                this.popover.visible = true
            },
            // 关闭弹出层
            hide() {
                this.popover.visible = false
            },
            // 设置数据源
            updateOptions() {
                let options = this.options_
                if (!Array.isArray(options)) return
                if (this.__props.mode === 'linkage') {
                    this.rootNodes = []
                    this.nodesData = []
                    if (Array.isArray(options) && options.length) {
                        var maxDeep = 0
                        var recursion = (data, parentNode, path, deep) => {
                            if (data.length && deep <= this.__props.deep) {
                                maxDeep = Math.max(maxDeep, deep)
                                return data.filter(item => item).map((item, index) => {
                                    var nowPath = `${path}${index}`
                                    var children = item[this.__props.childrenKey] || []
                                    var node = {
                                        data: item,
                                        path: nowPath,
                                        label: item[this.__props.labelKey],
                                        value: item[this.__props.valueKey]
                                    }
                                    node.children = recursion(children, node, `${nowPath}.`, deep + 1)
                                    return node
                                })
                            } else if (parentNode) {
                                this.rootNodes.push(parentNode)
                            }
                        }
                        this.nodesData = recursion(options, null, '', 1)
                        this.maxDeep = Math.min(maxDeep, this.__props.deep)
                    }
                }
                this.updateViewValue()
            },
            // props的value改变时，需要当前组件自己获取显示input值
            updateViewValue() {
                let options = this.pickerViewProps.options
                switch (this.__props.mode) {
                case 'selector':
                    if (options) {
                        this.viewValue = (options.find(item => item[this.__props.valueKey] === this.__props.value) || {})[this.__props.labelKey] || ''
                    } else {
                        this.viewValue = ''
                    }
                    break
                case 'multiSelector':
                    if (options) {
                        let values = options.map((item, index) => item.find(v => v[this.__props.valueKey] === this.__props.value[index]))
                        if (values.findIndex(v => !v) === -1) {
                            this.viewValue = values.map(v => v[this.__props.labelKey]).join(this.__props.separator)
                        } else {
                            this.viewValue = ''
                        }
                    } else {
                        this.viewValue = ''
                    }
                    break
                case 'linkage':
                    if (this.rootNodes) {
                        let value = this.__props.emitPath ? this.__props.value.slice(-1)[0] : this.__props.value
                        let node = this.rootNodes.find(item => item.value === value)
                        if (node) {
                            let path = node.path
                            node = {
                                children: this.nodesData
                            }
                            this.viewValue = path.split('.').map(index => {
                                node = node.children[index]
                                return node.label
                            }).join(this.__props.separator)
                        } else {
                            this.viewValue = ''
                        }
                    } else {
                        this.viewValue = ''
                    }
                    break
                case 'date':
                    this.viewValue = dateTools.format(this.__props.value, this.__props.format || 'YYYY-MM-DD')
                    break
                case 'time':
                    this.viewValue = dateTools.format(this.__props.value, this.__props.format || 'HH:mm:ss')
                    break
                }
            },
            // 点击取消按钮时触发
            handleCancel() {
                this.hide()
                this.$emit('cancel')
            },
            // 点击清空按钮时触发
            handleClear() {
                this.$emit('clear')
                this.$emit('input', '')
                this.$emit('change', '')
            },
            // 点击确定按钮时触发
            handleConfirm() {
                let value = this.$refs.SyPickerView.getValue()
                let { mode, valueFormat } = this.__props
                if (['date', 'time'].includes(mode) && valueFormat) {
                    value = dateTools.format(value, valueFormat)
                }
                this.$emit('input', value)
                this.$emit('change', value)
                this.hide()
            },
            // 点击清空按钮时触发
            handleInputClear() {
                this.viewValue = ''
                this.$emit('clear')
                this.$emit('input', '')
                this.$emit('change', '')
            },
            // 创建新条目时触发
            handleCreateOption() {
                let value = this.createInput.value
                if (value !== '') {
                    this.createOptions.splice(0, 0, {
                        [this.__props.labelKey]: value,
                        [this.__props.valueKey]: value
                    })
                    this.createInput.value = ''
                    this.$emit('input', value)
                    this.$emit('change', value)
                    this.hide()
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入创建的新条目内容',
                        duration: 2000
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.popover-wrap{
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    color: #333;
    background: #fff;
    border-radius: 40rpx 40rpx 0 0;
    .head-wrap{
        text-align: left;
        padding: 40rpx 30rpx 10rpx;
        & + .body-wrap {
            padding-top: 30rpx;
        }
        .input-wrap {
            display: flex;
            align-items: center;
            padding: 0 16rpx 0 30rpx;
            background: #F8F8F8;
            border-radius: 35rpx;
            .input {
                flex: 1;
            }
            .button {
                transform: scale3d(0,0,1);
                margin-left: 20rpx;
                transition: .2s ease-in-out;
                &.active {
                    transform: scale3d(1,1,1);
                }
            }
        }
    }
    .body-wrap{
        flex:1;
        overflow: auto;
        padding-top: 50rpx;
    }
    .foot-wrap {
        display: flex;
        align-items: center;
        padding: 50rpx 90rpx 50rpx;
        background: #fff;
        .item {
            flex: 1;
            & + .item {
                margin-left: 50rpx;
            }
        }
    }
}
</style>

