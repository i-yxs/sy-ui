<!--
* @description 多选按钮组
* @author yxs
!-->
<template>
    <view
        v-if="__props.options.length > 0"
        :class="{disabled: __props.disabled}"
        :style="style"
        class="sy-checkbox-group"
    >
        <template v-if="__props.readonly">
            <text v-if="isEmpty(viewValue)" class="input-placeholder">
                {{ __props.placeholder }}
            </text>
            <text v-else>{{ viewValue }}</text>
        </template>
        <view v-else class="group">
            <view
                v-for="(item, index) in options_"
                :key="index"
                class="item"
                @click="handleActive(item, index)"
            >
                <sy-checkbox
                    :size="__props.size"
                    :text="item[__props.labelKey]"
                    :color="__props.color"
                    :value="inputValue[index]"
                    :button="__props.button"
                    :disabled="insideDisabled[index]"
                    :true-label="item[__props.valueKey]"
                    readonly
                />
            </view>
        </view>
    </view>
</template>
<script>

    import store from '@/store'
    import props from './props'
    import { objectToCss, getProperty } from '../../utils'
    import mixinProps from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'

    export default {
        name: 'SyCheckboxGroup',
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                insideValue: [],
                insideDisabled: []
            }
        },
        computed: {
            style() {
                return objectToCss(this.__props.styles)
            },
            options_() {
                let options = this.isEmpty(this.provideData) ? this.__props.options : this.provideData
                let excludes = this.__props.excludes || []
                let valueKey = this.__props.valueKey
                if (typeof options === 'string') {
                    options = getProperty(store.state.baseData, options)
                }
                options = Array.isArray(options) ? options : []
                // 过滤不显示的项
                options = options.filter(option => {
                    return excludes.indexOf(option[valueKey]) === -1 && option.visible !== false
                })
                return options
            },
            // 只有在value和内部value相同时才能进行交互操作
            canActive() {
                let value = Array.isArray(this.__props.value) ? this.__props.value : []
                if (!this.insideValue.length && !value.length) {
                    return true
                } else if (this.insideValue.findIndex((item, index) => item !== value[index]) === -1) {
                    return true
                }
                return false
            },
            viewValue() {
                return this.options_.filter(item => this.insideValue.indexOf(item[this.__props.valueKey]) > -1).map(item => item[this.__props.labelKey]).join(this.__props.separator)
            },
            inputValue() {
                return this.options_.map(item => {
                    if (this.insideValue.indexOf(item[this.__props.valueKey]) > -1) {
                        return item[this.__props.valueKey]
                    }
                    return false
                })
            }
        },
        watch: {
            '__props.value': {
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
                if (count <= Number(this.__props.min)) {
                    // 达到最小选择数，禁用所有已选择的SyCheckbox组件
                    this.insideDisabled = this.inputValue.map(item => item !== false)
                } else if (count >= Number(this.__props.max)) {
                    // 达到最大选择数，禁用所有未选择的SyCheckbox组件
                    this.insideDisabled = this.inputValue.map(item => item === false)
                } else {
                    this.insideDisabled = this.inputValue.map(() => false)
                }
            },
            handleActive(data, idx) {
                if (this.canActive && !this.insideDisabled[idx]) {
                    var value = [...this.insideValue]
                    var index = this.insideValue.indexOf(data[this.__props.valueKey])
                    if (index > -1) {
                        value.splice(index, 1)
                    } else {
                        value.push(data[this.__props.valueKey])
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
    &.disabled {
        pointer-events: none;
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
