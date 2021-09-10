<!--
* @description 选择器
* @author yxs
!-->
<template>
    <view
        v-if="!hidden"
        :class="{overlay: overlay, loading: loading, disabled: disabled}"
        class="sy-picker-input"
        @tap="$emit('click')"
    >
        <template v-if="!overlay">
            <sy-input
                :rows="inputProps.rows"
                :value="value"
                :height="height"
                :disabled="disabled"
                :readonly="readonly"
                :clearable="clearable && !disabled"
                :prefix-icon-styles="inputProps.prefixIconStyles"
                :suffix-icon-styles="inputProps.suffixIconStyles"
                :prefix-icon="prefixIcon"
                :suffix-icon="suffixIconName"
                :placeholder="placeholder"
                @clear="$emit('clear')"
            />
        </template>
    </view>
</template>
<script>
    // 方法
    import publicProps from '@/components/sy-ui/utils/publicProps'

    export default {
        name: 'SyPickerInput',
        props: {
            value: null,
            ...publicProps.pickerInput
        },
        data() {
            return {

            }
        },
        computed: {
            suffixIconName() {
                return this.loading ? 'sy-ui-icon-loading' : this.suffixIcon
            }
        },
        watch: {
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
.sy-picker-input{
    &.loading,
    &.disabled{
        pointer-events: none;
    }
    &.disabled{
        background-color: #f5f7fa;
        color: #c0c4cc;
    }
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

