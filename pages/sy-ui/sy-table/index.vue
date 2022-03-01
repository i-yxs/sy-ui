<template>
    <view class="content">
        <view class="title">
            基础用法
        </view>
        <sy-table-config/>
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                tableConfig: {
                    list: [
                        { code: 0, purchaseDate: '2021/08/17 00:00:00', projectName: 524214.658, approvalStatus: 0 },
                        {},
                        {}
                    ],
                    columns: [
                        {
                            prop: 'code',
                            label: '申请单号',
                            width: 130,
                            type: 'dict',
                            dictName: 'profession'
                        },
                        {
                            prop: 'projectName',
                            label: '项目',
                            width: 220,
                            type: 'money'
                        },
                        {
                            prop: 'productName',
                            label: '产品',
                            width: 155
                        },
                        {
                            prop: 'purchaseCount',
                            label: '需求数量',
                            width: 110,
                            dbProp: 'p.c_purchase_count',
                            sortable: 'custom'
                        },
                        {
                            type: 'date',
                            prop: 'purchaseDate',
                            label: '需求日期',
                            width: 110,
                            dbProp: 'p.c_purchase_date',
                            sortable: 'custom'
                        },
                        {
                            prop: 'applyUserName',
                            label: '提交人',
                            width: 110
                        },
                        {
                            type: 'date',
                            prop: 'applyDate',
                            label: '提交时间',
                            width: 110,
                            dbProp: 'p.c_apply_date',
                            sortable: 'custom'
                        },
                        {
                            fixed: 'right',
                            prop: 'approvalStatus',
                            type: 'status',
                            dictName: [
                                { label: '审批中', value: 0, color: '#55b1f2' },
                                { label: '已撤回', value: 1, color: '#f59a23' },
                                { label: '已驳回', value: 2, color: '#e65a6b' },
                                { label: '已通过', value: 3, color: '#67c23a' },
                                { label: '已核销', value: 4, color: '#67c23a' }
                            ],
                            label: '状态',
                            width: 120
                        }
                    ]
                }
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        }
    }
</script>
<style lang="scss" scoped>
.content{
    padding: 30rpx;
    background: #fff;
    .title{
        display: block;
        color: #333;
        font-size: 26rpx;
        font-weight: bold;
        border-left: solid 6rpx #ddd;
        padding-left: 12rpx;
        margin: 12rpx 0;
    }
}
</style>
