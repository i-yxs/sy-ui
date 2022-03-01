<!--
* @description 圆环进度条
* @author yxs
!-->
<template>
    <view :style="{width: size, height: size}" class="sy-circular">
        <view :style="{transform: `rotateZ(${startAngle}deg) scaleX(${mirror ? -1 : 1})`}" class="main">
            <view :class="{visible: rotate}" class="round">
                <view :style="{width: width, height: width, background: color}" />
            </view>
            <view :class="{visible: rotate}" :style="{transform: `rotateZ(${rotate}deg)`}" class="round">
                <view :style="{width: width, height: width, background: color}" />
            </view>
            <view class="left">
                <view class="wrap">
                    <view :style="leftStyle" class="line" />
                </view>
            </view>
            <view class="right">
                <view class="wrap">
                    <view :style="rightStyle" class="line" />
                </view>
            </view>
        </view>
        <view :style="{top: width, left: width, right: width, bottom: width, background: fillColor}" class="middle">
            <slot />
        </view>
    </view>
</template>
<script>
    import StyleVars from '@/uni.scss'

    export default {
        name: 'SyCircular',
        props: {
            value: { type: Number, default: 0 },
            maxValue: { type: [String, Number], default: 1 },
            // 圆环的尺寸
            size: { type: String, default: '100%' },
            // 圆环的环宽度
            width: { type: String, default: '10rpx' },
            // 圆环的颜色
            color: { type: String, default: StyleVars.APP_COLOR },
            // 圆环的背景颜色
            backColor: { type: String, default: '#e4e4e4' },
            // 圆环的填充颜色
            fillColor: { type: String, default: '#fff' },
            // 开始角度
            startAngle: { type: Number, default: 0 },
            // 结束角度
            endAngle: { type: Number },
            // 镜像角度
            mirror: Boolean
        },
        data() {
            return {
                rotate: 0
            }
        },
        computed: {
            leftStyle() {
                return `
                    width: ${this.size}; 
                    height: ${this.size}; 
                    border-color: ${this.color} ${this.color} ${this.backColor} ${this.backColor}; 
                    border-width: ${this.width}; 
                    transform: rotateZ(${Math.max(Math.min(this.rotate - 180, 180), 0)}deg)
                `
            },
            rightStyle() {
                return `
                    width: ${this.size}; 
                    height: ${this.size}; 
                    border-color: ${this.backColor} ${this.backColor} ${this.color} ${this.color}; 
                    border-width: ${this.width}; 
                    transform: rotateZ(${Math.max(Math.min(this.rotate, 180), 0)}deg)
                `
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.updatePercent()
                }
            }
        },
        methods: {
            updatePercent() {
                var angle = 360
                if (this.endAngle) {
                    if (this.endAngle > this.startAngle) {
                        angle = this.startAngle - this.endAngle
                    } else {
                        angle = 360 - this.startAngle + this.endAngle
                    }
                }
                this.rotate = (this.value / this.maxValue) * angle
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-circular {
    position: relative;
    overflow: hidden;
    .main {
        display: flex;
        position: relative;
    }
    .left,
    .right {
        width: 50%;
        overflow: hidden;
        .wrap {
            width: 100%;
            height: 100%;
            transform: rotateZ(45deg);
        }
        .line {
            width: 100%;
            height: 100%;
            border-style: solid;
            border-color: transparent;
            box-sizing: border-box;
            border-radius: 50%;
        }
    }
    .left {
        .wrap {
            transform-origin: 100% 50%;
        }
    }
    .right {
        .wrap {
            transform-origin: 0 50%;
        }
        .line {
            margin-left: -100%;
        }
    }
    .middle {
        position: absolute;
        background: #fff;
        border-radius: 50%;
        z-index: 2;
    }
    .round {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        opacity: 0;
        &.visible{
            opacity: 1;
        }
        view {
            position: absolute;
            border-radius: 50%;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            transform-origin: 50% 50%;
        }
    }
}
</style>

