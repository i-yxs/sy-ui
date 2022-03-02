<template>
    <view :style="styles_" class="sy-gesture-swiper">
        <sy-gesture :axis="axis" @change="handleGestureChange">
            <view
                v-for="(item, index) in types"
                :key="index"
                :class="[item.type, playing ? direction: '']"
            >
                <slot :type="item.type" />
            </view>
            <view v-show="playing" class="mask"/>
        </sy-gesture>
    </view>
</template>
<script>
    // 工具
    import { objectToCss } from '../../utils'

    export default {
        name: 'SyGestureSwiper',
        props: {
            axis: { type: String, default: 'h' }, // 轴方向 h：水平方向 v：垂直方向
            styles: Object // 自定义样式
        },
        data() {
            return {
                types: [
                    { type: 'enter' },
                    { type: 'leave' }
                ],
                playing: false,
                direction: ''
            }
        },
        computed: {
            styles_() {
                return objectToCss()
            }
        },
        methods: {
            play(direction) {
                let type = [this.types[0].type, this.types[1].type]
                this.types[0].type = type[1]
                this.types[1].type = type[0]
                this.playing = true
                this.direction = direction
                setTimeout(() => {
                    this.playing = false
                }, 300)
            },
            handleGestureChange(direction) {
                if (this.playing) return
                this.$emit('change', direction)
            }
        }
    }
</script>
<style lang="scss" scoped>

$transition: transform 300ms ease-in-out;

.sy-gesture-swiper{
    position: relative;
    overflow: hidden;
    sy-gesture {
        width: 100%;
        height: 100%;
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }
    .enter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        &.top,
        &.left,
        &.right,
        &.bottom {
            transition: $transition;
        }
        &.top {
            top: 100%;
            transform: translateY(-100%);
        }
        &.left {
            left: 100%;
            transform: translateX(-100%);
        }
        &.right {
            left: -100%;
            transform: translateX(100%);
        }
        &.bottom {
            top: -100%;
            transform: translateY(100%);
        }
    }
    .leave{
        position: relative;
        height: 100%;
        opacity: 0;
        &.top,
        &.left,
        &.right,
        &.bottom {
            opacity: 1;
            transition: $transition;
        }
        &.top {
            transform: translateY(-100%);
        }
        &.left {
            transform: translateX(-100%);
        }
        &.right {
            transform: translateX(100%);
        }
        &.bottom {
            transform: translateY(100%);
        }
    }
}
</style>

