<!--
* @description 步骤条
* @author yxs
!-->
<template>
    <view :class="[vertical ? 'vertical' : 'horizontal', alignCenter ? 'align-center' : 'align-left']" class="sy-steps">
        <view :style="stepLineStyle" class="step-line" />
        <view class="step-wrap">
            <view
                v-for="(step, idx) in options"
                :key="idx"
                class="step-item"
                @click="hanldeActiveChange(idx)"
            >
                <view class="step-head">
                    <view
                        v-if="step.icon"
                        :class="[{active: idx <= value}, step.icon]"
                        class="step-icon"
                    />
                    <view
                        v-else
                        :class="{active: idx <= value}"
                        class="step-icon default"
                    />
                    <view v-if="!step.icon" class="step-text">
                        {{ idx + 1 }}
                    </view>
                </view>
                <view class="step-body">
                    <view v-if="step.title" class="step-title">
                        {{ step.title }}
                    </view>
                    <view v-if="step.content" class="step-content">
                        {{ step.content }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>

    import styleVars from '@/uni.scss'

    export default {
        name: 'SySteps',
        props: {
            // 当前步骤
            value: {
                type: Number,
                default: 0
            },
            /**
             * 数据源
             * @param title 标题
             * @param content 描述性文字
             * @param icon 图标
             */
            options: {
                default: null
            },
            // 是否居中对齐
            alignCenter: {
                type: Boolean,
                default: false
            },
            // 选中状态的颜色
            activeColor: {
                type: String,
                default: styleVars.APP_COLOR
            },
            // 是否垂直排列方向
            vertical: {
                type: Boolean,
                default: false
            },
            // 是否可以点击切换步骤
            clickChange: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            stepLineStyle() {
                const style = []
                const length = this.options.length
                const width = 100 / length
                const center = width - width / 2
                const position = Math.min(this.value, length - 1) / (length - 1) * 100
                if (this.vertical) {
                    // 垂直方向
                    style.push(
                        'left: 24rpx',
                        'width: 6rpx',
                        `background: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, ${styleVars.APP_COLOR} ${position}%, rgba(255, 255, 255, 0) 100%)`
                    )
                    if (this.alignCenter) {
                        style.push(`top: ${center}%`, `bottom: ${center}%`)
                    } else {
                        style.push('top: 24rpx', `bottom: calc(${100 / length}% - 24rpx)`)
                    }
                } else {
                    // 水平方向
                    style.push(
                        'top: 24rpx',
                        'height: 6rpx',
                        `background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${styleVars.APP_COLOR} ${position}%, rgba(255, 255, 255, 0) 100%)`
                    )
                    if (this.alignCenter) {
                        style.push(`left: ${center}%`, `right: ${center}%`)
                    } else {
                        style.push('left: 24rpx', 'right: 24rpx')
                    }
                }
                return style.join(';')
            }
        },
        methods: {
            hanldeActiveChange(idx) {
                if (this.clickChange) {
                    this.$emit('input', idx)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>

.sy-steps{
    position: relative;
    .step-wrap{
        display: flex;
    }
    .step-item{
        position: relative;
        z-index: 2;
        display: flex;
        flex: 1;
        .step-head{
            position: relative;
            width: 54rpx;
            height: 54rpx;
        }
        .step-icon{
            width: inherit;
            height: inherit;
            font-size: 54rpx;
            &.default{
                background: #999;
                border-radius: 50%;
            }
            &.active{
                background: $APP_BACKGROUND;
            }
        }
        .step-text{
            position: absolute;
            top: 0;
            left: 0;
            width: inherit;
            height: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #fff;
        }
        .step-body{
            flex: 1;
            color: #999;
        }
        .step-title{
            font-size: 28rpx;
        }
        .step-content{
            font-size: 24rpx;
        }
    }
    .step-line{
        position: absolute;
        border-radius: 3rpx;
    }
    // 水平方向
    &.horizontal{
        .step-item{
            align-items: center;
            flex-direction: column;
            text-align: center;
            & + .step-item{
                margin-left: 30rpx;
            }
        }
        .step-body{
            margin-top: 10rpx;
        }
        &.align-left{
            .step-item{
                &:first-child{
                    text-align: left;
                    align-items: flex-start;
                }
                &:last-child{
                    text-align: right;
                    align-items: flex-end;
                }
            }
        }
        .step-content{
            margin-top: 4rpx;
        }
    }
    // 垂直方向
    &.vertical{
        .step-wrap{
            flex-direction: column;
        }
        .step-item{
            margin-top: 10px;
            &:first-child{
                margin-top: 0;
            }
        }
        .step-body{
            margin-left: 20rpx;
        }
        .step-title{
            line-height: 54rpx;
        }
        &.align-center{
            .step-item{
                align-items: center;
            }
        }
    }
}
</style>

