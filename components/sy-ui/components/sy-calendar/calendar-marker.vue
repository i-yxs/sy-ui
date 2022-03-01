<!--
* @description 标记点
* @author yc
!-->
<template>
    <view
        :style="styles_"
        class="calendar-marker"
    >
        {{ marker.text || '' }}
    </view>
</template>
<script>

    import { objectToCss } from '../../utils'

    export default {
        name: 'CalendarMarker',
        props: {
            date: [String, Number]
        },
        computed: {
            marker() {
                return this.provideComponent.markers[this.date]
            },
            styles_() {
                return objectToCss(this.marker.styles)
            }
        },
        inject: ['provideComponent']
    }
</script>
<style lang="scss" scoped>
.calendar-marker {
    position: absolute;
}
</style>

