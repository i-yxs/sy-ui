<!--
* @description 地图控件
* @author yxs
!-->
<template>
    <view class="control">
        <view
            v-for="position in positions"
            :key="position.name"
            :class="position.name"
            :style="position.style"
            class="position"
        >
            <view
                v-for="control in position.control"
                :key="control.name"
                class="group"
            >
                <template v-if="control.type === 'group'">
                    <view
                        v-for="button in control.group"
                        :key="button.name"
                        :class="button._class"
                        :style="button._style"
                        class="button sy-ui-border-bottom"
                        @tap="handleControlTab(button)"
                    />
                </template>
                <template v-else>
                    <view
                        :class="control._class"
                        :style="control._style"
                        class="button"
                        @tap="handleControlTab(control)"
                    />
                </template>
            </view>
        </view>
    </view>
</template>
<script>
    // 工具
    import { jsonToCss } from '@/components/sy-ui/utils'

    import defaultControl from './defaultControl'

    export default {
        name: 'Control',
        props: {
            options: Object
        },
        data() {
            return {
                // 控件到地图边缘的距离
                padding: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                },
                // 控件显示方位
                positions: {}
            }
        },
        mounted() {
            this.$watch('options', this.setOptions, {
                deep: true
            })
            this.setOptions()
        },
        methods: {
            /**
             * 设置控件选项
             * 数据结构：
             * {
             *      // 显示的控件列表，当控件名已存在默认控件列表中，会与默认控件合并
             *      control: [Object, ...],
             *      // 控件到地图边缘的距离
             *      padding: Object,
             * }
             */
            setOptions(options = this.options) {
                options = options || {}
                let positions = ['left-top', 'left-bottom', 'right-top', 'right-bottom'].map(name => {
                    return {
                        name,
                        style: '',
                        control: []
                    }
                })
                // 应用控件
                let controls = [...defaultControl]
                if (Array.isArray(options.control)) {
                    options.control.forEach(item => {
                        let index = controls.findIndex(v => v.name === item.name)
                        if (index > -1) {
                            controls[index] = { ...controls[index], ...item }
                        } else {
                            controls.push(item)
                        }
                    })
                }
                controls.filter(control => control.visible !== false).forEach(control => {
                    let position = positions.find(v => v.name === control.position)
                    if (position) {
                        if (control.type === 'group') {
                            control.group.forEach(button => {
                                this.$set(button, 'active', !!button.active)
                                this.updateControl(button)
                            })
                        } else {
                            this.$set(control, 'active', !!control.active)
                            this.updateControl(control)
                        }
                        position.control.push(control)
                    }
                })
                positions.forEach(position => {
                    position.control.sort((a, b) => {
                        return (a.sort || 0) - (b.sort || 0)
                    })
                })
                // 应用padding
                if (!this.isEmpty(options.padding)) {
                    let padding = { ...this.padding, ...options.padding }
                    positions.forEach(position => {
                        switch (position.name) {
                        case 'left-top':
                            position.style = jsonToCss({
                                left: padding.left + 'rpx',
                                top: padding.top + 'rpx'
                            })
                            break
                        case 'left-bottom':
                            position.style = jsonToCss({
                                left: padding.left + 'rpx',
                                bottom: padding.bottom + 'rpx'
                            })
                            break
                        case 'right-top':
                            position.style = jsonToCss({
                                right: padding.right + 'rpx',
                                top: padding.top + 'rpx'
                            })
                            break
                        case 'right-bottom':
                            position.style = jsonToCss({
                                right: padding.right + 'rpx',
                                bottom: padding.bottom + 'rpx'
                            })
                            break
                        }
                    })
                    this.padding = padding
                }
                this.positions = positions
            },
            // 更新控件
            updateControl(control) {
                if (!this.isEmpty(control.activeIcon)) {
                    control._class = control.active ? control.activeIcon : control.icon
                } else {
                    control._class = control.icon || ''
                }
                let style = control.style || {}
                if (!this.isEmpty(control.activeColor)) {
                    style.color = control.active ? control.activeColor : style.color
                }
                control._style = jsonToCss(style)
            },
            // 点击控件时触发
            handleControlTab(control) {
                control.active = !control.active
                this.updateControl(control)
                this.$emit('controltap', control)
            }
        }
    }
</script>
<style lang="scss" scoped>
.control{
    .position {
        position: absolute;
        z-index: 2;
        &.left-top {
            top: 0;
            left: 0;
            margin: 30rpx 0 0 30rpx;
            .group {
                margin-bottom: 30rpx;
            }
        }
        &.left-bottom {
            left: 0;
            bottom: 0;
            margin: 0 0 30rpx 30rpx;
            .group {
                margin-top: 30rpx;
            }
        }
        &.right-top {
            top: 0;
            right: 0;
            margin: 30rpx 30rpx 0 0;
            .group {
                margin-bottom: 30rpx;
            }
        }
        &.right-bottom {
            right: 0;
            bottom: 0;
            margin: 0 30rpx 30rpx 0;
            .group {
                margin-top: 30rpx;
            }
        }
        .group {
            border-radius: 36rpx;
            box-shadow: 0 0 16rpx 0rpx rgba(59, 59, 59, 0.24);
            .button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 72rpx;
                height: 72rpx;
                font-size: 42rpx;
                background: #fff;
                &:active{
                    background: #f9f9f9;
                }
                &:first-child{
                    border-radius: 50% 50% 0 0;
                    &:last-child {
                        border-radius: 50%;
                    }
                }
                &:last-child{
                    border-radius: 0 0 50% 50%;
                    &::after {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>

