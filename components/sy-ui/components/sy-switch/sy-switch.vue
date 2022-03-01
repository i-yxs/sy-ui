<!--
* @description 开关按钮
* @author yxs
!-->
<template>
    <view
        :style="style"
        class="sy-switch"
    >
        <template v-if="__props.readonly">
            <text v-if="isEmpty(viewValue)" class="input-placeholder">
                {{ __props.placeholder }}
            </text>
            <text v-else>{{ viewValue }}</text>
        </template>
        <template v-else>
            <switch
                :color="color"
                :checked="checked"
                :disabled="disabled"
                @change="handleChange"
            />
            <text class="label">{{ checked ? trueLabel : falseLabel }}</text>
        </template>
    </view>
</template>
<script>
    import props from './props'
    import mixinProps from '../../mixin/props'
    import { objectToCss } from '../../utils'

    export default {
        name: 'SySwitch',
        mixins: [mixinProps],
        props,
        data() {
            return {
                checked: false
            }
        },
        computed: {
            style() {
                return objectToCss(this.__props.styles)
            },
            viewValue() {
                return this.checked ? this.__props.trueLabel : this.__props.falseLabel
            }
        },
        watch: {
            '__props.value': {
                immediate: true,
                handler(value) {
                    this.checked = this.__props.trueValue === value
                }
            }
        },
        methods: {
            handleChange(e) {
                this.checked = e.detail.value
                var value = this.checked ? this.__props.trueValue : this.__props.falseValue
                this.$emit('input', value)
                this.$emit('change', value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-switch {
    display: inline-flex;
    align-items: center;
    switch + .label {
        margin-left: 10rpx;
    }
}
</style>

