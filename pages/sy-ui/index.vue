<template>
    <view class="content">
        <view class="head-wrap">
            <view class="search-wrap">
                <sy-input
                    v-model="keyword"
                    clearable
                    placeholder="输入组件名称搜索"
                    prefix-icon="sy-ui-icon-search"
                    @input="handleKeywordChange"
                />
            </view>
        </view>
        <view class="body-wrap">
            <view style="height: 130rpx" />
            <sy-tree
                ref="SyTree"
                accordion
                provide-key="treeOptions"
                show-line-between
                @node-click="handleNodeClick"
            />
        </view>
    </view>
</template>
<script>
    import menuTree from './menuTree'
    import dateTools from '@/components/sy-ui/utils/dateTools'

    export default {
        props: {},
        data() {
            return {
                keyword: '',
                treeOptions: menuTree
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        computed: {},
        onShow() {},
        onLoad() {
            console.log('当前日期：', dateTools.format(new Date(), 'YYYY-MM-DD HH:mm:ss SSS 星期d 第q季度 YY年第WW周'))
            var apart = dateTools.apart('2077', 'YMDHHmmssSSS')
            var unit = { 'Y': '年', 'M': '个月', 'D': '日', 'H': '小时', 'm': '分', 's': '秒', 'S': '毫秒' }
            console.log('距离2077年还有：', Object.keys(apart).map(key => apart[key] + unit[key]).join(''))
        },
        onUnload() {
        },
        methods: {
            handleNodeClick({ data }) {
                if (!data.children) {
                    uni.navigateTo({
                        url: `/pages/sy-ui/${data.value}/index`
                    })
                }
            },
            handleKeywordChange() {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    var keyword = this.keyword
                    this.$refs.SyTree.filter((data) => {
                        return !keyword || data.label.indexOf(keyword) > -1
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.head-wrap{
    position: fixed;
    top: var(--window-top);
    left: 0;
    right: 0;
    background: $APP_COLOR;
    padding: 30rpx;
    border-radius: 0 0 40rpx 40rpx;
    z-index: 100;
    .search-wrap{
        background: #fff;
        border-radius: 40rpx;
        padding: 0 30rpx;
    }
}
.body-wrap{
    font-size: 26rpx;
}
</style>
