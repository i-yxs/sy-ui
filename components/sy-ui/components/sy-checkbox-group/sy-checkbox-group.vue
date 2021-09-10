<!--
* @description 多选框组
* @author yxs
!-->
<template>
    <view
        :class="{readonly: readonly, disabled: disabled}"
        :style="style"
        class="sy-checkbox-group"
    >
        <template v-if="readonly">
            <text v-if="isEmpty(viewValue)" class="input-placeholder">
                {{ placeholder }}
            </text>
            <text v-else>{{ viewValue }}</text>
        </template>
        <view v-else class="group">
            <view v-for="(item, index) in groupData" :key="index" class="item" @click="handleActive(item, index)">
                <sy-checkbox
                    :size="size"
                    :text="item[labelKey]"
                    :color="color"
                    :value="inputValue[index]"
                    :button="button"
                    :disabled="insideDisabled[index]"
                    :true-label="item[valueKey]"
                    :indeterminate="item.indeterminate"
                    readonly
                />
            </view>
        </view>
    </view>
</template>
<script>

    import { jsonToCss } from '@/components/sy-ui/utils'
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyCheckboxGroup',
        props: {
            value: { type: [Array, String], default: () => [] },
            min: { default: 0 },
            max: { default: Infinity },
            styles: Object,
            // 数据源
            options: { type: Array, default: () => [] },
            // 指定label为数据源的某个属性
            labelKey: { type: String, default: 'label' },
            // 指定value为数据源的某个属性
            valueKey: { type: String, default: 'value' },
            // 是否只读
            readonly: { type: Boolean, default: false },
            // 是否禁用
            disabled: { type: Boolean, default: false },
            separator: String,
            // 没有值时的占位符
            placeholder: String,
            // SyCheckbox 组件参数
            size: { default: defaultValue.checkbox.size },
            color: { default: defaultValue.checkbox.color },
            button: { default: false }
        },
        data() {
            return {
                insideValue: [],
                insideDisabled: []
            }
        },
        computed: {
            style() {
                return jsonToCss(this.styles)
            },
            // 只有在value和内部value相同时才能进行交互操作
            canActive() {
                let value = Array.isArray(this.value) ? this.value : []
                if (!this.insideValue.length && !value.length) {
                    return true
                } else if (this.insideValue.findIndex((item, index) => item !== value[index]) === -1) {
                    return true
                }
                return false
            },
            groupData() {
                return this.options.filter(item => item.visible !== false)
            },
            viewValue() {
                return this.groupData.filter(item => this.insideValue.indexOf(item[this.valueKey]) > -1).map(item => item[this.labelKey]).join(this.separator)
            },
            inputValue() {
                return this.groupData.map(item => {
                    if (this.insideValue.indexOf(item[this.valueKey]) > -1) {
                        return item[this.valueKey]
                    }
                    return false
                })
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    if (Array.isArray(value)) {
                        this.insideValue = [...value]
                    } else {
                        this.insideValue = []
                    }
                    this.updateDisabled()
                }
            }
        },
        methods: {
            updateDisabled() {
                // 根据选中数量判断是否禁用其他SyCheckbox组件
                var count = this.inputValue.reduce((i, v) => v === false ? i : i + 1, 0)
                if (count <= Number(this.min)) {
                    // 达到最小选择数，禁用所有已选择的SyCheckbox组件
                    this.insideDisabled = this.inputValue.map(item => item !== false)
                } else if (count >= Number(this.max)) {
                    // 达到最大选择数，禁用所有未选择的SyCheckbox组件
                    this.insideDisabled = this.inputValue.map(item => item === false)
                } else {
                    this.insideDisabled = this.inputValue.map(() => false)
                }
            },
            handleActive(data, idx) {
                if (this.canActive && !this.insideDisabled[idx]) {
                    var value = [...this.insideValue]
                    var index = this.insideValue.indexOf(data[this.valueKey])
                    if (index > -1) {
                        value.splice(index, 1)
                    } else {
                        value.push(data[this.valueKey])
                    }
                    this.insideValue = value
                    this.updateDisabled()
                    this.$emit('input', value)
                    this.$emit('change', value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.sy-checkbox-group {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    &.readonly,
    &.disabled {
        pointer-events: none;
    }
    &.readonly {
        padding: 0;
    }
    &.disabled {
        opacity: .7;
    }
    .group {
        margin-left: -16rpx;
        .item {
            flex-wrap: wrap;
            display: inline-flex;
            padding: 16rpx;
        }
    }
}
</style>
