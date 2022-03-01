<!--
* @description 弹出框
* @author yxs
!-->
<template>
    <view
        v-if="!destroy"
        :style="styles_"
        :data-status="visible ? 'show' : 'hide'"
        class="sy-popover"
    >
        <view :style="{background: maskColor}" class="mask-wrap" @click="$emit('masktap')" />
        <view
            :class="position"
            :style="_bodyStyles"
            class="mask-body"
            @animationend="handleAnimationend"
        >
            <slot/>
        </view>
    </view>
</template>
<script>
    import { objectToCss } from '../../utils'

    export default {
        name: 'SyPopover',
        props: {
            value: Boolean, // 组件销毁状态
            visible: Boolean, // 可见状态
            styles: Object, // 自定义样式
            bodyStyles: Object, // 内容容器样式
            position: { type: String, default: 'top' }, // 显示方位
            maskColor: { type: String, default: 'rgba(0,0,0,.6)' } // 蒙层颜色
        },
        data() {
            return {
                destroy: true,
                animationTimer: null
            }
        },
        computed: {
            styles_() {
                let styles = {
                    zIndex: '99',
                    ...this.styles
                }
                // #ifdef H5
                styles.top = `calc(${styles.top || '0px'} + var(--window-top))`
                // #endif
                // #ifndef H5
                styles.top = styles.top
                // #endif
                return objectToCss(styles)
            },
            _bodyStyles() {
                return objectToCss(this.bodyStyles)
            }
        },
        watch: {
            value() {
                this.destroy = !this.value
            },
            visible() {
                this.updateVisible()
            }
        },
        mounted() {
            if (this.visible) {
                this.updateVisible()
            }
        },
        methods: {
            updateVisible() {
                if (this.visible) {
                    this.$emit('input', true)
                }
                this.destroy = false
                this.$nextTick(this.updateNativeVisible)
            },
            /**
             * 更新原生组件的显示状态
             * 因为部分原生组件无法同屏渲染or事件会穿透普通元素，所以这里我们在SyPopover组件显示状态改变时同时改变部分原生组件的显示状态
             */
            updateNativeVisible() {
                let components = this.getComponents(['SyInput', 'SyTextarea'])
                if (this.visible) {
                    // 当SyPopover组件显示时，隐藏第一个父SyPopover组件下的所有指定组件
                    components.forEach(item => {
                        if (item.popoverHiddenAfterDisplay) item.visible = false
                    })
                } else {
                    // 当SyPopover组件隐藏时，显示第一个父SyPopover组件下的所有指定组件
                    components.forEach(item => {
                        item.visible = true
                    })
                }
            },
            // 获取该组件下的所有指定子组件
            getChildren(name = []) {
                let list = []
                let recursion = (children) => {
                    if (children && children.length) {
                        children.forEach(node => {
                            if (name.includes(node.$options.name)) {
                                list.push(node)
                            }
                            recursion(node.$children)
                        })
                    }
                }
                recursion(this.$children)
                return list
            },
            // 获取该组件第一个父SyPopover组件下的所有指定组件
            getComponents(name = []) {
                let root = this
                while (root.$parent) {
                    root = root.$parent
                    if (['SyPopover'].includes(root.$options.name)) {
                        break
                    }
                }
                let list = []
                let recursion = (node) => {
                    if (node !== this) {
                        if (name.includes(node.$options.name)) {
                            list.push(node)
                        }
                        if (node.$children && node.$children.length) {
                            node.$children.forEach(item => {
                                recursion(item)
                            })
                        }
                    }
                }
                recursion(root)
                return list
            },
            // 动画播放结束时触发
            handleAnimationend() {
                if (!this.visible) {
                    this.destroy = true
                    this.$emit('input', false)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-popover {
    position: fixed;
    left: 0;
    right: 0;
    // #ifdef H5
    top: var(--window-top);
    bottom: var(--window-bottom);
    // #endif
    // #ifndef H5
    top: 0;
    bottom: 0;
    // #endif
    overflow: hidden;
    .mask-wrap {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .mask-body {
        position: absolute;
        &.top {
            left: 0;
            top: 0;
            right: 0;
        }
        &.bottom {
            left: 0;
            bottom: 0;
            right: 0;
        }
        &.left {
            left: 0;
            top: 0;
            bottom: 0;
        }
        &.right {
            right: 0;
            top: 0;
            bottom: 0;
        }
        &.center {
            top: 50%;
            left: 50%;
        }
    }
    &[data-status=show] {
        .mask-wrap {
            animation: fade-in .2s ease-in-out both;
        }
        .mask-body{
            &.top {
                animation: top-in .2s ease-in-out;
            }
            &.bottom {
                animation: bottom-in .2s ease-in-out;
            }
            &.left {
                animation: left-in .2s ease-in-out;
            }
            &.right {
                animation: right-in .2s ease-in-out;
            }
            &.center {
                animation: center-in .2s cubic-bezier(0, 0, 0, 1.5) both;
            }
        }
    }
    &[data-status=hide] {
        .mask-wrap {
            animation: fade-out .2s ease-in-out both;
        }
        .mask-body {
            pointer-events: none;
            &.top {
                animation: top-out .2s ease-in-out both;
            }
            &.bottom {
                animation: bottom-out .2s ease-in-out both;
            }
            &.left {
                animation: left-out .2s ease-in-out both;
            }
            &.right {
                animation: right-out .2s ease-in-out both;
            }
            &.center {
                animation: center-out .2s cubic-bezier(0, 0, 0.5, -1) both;
            }
        }
    }
    @keyframes fade-in {
        0% { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fade-out {
        0% { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes top-in {
        0% { transform: translateY(-100%); }
        to { transform: translateY(0); }
    }
    @keyframes top-out {
        0% { transform: translateY(0); }
        to { transform: translateY(-100%); }
    }
    @keyframes bottom-in {
        0% { transform: translateY(100%); }
        to { transform: translateY(0); }
    }
    @keyframes bottom-out {
        0% { transform: translateY(0); }
        to { transform: translateY(100%); }
    }
    @keyframes left-in {
        0% { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
    @keyframes left-out {
        0% { transform: translateX(0); }
        to { transform: translateX(-100%); }
    }
    @keyframes right-in {
        0% { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    @keyframes right-out {
        0% { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    @keyframes center-in {
        0% { transform: translate3d(-50%, -50%, 0) scale3d(0.6, 0.6, 1); opacity: 0; }
        to { transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1); opacity: 1; }
    }
    @keyframes center-out {
        0% { transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1); opacity: 1; }
        to { transform: translate3d(-50%, -50%, 0) scale3d(0.6, 0.6, 1); opacity: 0; }
    }
}
</style>

