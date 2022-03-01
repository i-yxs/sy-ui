<!--
* @description 表格，使用数据驱动的表格组件
* @author yxs
!-->
<template>
    <view class="sy-table">
        <table-body
            fixed
        />
        <view class="scroll-view">
            <table-body/>
        </view>
        <table-body
            align="right"
            fixed
        />
        <sy-load-more v-if="!provideData.list.length" type="empty"/>
    </view>
</template>
<script>
    // 工具
    import mixin from '../../mixin/provideComponent'
    // 组件
    import TableBody from './table-body'

    export default {
        name: 'SyTable',
        components: {
            TableBody
        },
        mixins: [mixin],
        props: {
            provideKey: { default: 'tableConfig' }
        },
        data() {
            return {
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        computed: {
        },
        mounted() {
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
.sy-table {
    position: relative;
    overflow: hidden;
    .scroll-view {
        overflow: auto;
    }
}
</style>

