<!--
* @description 安全区域占位块
* @author yxs
!-->
<template>
    <view
        :style="styles_"
        class="sy-safe-area"
    />
</template>
<script>
    import { systemInfo, objectToCss } from '../../utils'

    export default {
        name: 'SySafeAreaInset',
        props: {
            styles: Object,
            position: { type: String, default: 'bottom' }
        },
        data() {
            return {
            }
        },
        computed: {
            styles_() {
                let { safeArea, screenHeight } = systemInfo
                let styles = {
                    ...this.styles,
                    background: '#fff'
                }
                switch (this.position) {
                case 'top':
                    styles.height = `${safeArea.top}px`
                    break
                case 'left':
                    styles.width = `${safeArea.left}px`
                    break
                case 'right':
                    styles.width = `${screenHeight.screenWidth - safeArea.right}px`
                    break
                case 'bottom':
                    styles.height = `${this.safeAreaInsetBottom}px`
                    break
                }
                return objectToCss(styles)
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>

