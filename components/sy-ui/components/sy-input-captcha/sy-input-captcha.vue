<!--
* @description 带获取验证码的输入框
* @author yxs
!-->
<template>
    <view class="input-captcha">
        <sy-input
            :props="inputProps"
            @input="$emit('input', $event)"
        >
            <template v-if="!__props.readonly" slot="append">
                <view
                    :class="{cooling: __props.cooling}"
                    class="button"
                    @click="handleButtonActive"
                >
                    {{ __props.cooling ? `${remainDuration}秒后重新获取` : '获取验证码' }}
                </view>
            </template>
        </sy-input>
    </view>
</template>
<script>

    import props from './props'
    import mixinProps, { assignProps } from '../../mixin/props'

    export default {
        name: 'SyInputCaptcha',
        mixins: [mixinProps],
        props,
        data() {
            return {
                remainDuration: 0
            }
        },
        computed: {
            inputProps() {
                return assignProps('SyInput', {
                    ...this.__props,
                    suffixIcon: this.suffixIconName
                })
            },
            suffixIconName() {
                return this.__props.loading ? 'sy-ui-icon-loading' : this.__props.suffixIcon
            }
        },
        watch: {
            '__props.cooling': {
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
                let timer = setInterval(loop, 1000)
                let loop = () => {
                    this.remainDuration--
                    if (this.remainDuration <= 0) {
                        clearInterval(timer)
                        this.$emit('cooled')
                    }
                }
                this.remainDuration = Number(this.__props.duration)
            },
            // 点击按钮时触发
            handleButtonActive() {
                if (!this.__props.cooling) {
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
