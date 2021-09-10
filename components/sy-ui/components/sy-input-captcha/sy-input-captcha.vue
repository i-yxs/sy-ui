<!--
* @description 带获取验证码的输入框
* @author yxs
!-->
<template>
    <view class="input-captcha">
        <sy-input
            :type="type"
            :value="value"
            :height="height"
            :loading="loading"
            :readonly="readonly"
            :disabled="disabled"
            :clearable="clearable"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :icon-size="iconSize"
            :icon-color="iconColor"
            :prefix-icon="prefixIcon"
            @input="$emit('input', $event)"
        >
            <view
                v-if="!readonly"
                slot="append"
                :class="{cooling: cooling}"
                class="button"
                @click="handleButtonActive"
            >
                {{ cooling ? `${remainDuration}秒后重新获取` : '获取验证码' }}
            </view>
        </sy-input>
    </view>
</template>
<script>

    export default {
        name: 'SyInputCaptcha',
        props: {
            // 是否冷却中，冷却中按钮文本变更为倒计时
            cooling: { type: Boolean, default: false },
            // 是否加载中
            loading: { type: Boolean, default: false },
            // 冷却时间，单位秒
            duration: { default: 60 },
            type: null,
            value: null,
            height: null,
            iconSize: null,
            readonly: null,
            disabled: null,
            iconColor: null,
            clearable: null,
            maxlength: null,
            prefixIcon: null,
            placeholder: null
        },
        data() {
            return {
                remainDuration: 0
            }
        },
        watch: {
            cooling: {
                immediate: true,
                handler(cooling) {
                    if (cooling) {
                        this.updateDuration()
                    }
                }
            }
        },
        methods: {
            // 更新冷却时间
            updateDuration() {
                let timer
                this.remainDuration = Number(this.duration)
                const loop = () => {
                    this.remainDuration--
                    if (this.remainDuration <= 0) {
                        clearInterval(timer)
                        this.$emit('cooled')
                    }
                }
                timer = setInterval(loop, 1000)
            },
            // 点击按钮时触发
            handleButtonActive() {
                if (!this.cooling) {
                    this.$emit('active')
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.input-captcha{
    .button {
        display: flex;
        align-items: center;
        justify-items: center;
        height: 100%;
        min-width: 130rpx;
        color: $APP_COLOR;
        font-weight: bold;
        margin-left: 12rpx;
        &.cooling{
            color: #999;
            font-weight: initial;
        }
    }
}

</style>
