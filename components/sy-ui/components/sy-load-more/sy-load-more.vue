<!--
* @description 加载更多
* @author yxs
!-->
<template>
    <view
        v-if="type !== 'hide'"
        :style="{color: currentType.color, height: currentType.height, background: currentType.background}"
        :class="{column: currentType.column}"
        :data-type="type"
        class="sy-load-more"
    >
        <div
            v-if="currentType.icon"
            :class="currentType.icon"
            :style="{color: currentType.iconColor, fontSize: currentType.iconSize, height: currentType.iconSize, lineHeight: currentType.iconSize}"
            class="icon"
        />
        <div :style="{color: currentType.textColor, margin: textMargin}" class="text">
            {{ currentType.text }}
        </div>
    </view>
</template>
<script>
    const Config = {
        tips: {
            text: '上拉加载更多',
            space: '12rpx',
            color: '#999',
            height: '120rpx'
        },
        loading: {
            text: '加载中',
            icon: 'sy-ui-icon-loading',
            space: '12rpx',
            color: '#999',
            height: '120rpx'
        },
        empty: {
            text: '无数据',
            icon: 'sy-ui-icon-not-data',
            space: '10rpx',
            color: '#999',
            height: '200rpx',
            column: true,
            iconSize: '100rpx',
            iconColor: '#cecece'
        },
        maxpage: {
            text: '没有更多了',
            space: '12rpx',
            color: '#999',
            height: '120rpx'
        },
        error: {
            text: '请求出错了',
            icon: 'sy-ui-icon-not-data',
            space: '20rpx',
            color: '#999',
            height: '300rpx',
            column: true,
            iconSize: '120rpx',
            iconColor: '#cecece'
        }
    }
    export default {
        name: 'SyLoadMore',
        props: {
            type: {
                type: String,
                default: 'tips'
            },
            config: {
                type: Object
            }
        },
        data() {
            return {
                configOption: {}
            }
        },
        computed: {
            currentType() {
                return this.configOption[this.type]
            },
            textMargin() {
                if (this.type !== 'hide') {
                    if (this.currentType.column) {
                        return `${this.currentType.space} 0 0 0`
                    }
                    return `0 0 0 ${this.currentType.space}`
                }
                return ''
            }
        },
        watch: {
            config: {
                deep: true,
                immediate: true,
                handler(value) {
                    var config = {}
                    if (value) {
                        Object.keys(value).forEach(key => {
                            config[key] = {
                                ...Config[key],
                                ...value[key]
                            }
                        })
                    }
                    this.configOption = {
                        ...Config,
                        ...config
                    }
                }
            }
        },
        methods: {

        }
    }
</script>
<style lang="scss" scoped>
.sy-load-more{
    display: flex;
    align-items: center;
    justify-content: center;
    .icon{
        display: inline-block;
    }
    &.column{
        flex-direction: column;
    }
}
</style>

