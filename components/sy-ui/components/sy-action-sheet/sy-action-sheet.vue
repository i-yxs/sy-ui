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
            <template v-for="(item, index) in options_">
                <view
                    :key="index"
                    :style="item.styles_"
                    :class="{disabled: item.disabled}"
                    class="item sy-ui-border-top"
                    @click="handleActive(item, index)"
                >
                    {{ item.text }}
                </view>
            </template>
            <sy-safe-area-inset />
        </view>
    </sy-popover>
</template>
<script>

    import { objectToCss } from '../../utils'

    export default {
        name: 'SyActionSheet',
        props: {
            options: Array,
            visible: Boolean,
            // 是否在点击遮罩层后关闭
            closeOnMask: { type: Boolean, default: true },
            // 是否在点击菜单项后关闭
            closeOnClick: { type: Boolean, default: true }
        },
        computed: {
            options_() {
                if (Array.isArray(this.options)) {
                    let options = JSON.parse(JSON.stringify(this.options))
                    return options.map(item => {
                        item.styles_ = objectToCss(item.styles)
                        return item
                    })
                }
                return []
            }
        },
        methods: {
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
                if (this.closeOnMask) {
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
