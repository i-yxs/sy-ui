<!--
* @description 加载提示
* @author yxs
!-->
<template>
    <view
        v-if="type !== 'hide'"
        :style="styles_"
        :class="{column: config_.column}"
        :data-type="type"
        class="sy-load-more"
    >
        <div
            v-if="config_.icon"
            :class="config_.icon"
            :style="iconStyles_"
            class="icon"
        />
        <div :style="textStyles_" class="text">
            {{ config_.text }}
        </div>
    </view>
</template>
<script>

    import { deepMerge, objectToCss } from '../../utils'

    const typeConfig = {
        tips: {
            text: '上拉加载更多',
            styles: {
                color: '#999',
                height: '120rpx'
            }
        },
        loading: {
            text: '加载中',
            icon: 'sy-ui-icon-loading',
            styles: {
                color: '#999',
                height: '120rpx'
            },
            iconStyles: {
                margin: '0 12rpx 0 0'
            }
        },
        empty: {
            text: '无数据',
            icon: 'sy-ui-icon-not-data',
            styles: {
                color: '#999',
                height: '200rpx'
            },
            column: true,
            iconStyles: {
                color: '#cecece',
                fontSize: '100rpx',
                margin: '0 0 12rpx 0'
            }
        },
        maxpage: {
            text: '没有更多了',
            styles: {
                color: '#999',
                height: '120rpx'
            }
        },
        error: {
            text: '请求出错了',
            icon: 'sy-ui-icon-not-data',
            styles: {
                color: '#999',
                height: '300rpx'
            },
            column: true,
            iconStyles: {
                color: '#cecece',
                fontSize: '120rpx',
                margin: '0 0 20rpx 0'
            }
        }
    }
    export default {
        name: 'SyLoadMore',
        props: {
            type: { type: String, default: 'tips' },
            config: Object
        },
        computed: {
            config_() {
                return deepMerge(typeConfig, this.config)[this.type] || {}
            },
            styles_() {
                return objectToCss(this.config_.styles)
            },
            textStyles_() {
                return objectToCss(this.config_.textStyles)
            },
            iconStyles_() {
                return objectToCss(this.config_.iconStyles)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-load-more{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1em;
    &.column{
        flex-direction: column;
    }
    .icon,
    .text{
        display: inline-block;
    }
}
</style>

