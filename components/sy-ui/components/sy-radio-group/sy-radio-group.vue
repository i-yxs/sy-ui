<!--
* @description 单选按钮组
* @author yxs
!-->
<template>
    <view
        v-if="__props.options.length > 0"
        :class="{ disabled: __props.disabled}"
        :style="style"
        class="sy-radio-group"
    >
        <template v-if="__props.readonly">
            <text v-if="isEmpty(viewValue)" class="input-placeholder">{{ __props.placeholder }}</text>
            <text v-else>{{ viewValue }}</text>
        </template>
        <view v-else class="group">
            <view
                v-for="(item, index) in options_"
                :key="index"
                class="item"
                @click="handleActive(item)"
            >
                <sy-radio
                    :size="__props.size"
                    :text="item[__props.labelKey]"
                    :color="__props.color"
                    :value="insideValue"
                    :label="item[__props.valueKey]"
                    :button="__props.button"
                    readonly
                />
            </view>
        </view>
    </view>
</template>
<script>

    import store from '@/store'
    import props from './props'
    import mixinProps from '../../mixin/props'
    import { objectToCss, getProperty } from '../../utils'
    import mixinProvide from '../../mixin/provideComponent'

    export default {
        name: 'SyRadioGroup',
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                insideValue: null
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
                return this.insideValue === this.__props.value
            },
            viewValue() {
                return (this.options_.find(item => item[this.__props.valueKey] === this.__props.value) || {})[this.__props.labelKey]
            }
        },
        watch: {
            '__props.value': {
                immediate: true,
                handler(value) {
                    this.insideValue = value
                }
            }
        },
        methods: {
            handleActive(data) {
                if (this.__props.readonly) return
                if (this.canActive) {
                    let value = data[this.__props.valueKey]
                    if (data[this.__props.valueKey] === this.__props.value && this.__props.isCancel) {
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
    &.disabled {
        opacity: .7;
        pointer-events: none;
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

