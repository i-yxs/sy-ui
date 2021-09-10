<!--
* @description 底部操作菜单
* @author yc
!-->
<template>
    <sy-popover
        :visible="visible"
        position="bottom"
        @masktap="handleMasktap"
    >
        <view class="sy-action-sheet">
            <template v-for="(item, index) in optionConfig">
                <view
                    :key="index"
                    :style="item.style"
                    :class="{disabled: item.disabled}"
                    class="item sy-ui-border-top"
                    @tap="handleActive(item, index)"
                >
                    {{ item.text }}
                </view>
            </template>
        </view>
    </sy-popover>
</template>
<script>

    import { jsonToCss } from '@/components/sy-ui/utils'

    export default {
        name: 'SyActionSheet',
        props: {
            options: Array,
            visible: { type: Boolean, default: false },
            // 是否在点击菜单项后关闭
            closeOnClick: { type: Boolean, default: true },
            // 是否在点击遮罩层后关闭
            maskCloseAble: { type: Boolean, default: true }
        },
        data() {
            return {
                optionConfig: []
            }
        },
        watch: {
        },
        mounted() {
            /**
             * 如果在watch中定义，且组件处于v-for中，v-for列表更新时会出现下面的错误，暂时没有找到原因
             * “ Error in callback for watcher "options": "TypeError: Cannot read property 'call' of undefined" ”
             */
            this.$watch('options', this.setOptions, {
                deep: true
            })
            this.setOptions()
        },
        methods: {
            setOptions(options = this.options) {
                if (Array.isArray(options)) {
                    this.optionConfig = options.map(item => {
                        item.style = jsonToCss(item.style)
                        return item
                    })
                }
            },
            handleClose() {
                this.$emit('update:visible', false)
                this.$emit('close')
            },
            handleActive(data, index) {
                if (this.closeOnClick) {
                    this.handleClose()
                }
                this.$emit('click', { data, index })
            },
            // 点击遮罩时触发
            handleMasktap() {
                if (this.maskCloseAble) {
                    this.handleClose()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-action-sheet {
    .item {
        text-align: center;
        position: relative;
        padding: 26rpx;
        font-size: 32rpx;
        line-height: 48rpx;
        color: #333;
        background: #fff;
        &:active {
            background: #f9f9f9;
        }
        &:first-child {
            &::before {
                display: none;
            }
            border-radius: 40rpx 40rpx 0 0;
        }
        &.disabled {
            color: #ccc;
            pointer-events: none;
        }
    }
}
</style>
