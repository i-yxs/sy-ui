<!--
* @description 日历标记点
* @author 易超
!-->
<template>
    <view
        v-if="config"
        class="calendar-marker"
        :style="markerStyle"
    >
        {{ config.text || '' }}
    </view>
</template>
<script>
    export default {
        name: 'CalendarMarker',
        components: {
        },
        props: {
            // 配置
            config: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
            }
        },
        computed: {
            markerStyle() {
                return `
                    top:${this.config.top};
                    left:${this.config.left};
                    right:${this.config.right};
                    bottom:${this.config.bottom};
                    width:${this.config.width};
                    height:${this.config.height};
                    line-height:${this.config.height};
                    color:${this.config.color};
                    font-size:${this.config.size};
                    background:${this.config.background};
                `
            }
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
.calendar-marker {
    position: absolute;
    text-align: center;
    border-radius: 50%;
    transform: translate3d(-50%, -50%, 0);
}
</style>

