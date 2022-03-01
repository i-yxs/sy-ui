
<template>
    <view
        v-if="visible"
        :class="[align, {fixed: fixed}]"
        class="table-body"
    >
        <view class="thead">
            <view class="tr">
                <view
                    v-if="numberVisible"
                    class="td"
                >
                    <view class="cell number folded f1">序号</view>
                </view>
                <view
                    v-for="(column, index) in columns"
                    :key="index"
                    :style="{
                        flex: column.flex ? 1 : '',
                        width: column.width + 'rpx',
                        textAlign: column.align
                    }"
                    class="td"
                >
                    <view class="cell folded f1">{{ column.label }}</view>
                </view>
            </view>
        </view>
        <view class="tbody">
            <view
                v-for="(item, index) in config.list"
                :key="index"
                class="tr"
            >
                <view
                    v-if="numberVisible"
                    class="td"
                >
                    <view class="cell number">{{ getNumber(index) }}</view>
                </view>
                <view
                    v-for="column in columns"
                    :key="column.prop"
                    :style="{
                        flex: column.flex ? 1 : '',
                        width: column.width + 'rpx',
                        textAlign: column.align
                    }"
                    class="td"
                    @click="handleTdClick(column, index)"
                >
                    <view class="cell">
                        <template v-if="column.type === 'dateRange'">
                            {{ item[column.minKey] | dateFormat(column.format) }} 至 {{ item[column.maxKey] | dateFormat(column.format) }}
                        </template>
                        <template v-else-if="isEmpty(item[column.prop])">
                            {{ '- -' }}
                        </template>
                        <template v-else-if="column.type === 'dict'">
                            {{ item[column.prop] | getDictProp(column.dictName) }}
                        </template>
                        <template v-else-if="column.type === 'date'">
                            {{ item[column.prop] | dateFormat(column.format) }}
                        </template>
                        <template v-else-if="column.type === 'money'">
                            {{ item[column.prop] | moneyFormat(column.digit) }}
                        </template>
                        <template v-else-if="column.type === 'status'">
                            <view class="status-wrap">
                                <view :style="{background: getDictProp(item[column.prop], column.dictName, 'color')}" class="dot"/>
                                <view class="text">{{ item[column.prop] | getDictProp(column.dictName) }}</view>
                            </view>
                        </template>
                        <template v-else>
                            {{ item[column.prop] }}
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        name: 'TableBody',
        props: {
            fixed: Boolean,
            align: { type: String, default: 'left' }
        },
        data() {
            return {
            }
        },
        inject: ['provideComponent'],
        computed: {
            config() {
                return this.provideComponent.provideData
            },
            columns() {
                let columns = this.config.columns.filter(v => v.visible !== false)
                if (this.fixed) {
                    switch (this.align) {
                    case 'left':
                        return columns.filter(v => v.fixed && v.fixed !== 'right')
                    case 'right':
                        return columns.filter(v => v.fixed === 'right')
                    }
                }
                return columns
            },
            visible() {
                return this.config.list.length
            },
            numberVisible() {
                if (this.fixed) {
                    if (this.align === 'left') {
                        return !!this.columns.length
                    }
                    return false
                }
                return true
            }
        },
        mounted() {
        },
        methods: {
            getNumber(index) {
                let { pageSize, pageIndex } = this.config
                pageSize = this.isEmpty(pageSize) ? 9999 : pageSize
                pageIndex = this.isEmpty(pageIndex) ? 1 : pageIndex
                return ((pageIndex - 1) * pageSize + index + 1)
            }
        }
    }
</script>
<style lang="scss" scoped>
.table-body {
    &.fixed {
        position: absolute;
        top: 0;
        bottom: 0;
        box-shadow: 0 0 10px rgba(0,0,0,.12);
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
    }
    .thead {
        .td {
            font-size: 28rpx;
            height: 86rpx;
            color: $APP_COLOR;
            font-weight: bold;
            border-bottom: solid 1px #EFEFF4;
        }
    }
    .tbody {
        .td {
            font-size: 26rpx;
            min-height: 70rpx;
        }
    }
    .tr {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }
    .td {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        background: #fff;
        padding: 10rpx 0;
        box-sizing: border-box;
    }
    .cell {
        padding: 0 20rpx;
        word-break: break-all;
    }
    .number {
        width: 60rpx;
        text-align: center;
    }
    .status-wrap {
        display: flex;
        align-items: center;
        .dot {
            width: 10rpx;
            height: 10rpx;
            border-radius: 50%;
        }
        .text {
            margin-left: 12rpx;
        }
    }
}
</style>

