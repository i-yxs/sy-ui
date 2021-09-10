<!--
* @description 区域选择器
* @author yxs
!-->
<template>
    <sy-picker
        v-if="type === 'picker'"
        :rows="rows"
        :deep="deep"
        :value="value"
        :height="height"
        :options="districtTree"
        :loading="loading"
        :readonly="readonly"
        :disabled="disabled"
        :label-key="labelKey"
        :value-key="valueKey"
        :children-key="childrenKey"
        :icon-size="iconSize"
        :icon-color="iconColor"
        :prefix-icon="prefixIcon"
        :emit-path="emitPath"
        :separator="separator"
        :suffix-icon="suffixIcon"
        :clearable="clearable"
        :placeholder="placeholder"
        mode="linkage"
        @input="$emit('input', $event)"
        @change="$emit('input', $event)"
    />
    <sy-picker-tree
        v-else-if="type === 'tree'"
        :rows="rows"
        :deep="deep"
        :value="value"
        :height="height"
        :loading="loading"
        :options="districtTree"
        :emit-path="emitPath"
        :readonly="readonly"
        :disabled="disabled"
        :multiple="multiple"
        :accordion="accordion"
        :separator="separator"
        :label-key="labelKey"
        :value-key="valueKey"
        :children-key="childrenKey"
        :clearable="clearable"
        :placeholder="placeholder"
        :icon-size="iconSize"
        :icon-color="iconColor"
        :prefix-icon="prefixIcon"
        :suffix-icon="suffixIcon"
        :check-strictly="checkStrictly"
        @input="$emit('input', $event)"
        @change="$emit('input', $event)"
    />
</template>
<script>
    // 方法
    import { mapState } from 'vuex'
    import { getExclude } from '@/components/sy-ui/utils/publicProps'
    // 组件

    export default {
        name: 'SyDistrictPicker',
        components: {
        },
        props: {
            // 选择器类型 picker：普通联动选择器 tree：树状选择器
            type: { type: String, default: 'picker' },
            deep: { default: 999 },
            value: { type: null, default: '' },
            labelKey: { default: 'label' },
            valueKey: { default: 'value' },
            childrenKey: { default: 'children' },
            emitPath: { default: false },
            separator: { type: String, default: '/' },
            required: { type: Boolean, default: false },
            multiple: { default: false },
            accordion: { default: false },
            checkStrictly: { default: false },
            // input 参数
            ...getExclude('pickerInput', 'loading')
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapState(['districtTree']),
            loading() {
                return !this.districtTree
            }
        },
        watch: {
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
</style>
