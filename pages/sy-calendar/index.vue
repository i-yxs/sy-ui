<template>
    <view class="content">
        <view class="title">
            默认日历
        </view>
        <view class="container">
            <view class="toolbar sy-ui-border-bottom">
                <view class="item">
                    <sy-radio-group
                        v-model="mode"
                        :options="[
                            {label: '默认', value: 'default'},
                            {label: '单选', value: 'radio'},
                            {label: '多选', value: 'multiple'},
                            {label: '范围', value: 'range'},
                        ]"
                    />
                </view>
                <view class="item sy-ui-border-top">
                    <sy-radio-group
                        v-model="type"
                        :options="[
                            {label: '日期', value: 'date'},
                            {label: '星期', value: 'week'},
                            {label: '月份', value: 'month'},
                            {label: '年份', value: 'year'},
                        ]"
                    />
                </view>
                <view class="item input">
                    <sy-input v-model="date1" clearable />
                </view>
            </view>
            <sy-calendar
                v-model="date1"
                :mode="mode"
                :type="type"
                :marker="markerStyle"
                start="2021-3-5"
                end="2021-3-20"
                @change="handleChange"
            />
        </view>
    </view>
</template>
<script>
    import dateTools from '@/components/sy-ui/utils/dateTools'

    export default {
        props: {},
        data() {
            let nowDay = new Date()
            let year = dateTools.format(nowDay, 'YYYY')
            let month = dateTools.format(nowDay, 'MM')
            let date = dateTools.format(nowDay, 'DD')
            return {
                mode: 'default',
                type: 'date',
                date1: '2021-1-01',
                markerStyle: JSON.stringify({
                    [`${year}-${month}-${date}`]: {
                        width: '10rpx',
                        height: '10rpx',
                        left: '50%',
                        bottom: '-5rpx',
                        background: 'red'
                    },
                    [`${year}-${month}`]: {
                        width: '10rpx',
                        height: '10rpx',
                        left: '50%',
                        bottom: '30rpx',
                        background: 'red'
                    },
                    [year]: {
                        width: '10rpx',
                        height: '10rpx',
                        left: '50%',
                        bottom: '30rpx',
                        background: 'red'
                    }
                })
            }
        },
        methods: {
            test(data) {
                console.log(data)
            },
            handleChange(value) {
            }
        }
    }
</script>
<style lang="scss" scoped>
.content{
    padding: 30rpx;
    background: #efefef;
    .title{
        display: block;
        color: #333;
        font-size: 26rpx;
        font-weight: bold;
        border-left: solid 6rpx #ddd;
        padding-left: 12rpx;
        margin: 12rpx 0;
    }
    .container {
        position: relative;
        width: 100%;
        background: #fff;
        .toolbar {
            padding: 30rpx;
            .item{
                &.input{
                    background: #eee;
                    padding: 0 20rpx;
                }
            }
        }
    }
}
</style>
