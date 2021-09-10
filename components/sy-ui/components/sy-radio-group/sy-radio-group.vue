<!--
* @description 单选按钮组
* @author yxs
!-->
<template>
    <view
        :class="{ flex: flex, readonly: readonly, disabled: disabled}"
        :style="style"
        class="sy-radio-group"
    >
        <template v-if="readonly">
            <text v-if="isEmpty(viewValue)" class="input-placeholder">
                {{ placeholder }}
            </text>
            <text v-else>{{ viewValue }}</text>
        </template>
        <view v-else class="group">
            <view v-for="(item, index) in groupData" :key="index" class="item" @click="handleActive(item)">
                <sy-radio
                    :size="size"
                    :text="item[labelKey]"
                    :color="color"
                    :value="insideValue"
                    :label="item[valueKey]"
                    :button="button"
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
        name: 'SyRadioGroup',
        props: {
            value: { default: null },
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
            // 使用flex布局
            flex: { type: Boolean, default: false },
            // 没有值时的占位符
            placeholder: String,
            // SyRadio 组件参数
            size: { type: String, default: defaultValue.checkbox.size },
            color: { type: String, default: defaultValue.checkbox.color },
            button: { default: false },
            isCancel: { default: false }
        },
        data() {
            return {
                insideValue: null
            }
        },
        computed: {
            style() {
                return jsonToCss(this.styles)
            },
            // 只有在value和内部value相同时才能进行交互操作
            canActive() {
                return this.insideValue === this.value
            },
            groupData() {
                return this.options.filter(item => item.visible !== false)
            },
            viewValue() {
                return (this.groupData.find(item => item[this.valueKey] === this.value) || {})[this.labelKey]
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.insideValue = value
                }
            }
        },
        methods: {
            handleActive(data) {
                if (this.canActive) {
                    var value = data[this.valueKey]
                    if (data[this.valueKey] === this.value && this.isCancel) {
                        value = null
                    }
                    this.insideValue = value
                    this.$emit('input', value)
                    this.$emit('change', value)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-radio-group {
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
    &.flex {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .group {
        margin-left: -16rpx;
        .item {
            display: inline-flex;
            padding: 16rpx;
        }
    }
}
</style>

