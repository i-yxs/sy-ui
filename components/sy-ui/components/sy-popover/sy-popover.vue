<!--
* @description 弹出框
* @author yxs
!-->
<template>
    <view
        v-if="isVisible"
        :data-show="visible ? 1 : 0"
        :style="{
            top: fixTop,
            left: left,
            right: right,
            bottom: bottom,
            zIndex: zIndex
        }"
        class="sy-popover"
    >
        <view :style="{background: maskColor}" class="mask-wrap" @click="$emit('masktap')" />
        <view
            :class="position"
            :style="bodyStyle"
            class="mask-body"
        >
            <slot/>
        </view>
    </view>
</template>
<script>
    import { isAndroid, isDevtools, jsonToCss } from '@/components/sy-ui/utils'

    export default {
        name: 'SyPopover',
        components: {},
        props: {
            top: String,
            left: String,
            right: String,
            bottom: String,
            zIndex: { default: '99' },
            // 内容容器样式
            styles: Object,
            // 可见状态
            visible: { type: Boolean, default: false },
            // 蒙层颜色
            maskColor: { type: String, default: 'rgba(0,0,0,.6)' },
            // 显示方位
            position: { type: String, default: 'top' }
        },
        data() {
            return {
                isVisible: false,
                animationTimer: null
            }
        },
        computed: {
            fixTop() {
                // #ifdef H5
                return `calc(${this.top || '0px'} + var(--window-top))`
                // #endif
                return this.top
            },
            bodyStyle() {
                return jsonToCss(this.styles)
            }
        },
        watch: {
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
                    this.isVisible = true
                    this.$emit('update', this.isVisible)
                } else {
                    clearTimeout(this.animationTimer)
                    this.animationTimer = setTimeout(() => {
                        this.isVisible = false
                        this.$emit('update', this.isVisible)
                    }, 200)
                }
                setTimeout(() => {
                    this.updateNativeVisible()
                })
            },
            // 更新SyTextarea组件的显示状态
            // 因为textarea在部分安卓手机上无法同屏渲染，层级高于view，所以需要在SyPopover组件显示状态改变时同时改变SyTextarea组件的显示状态
            updateNativeVisible() {
                if (isAndroid || isDevtools) {
                    var components = this.getComponents()
                    if (this.visible) {
                        // 当SyPopover组件显示时，隐藏第一个父SyPopover组件下的所有SyTextarea组件
                        components.forEach(item => {
                            item.visible = false
                        })
                    } else {
                        // 当SyPopover组件隐藏时，显示第一个父SyPopover组件下的所有SyTextarea组件
                        components.forEach(item => {
                            item.visible = true
                        })
                    }
                }
            },
            // 获取当前组件的第一个父SyPopover组件下的所有SyTextarea组件
            getComponents() {
                var root = this
                while (root.$parent) {
                    root = root.$parent
                    if (['SyPopover'].includes(root.$options.name)) {
                        break
                    }
                }
                var list = []
                var recursion = (node) => {
                    if (node !== this) {
                        if (['SyTextarea'].includes(node.$options.name)) {
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
    &[data-show='1'] {
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
    &[data-show='0'] {
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

