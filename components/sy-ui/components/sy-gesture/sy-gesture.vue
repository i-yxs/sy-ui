<template>
    <view
        :style="style"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
    >
        <slot />
    </view>
</template>
<script>

    import { jsonToCss } from '@/components/sy-ui/utils'

    export default {
        name: 'SyGesture',
        props: {
            styles: Object
        },
        computed: {
            style() {
                return jsonToCss(this.styles)
            }
        },
        methods: {
            handleTouchStart(res) {
                this.downPointX = res.changedTouches[0].clientX
                this.downPointY = res.changedTouches[0].clientY
                this.downTimestamp = Date.now()
                this.lockDirection = null
            },
            handleTouchMove(res) {
                let moveX = res.touches[0].clientX - this.downPointX
                let moveY = res.touches[0].clientY - this.downPointY
                if (!this.lockDirection) {
                    if (Math.abs(moveX) > Math.abs(moveY)) {
                        this.lockDirection = 'h'
                    } else {
                        this.lockDirection = 'v'
                    }
                }
                this.$emit('drag', {
                    moveX,
                    moveY,
                    direction: this.lockDirection
                })
            },
            handleTouchEnd(res) {
                // 滑动的速度每100ms超过100才触发手势事件
                let speed = 80
                let times = 300
                let pastTime = Date.now() - this.downTimestamp
                switch (this.lockDirection) {
                case 'h':
                    var moveX = res.changedTouches[0].clientX - this.downPointX
                    if (Math.abs(moveX) / (pastTime / times) > speed) {
                        if (moveX > 0) {
                            this.$emit('right')
                        } else {
                            this.$emit('left')
                        }
                    }
                    break
                case 'v':
                    var moveY = res.changedTouches[0].clientY - this.downPointY
                    if (Math.abs(moveY) / (pastTime / times) > speed) {
                        if (moveY > 0) {
                            this.$emit('bottom')
                        } else {
                            this.$emit('top')
                        }
                    }
                    break
                }
            }
        }
    }
</script>

