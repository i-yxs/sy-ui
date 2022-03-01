<!--
* @description 区域选择器
* @author yxs
!-->
<template>
    <sy-picker
        v-if="__props.type === 'picker'"
        :props="pickerProps"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
    />
    <sy-picker-tree
        v-else-if="__props.type === 'tree'"
        :props="pickerTreeProps"
        provide-key="districtTree"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
    />
</template>
<script>
    // 方法
    import props from './props'
    import { mapGetters } from 'vuex'
    import mixinProps, { assignProps } from '../../mixin/props'
    // 组件

    export default {
        name: 'SyPickerDistrict',
        mixins: [mixinProps],
        props,
        provide() {
            return {
                provideComponent: this
            }
        },
        computed: {
            ...mapGetters(['districtTree']),
            loading() {
                return !this.districtTree
            },
            pickerProps() {
                return assignProps('SyPicker', {
                    ...this.__props,
                    mode: 'linkage',
                    loading: this.loading,
                    options: this.districtTree
                })
            },
            pickerTreeProps() {
                return assignProps('SyPickerTree', {
                    ...this.__props,
                    loading: this.loading
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
