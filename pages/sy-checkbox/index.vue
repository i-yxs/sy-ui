<template>
    <view class="content">
        <view class="title">
            基础用法
        </view>
        <sy-checkbox v-model="checked1" text="选项1" />
        <view class="title">
            按钮样式
        </view>
        <sy-checkbox v-model="checked1" text="选项1" button />
        <sy-checkbox v-model="checked1" text="选项2" button />
        <view class="title">
            禁用状态
        </view>
        <sy-checkbox v-model="checked1" text="选项1" disabled />
        <view class="title">
            多选框组
        </view>
        <sy-checkbox-group
            v-model="checked2"
            :options="[
                {label: '选项1', value: '1'},
                {label: '选项2', value: '2'},
                {label: '选项3', value: '3'},
            ]"
        />
        <view class="title">
            多选框组按钮样式
        </view>
        <sy-checkbox-group
            v-model="checked2"
            :options="[
                {label: '选项1', value: '1'},
                {label: '选项2', value: '2'},
                {label: '选项3', value: '3'},
            ]"
            button
        />
        <view class="title">
            全选
        </view>
        <sy-checkbox v-model="checkAll" :indeterminate="isIndeterminate" text="全选" @change="handleCheckAllChange" />
        <sy-checkbox-group
            v-model="checkedCities"
            :options="cities"
            label-key="value"
            value-key="value"
            @change="handleCheckedChange"
        />
        <view class="title">
            可选项目数量的限制
        </view>
        <sy-checkbox-group
            v-model="checked4"
            :options="[
                {label: '选项1', value: '1'},
                {label: '选项2', value: '2'},
                {label: '选项3', value: '3'},
                {label: '选项4', value: '4'},
            ]"
            min="1"
            max="2"
        />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                checked1: false,
                checked2: ['1'],
                checkedCities: ['上海', '北京'],
                cities: [
                    { value: '上海' },
                    { value: '北京' },
                    { value: '广州' },
                    { value: '深圳' }
                ],
                checkAll: false,
                isIndeterminate: false,
                checked4: [1]
            }
        },
        mounted() {
            this.handleCheckedChange(this.checkedCities)
        },
        methods: {
            handleCheckAllChange(bool) {
                this.checkedCities = bool ? this.cities : []
                this.isIndeterminate = false
            },
            handleCheckedChange(value) {
                const checkedCount = value.filter(item => item !== false).length
                this.checkAll = checkedCount === this.cities.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
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
