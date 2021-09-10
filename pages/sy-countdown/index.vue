<template>
    <view class="content">
        <view class="title">
            默认倒计时：距离{{ time1 }}
        </view>
        <sy-countdown
            v-slot="{type, value}"
            :value="time1"
        >
            <view>{{ value }}{{ unit[type] }}</view>
        </sy-countdown>
        <view class="title">
            自定义格式（时分秒）
        </view>
        <sy-countdown
            v-slot="{type, value}"
            :value="time1"
            format="HHmmssSSS"
        >
            <view>{{ value }}{{ unit[type] }}</view>
        </sy-countdown>
        <view class="title">
            自定义格式（分秒）
        </view>
        <sy-countdown
            v-slot="{type, value}"
            :value="time1"
            format="mmss"
        >
            <view>{{ value }}{{ unit[type] }}</view>
        </sy-countdown>
        <view class="title">
            自定义格式（秒）
        </view>
        <sy-countdown
            v-slot="{type, value}"
            :value="time1"
            format="ss"
        >
            <view>{{ value }}{{ unit[type] }}</view>
        </sy-countdown>
        <view class="title">
            自定义格式（毫秒）
        </view>
        <sy-countdown
            v-slot="{type, value}"
            :value="time1"
            format="SSS"
        >
            <view>{{ value }}{{ unit[type] }}</view>
        </sy-countdown>
    </view>
</template>
<script>
    import dateTools from '@/components/sy-ui/utils/dateTools'
    export default {
        props: {},
        data() {
            var date = dateTools.parse(new Date())
            date.setMonth(date.getMonth() + 1)
            return {
                time1: dateTools.format(date, 'YYYY-MM-DD ' + '00:00:00'),
                unit: { 'Y': '年', 'M': '个月', 'D': '天', 'H': '小时', 'm': '分', 's': '秒', 'S': '毫秒' }
            }
        },
        onLoad(param) {
        },
        onUnload() {
        },
        methods: {
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
