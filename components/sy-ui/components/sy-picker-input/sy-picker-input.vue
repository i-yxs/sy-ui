<!--
* @description 选择器输入框
* @author yxs
!-->
<template>
    <view
        v-if="!__props.hidden"
        :class="{ overlay: __props.overlay }"
        class="sy-picker-input"
        @click="handleActive"
    >
        <template v-if="!__props.overlay">
            <sy-input
                :props="inputProps"
                @clear="$emit('clear')"
            />
        </template>
    </view>
</template>
<script>

    import props from './props'
    import mixinProps, { assignProps } from '../../mixin/props'

    export default {
        name: 'SyPickerInput',
        mixins: [mixinProps],
        props,
        computed: {
            inputProps() {
                return assignProps('SyInput', {
                    ...this.__props,
                    suffixIcon: this.suffixIconName
                })
            },
            suffixIconName() {
                if (this.__props.loading) {
                    return 'sy-ui-icon-loading'
                } else {
                    return this.__props.readonly ? '' : this.__props.suffixIcon
                }
            }
        },
        methods: {
            handleActive() {
                if (this.__props.readonly || this.__props.loading || this.__props.disabled) return
                this.$emit('click')
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-picker-input{
    &.overlay{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        z-index: 20;
    }
}
</style>

