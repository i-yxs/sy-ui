<template>
    <view class="content">
        <view class="title">
            基础输入框
        </view>
        <sy-input
            v-model="keyword"
            clearable
            placeholder="输入关键词名称搜索"
        />
        <view class="title">
            获取验证码
        </view>
        <sy-input-captcha
            v-model="captcha"
            :cooling="cooling"
            duration="10"
            maxlength="4"
            clearable
            placeholder="输入验证码"
            @active="handleCaptchaActive"
            @cooled="handleCaptchaCooled"
        />
        <view class="title">
            禁用状态
        </view>
        <sy-input
            v-model="keyword"
            disabled
            placeholder="输入关键词名称搜索"
        />
        <view class="title">
            自定义高度
        </view>
        <sy-input
            v-model="keyword"
            disabled
            height="100rpx"
            placeholder="输入关键词名称搜索"
        />
        <view class="title">
            带图标的输入框
        </view>
        <sy-input
            v-model="keyword"
            prefix-icon="sy-ui-icon-search"
            suffix-icon="sy-ui-icon-arrow-right"
            placeholder="输入关键词名称搜索"
        />
        <view class="title">
            自定义slot的输入框
        </view>
        <sy-input
            v-model="keyword"
            placeholder="输入关键词名称搜索"
        >
            <view slot="prepend">
                prepend
            </view>
            <view slot="append">
                append
            </view>
        </sy-input>
        <view class="title">
            密码输入框
        </view>
        <sy-input
            v-model="keyword"
            password
            show-password
            placeholder="输入密码"
        />
        <view class="title">
            带统计数量的输入框
        </view>
        <sy-input
            v-model="keyword"
            maxlength="10"
            show-word-limit
            placeholder="输入关键词名称搜索"
        />
        <view class="title">
            多行输入框
        </view>
        <sy-textarea
            v-model="keyword"
            maxlength="200"
            show-word-limit
            placeholder="输入关键词名称搜索"
        />
        <view class="title">
            自动高度
        </view>
        <sy-textarea
            v-model="keyword"
            auto-height
            maxlength="200"
            show-word-limit
            placeholder="输入关键词名称搜索"
        />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                keyword: '',
                captcha: '',
                cooling: false
            }
        },
        methods: {
            handleCaptchaActive() {
                this.cooling = true
                console.log('调用发送验证码接口...')
            },
            handleCaptchaCooled() {
                this.cooling = false
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
    .fixed-tool {
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background: #fff;
        padding: 20rpx 30rpx;
    }
}
</style>
