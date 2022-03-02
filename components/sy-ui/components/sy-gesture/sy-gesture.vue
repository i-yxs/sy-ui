<template>
    <view
        :style="styles_"
        class="sy-gesture"
        @touchstart="handleStart"
        @touchend="handleEnd"
        @touchmove.prevent
    >
        <slot/>
    </view>
</template>
<script>
    // 工具
    import { objectToCss } from '../../utils'

    export default {
        name: 'SyGesture',
        props: {
            /**
             * 锁定轴线
             * h：水平
             * v：垂直
             */
            axis: String,
            styles: Object // 自定义样式
        },
        computed: {
            styles_() {
                return objectToCss(this.styles)
            }
        },
        methods: {
            handleStart(res) {
                let touche = res.changedTouches[0]
                this.touche = {
                    clientX: touche.clientX,
                    clientY: touche.clientY,
                    timestamp: Date.now()
                }
            },
            handleEnd(res) {
                if (this.touche) {
                    let { clientX: x1, clientY: y1, timestamp } = this.touche
                    let { clientX: x2, clientY: y2 } = res.changedTouches[0]
                    // 滑动的速度每 times 毫秒超过 speed 才触发手势事件
                    let speed = 50
                    let times = 300
                    let pastTime = Date.now() - timestamp
                    let direction = ''
                    let moveX = x2 - x1
                    let moveY = y2 - y1
                    if (this.isEmpty(this.axis)) {
                        // 计算手指分开的点相对于按下的点之间的夹角，用于判断这次滑动的方向
                        let angle = (Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI + 360) % 360
                        if (angle > 45 && angle < 135) {
                            direction = 'top'
                        } else if (angle > 225 && angle < 315) {
                            direction = 'bottom'
                        } else if (angle > 135 && angle < 225) {
                            direction = 'right'
                        } else if (angle > 0 && angle < 45 || angle > 315 && angle < 360) {
                            direction = 'left'
                        }
                        switch (direction) {
                        case 'left':
                        case 'right':
                            if (Math.abs(moveX) / (pastTime / times) > speed) {
                                this.$emit('change', direction)
                            }
                            break
                        case 'top':
                        case 'bottom':
                            if (Math.abs(moveY) / (pastTime / times) > speed) {
                                this.$emit('change', direction)
                            }
                            break
                        }
                    } else {
                        switch (this.axis) {
                        case 'h':
                            if (Math.abs(moveX) / (pastTime / times) > speed) {
                                this.$emit('change', moveX > 0 ? 'right' : 'left')
                            }
                            break
                        case 'v':
                            if (Math.abs(moveY) / (pastTime / times) > speed) {
                                this.$emit('change', moveY > 0 ? 'bottom' : 'top')
                            }
                            break
                        }
                    }
                    this.touche = null
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-gesture {
    width: 100%;
    height: 100%;
}
</style>
