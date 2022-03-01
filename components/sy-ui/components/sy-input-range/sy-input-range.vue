<!--
* @description 范围输入框
* @author yxs
!-->
<template>
    <view
        :style="styles_"
        class="sy-input-range"
    >
        <view
            :style="{
                borderRadius: prefixInputProps_.height
            }"
            class="input sy-ui-din-medium"
        >
            <sy-input
                :props="prefixInputProps_"
                @input="handleInput('prefix', $event)"
                @change="$emit('change', $event)"
            >
                <view v-if="__props.prepend" slot="prepend" class="prepend">{{ __props.prepend }}</view>
                <view v-if="__props.append" slot="append" class="append">{{ __props.append }}</view>
            </sy-input>
        </view>
        <view class="separator">{{ __props.separator }}</view>
        <view
            :style="{
                borderRadius: prefixInputProps_.height
            }"
            class="input sy-ui-din-medium"
        >
            <sy-input
                :props="suffixInputProps_"
                @input="handleInput('suffix', $event)"
                @change="$emit('change', $event)"
            >
                <view v-if="__props.prepend" slot="prepend" class="prepend">{{ __props.prepend }}</view>
                <view v-if="__props.append" slot="append" class="append">{{ __props.append }}</view>
            </sy-input>
        </view>
    </view>
</template>
<script>

    import props from './props'
    import mixinProps, { assignProps } from '../../mixin/props'
    import { objectToCss } from '../../utils'
    import mixinProvide from '../../mixin/provideComponent'

    export default {
        name: 'SyInputRange',
        mixins: [mixinProps, mixinProvide],
        props,
        data() {
            return {
                prefixValue: '',
                suffixValue: ''
            }
        },
        computed: {
            styles_() {
                return objectToCss({
                    textAlign: 'center',
                    ...this.__props.styles
                })
            },
            prefixInputProps_() {
                let {
                    type,
                    height,
                    readonly,
                    clearable,
                    quickInput,
                    prefixPlaceholder,
                    prefixInputProps
                } = this.__props
                return assignProps('SyInput', {
                    type,
                    height,
                    readonly,
                    clearable,
                    quickInput,
                    placeholder: prefixPlaceholder,
                    ...prefixInputProps,
                    value: this.prefixValue
                })
            },
            suffixInputProps_() {
                let {
                    type,
                    height,
                    readonly,
                    clearable,
                    quickInput,
                    suffixPlaceholder,
                    suffixInputProps
                } = this.__props
                return assignProps('SyInput', {
                    type,
                    height,
                    readonly,
                    clearable,
                    quickInput,
                    placeholder: suffixPlaceholder,
                    ...suffixInputProps,
                    value: this.suffixValue
                })
            }
        },
        watch: {
            '__props.value': {
                deep: true,
                immediate: true,
                handler(value) {
                    let prefixValue = ''
                    let suffixValue = ''
                    let { bindProps } = this.__props
                    if (this.provideData && Array.isArray(bindProps) && bindProps.length >= 2) {
                        prefixValue = this.provideData[bindProps[0]]
                        suffixValue = this.provideData[bindProps[1]]
                    } else if (Array.isArray(value)) {
                        let [prefix, suffix] = value
                        prefixValue = this.isEmpty(prefix) ? '' : prefix
                        suffixValue = this.isEmpty(suffix) ? '' : suffix
                    }
                    this.prefixValue = prefixValue
                    this.suffixValue = suffixValue
                }
            },
            provideData: 'updateBindObject'
        },
        methods: {
            updateValue() {
                let { min, max } = this.__props
                min = this.isEmpty(min) ? 0 : min
                max = this.isEmpty(max) ? 100 : max
                this.prefixValue = Math.min(Math.max(this.prefixValue, min), this.suffixValue)
                this.suffixValue = Math.max(Math.min(this.suffixValue, max), this.prefixValue)
                this.updateBindObject()
                this.$emit('input', [this.prefixValue, this.suffixValue])
            },
            // 更新绑定对象
            updateBindObject() {
                let { bindProps } = this.__props
                if (this.provideData && Array.isArray(bindProps) && bindProps.length >= 2) {
                    this.$set(this.provideData, bindProps[0], this.prefixValue)
                    this.$set(this.provideData, bindProps[1], this.suffixValue)
                }
            },
            // 输入时触发
            handleInput(type, value) {
                this[type + 'Value'] = value
                clearTimeout(this.inputTimer)
                this.inputTimer = setTimeout(() => {
                    this.updateValue()
                }, 300)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-input-range {
    display: flex;
    align-items: center;
    padding: 18rpx 0;
    .input {
        flex: 1;
        border: solid 1px #c9c9c9;
        padding: 0 20rpx;
    }
    .separator {
        padding: 0 20rpx;
    }
    .append,
    .prepend {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 26rpx;
        color: #999;
        margin-left: 12rpx;
    }
}
</style>
