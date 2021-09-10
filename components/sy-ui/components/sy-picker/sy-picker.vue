<!--
* @description 选择器
* @author yxs
!-->
<template>
    <view class="sy-picker">
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
            @click="show"
            @clear="handleClear"
        />
        <sy-popover
            :visible="visibles.popover"
            position="bottom"
            @update="visibles.picker = $event"
            @masktap="handleCancel"
        >
            <view v-if="visibles.picker" class="popover-wrap">
                <view v-if="allowCreate" class="head-wrap">
                    <view class="input-wrap">
                        <view class="input">
                            <sy-input
                                v-model="createInput.value"
                                :placeholder="createPlaceholder"
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
                        :deep="deep"
                        :mode="mode"
                        :value="value"
                        :options="fixOptions"
                        :label-key="labelKey"
                        :value-key="valueKey"
                        :children-key="childrenKey"
                        :emit-path="emitPath"
                        :format="format"
                        :min="min"
                        :max="max"
                        height="260rpx"
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
            </view>
        </sy-popover>
    </view>
</template>
<script>

    import dateTools from '@/components/sy-ui/utils/dateTools'
    import publicProps from '@/components/sy-ui/utils/publicProps'

    export default {
        name: 'SyPicker',
        props: {
            // 选择的值
            value: { default: '' },
            // 设置value时显示的日期格式，只有mode=date、time有效
            format: { type: String },
            separator: { type: String, default: '/' },
            allowCreate: { type: Boolean, default: false },
            createPlaceholder: { type: String, default: '输入需要创建的新条目' },
            // SyPickerView参数
            mode: { default: 'selector' },
            min: null,
            max: null,
            options: null,
            labelKey: { default: 'label' },
            valueKey: { default: 'value' },
            // linkage选择器参数
            deep: { default: 999 },
            emitPath: { default: false },
            childrenKey: { default: 'children' },
            ...publicProps.pickerInput
        },
        data() {
            return {
                visibles: {
                    picker: false,
                    popover: false
                },
                viewValue: '',
                fixOptions: [],
                createInput: {
                    value: '',
                    focus: false
                }
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
            value() {
                this.updateViewValue()
            },
            options() {
                this.setOptions()
            }
        },
        mounted() {
            this.setOptions()
        },
        methods: {
            // 显示弹出层
            show() {
                if (!this.readonly && !this.disabled) {
                    this.visibles.popover = true
                }
            },
            // 关闭弹出层
            hide() {
                this.visibles.popover = false
            },
            // 设置数据源
            setOptions(options = this.options) {
                if (typeof options === 'string') {
                    try {
                        options = JSON.parse(options) || []
                    } catch (err) {
                        options = []
                        console.error(err)
                    }
                }
                if (this.mode === 'linkage') {
                    this.rootNodes = []
                    this.nodesData = []
                    if (Array.isArray(options) && options.length) {
                        var maxDeep = 0
                        var recursion = (data, parentNode, path, deep) => {
                            if (data.length && deep <= this.deep) {
                                maxDeep = Math.max(maxDeep, deep)
                                return data.filter(item => item).map((item, index) => {
                                    var nowPath = `${path}${index}`
                                    var children = item[this.childrenKey] || []
                                    var node = {
                                        data: item,
                                        path: nowPath,
                                        label: item[this.labelKey],
                                        value: item[this.valueKey]
                                    }
                                    node.children = recursion(children, node, `${nowPath}.`, deep + 1)
                                    return node
                                })
                            } else if (parentNode) {
                                this.rootNodes.push(parentNode)
                            }
                        }
                        this.nodesData = recursion(options, null, '', 1)
                        this.maxDeep = Math.min(maxDeep, this.deep)
                    }
                }
                this.fixOptions = options
                this.updateViewValue()
            },
            // props的value改变时，需要当前组件自己获取显示input值
            updateViewValue() {
                if (this.isEmpty(this.value)) {
                    this.viewValue = ''
                } else {
                    switch (this.mode) {
                    case 'selector':
                        if (this.fixOptions) {
                            this.viewValue = (this.fixOptions.find(item => item[this.valueKey] === this.value) || {})[this.labelKey] || ''
                        } else {
                            this.viewValue = ''
                        }
                        break
                    case 'multiSelector':
                        if (this.fixOptions) {
                            var values = this.fixOptions.map((item, index) => item.find(v => v[this.valueKey] === this.value[index]))
                            if (values.findIndex(v => !v) === -1) {
                                this.viewValue = values.map(v => v[this.labelKey]).join(this.separator)
                            } else {
                                this.viewValue = ''
                            }
                        } else {
                            this.viewValue = ''
                        }
                        break
                    case 'linkage':
                        if (this.rootNodes && this.value) {
                            var value = this.emitPath ? this.value.slice(-1)[0] : this.value
                            var node = this.rootNodes.find(item => item.value === value)
                            if (node) {
                                var path = node.path
                                node = {
                                    children: this.nodesData
                                }
                                this.viewValue = path.split('.').map(index => {
                                    node = node.children[index]
                                    return node.label
                                }).join(this.separator)
                            } else {
                                this.viewValue = ''
                            }
                        } else {
                            this.viewValue = ''
                        }
                        break
                    case 'date':
                        this.viewValue = dateTools.format(this.value, this.format || 'YYYY-MM-DD')
                        break
                    case 'time':
                        this.viewValue = dateTools.format(this.value, this.format || 'HH:mm:ss')
                        break
                    }
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
                var value = this.$refs.SyPickerView.getValue()
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
                var value = this.createInput.value
                if (value !== '') {
                    this.fixOptions.splice(0, 0, {
                        [this.labelKey]: value,
                        [this.valueKey]: value
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

