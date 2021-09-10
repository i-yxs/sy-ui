<!--
* @description 过渡动画组件，需要提供当前显示的slot内容1，及待显示的slot内容2，
               value为true时，开始播放动画，内容1按指定的动画隐藏，内容2出现，
               播放完成时，组件会发出完成事件，父组件需要设置value为false，同时组件内部会还原到原始状态，
               同时父组件需要把内容1替换成内容2
* @author yxs
!-->
<template>
    <view :style="{width: width, height: height}" class="sy-transition">
        <view :class="value ? [type, 'ing'] : ''" class="standby">
            <slot name="standby" />
        </view>
        <view :class="value ? [type, 'ing'] : ''" class="current">
            <slot name="current" />
        </view>
    </view>
</template>
<script>
    /**
     * type 动画类型
     * @param 'slide-top' 内容2紧随内容1向上移动
     * @param 'slide-left' 内容2紧随内容1向左移动
     * @param 'slide-right' 内容2紧随内容1向右移动
     * @param 'slide-bottom' 内容2紧随内容1向下移动
     */
    export default {
        name: 'SyTransition',
        props: {
            // 是否开始播放
            value: { type: Boolean, default: false },
            // 动画类型
            type: String,
            // 宽度
            width: String,
            // 高度
            height: String
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    if (value) {
                        setTimeout(() => {
                            this.$emit('end')
                            this.$nextTick(() => {
                                this.$emit('input', false)
                            })
                        }, 300)
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
$transition: transform 300ms ease-in-out;
.sy-transition{
    position: relative;
    .current{
        position: relative;
        height: 100%;
        &.ing {
            pointer-events: none;
        }
        &.slide-top {
            transform: translateY(-100%);
            transition: $transition;
        }
        &.slide-left {
            transform: translateX(-100%);
            transition: $transition;
        }
        &.slide-right {
            transform: translateX(100%);
            transition: $transition;
        }
        &.slide-bottom {
            transform: translateY(100%);
            transition: $transition;
        }
    }
    .standby{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
        &.ing {
            opacity: 1;
        }
        &.slide-top {
            top: 100%;
            transform: translateY(-100%);
            transition: $transition;
        }
        &.slide-left {
            left: 100%;
            transform: translateX(-100%);
            transition: $transition;
        }
        &.slide-right {
            left: -100%;
            transform: translateX(100%);
            transition: $transition;
        }
        &.slide-bottom {
            top: -100%;
            transform: translateY(100%);
            transition: $transition;
        }
    }
}
</style>
