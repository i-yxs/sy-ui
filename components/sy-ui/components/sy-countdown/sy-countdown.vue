<!--
* @description 倒计时
* @author yxs
!-->
<template>
    <view v-if="visible" class="sy-countdown">
        <block v-for="(item, type) in apartDate" :key="type">
            <slot :type="type" :value="item" />
        </block>
    </view>
</template>
<script>
    // 方法
    import dateTools from '../../utils/dateTools'

    export default {
        name: 'SyCountdown',
        props: {
            value: { type: [Number, String], default: '' },
            // 倒计时格式（D天H时m分s秒S毫秒）
            format: { type: String, default: '{D天}HH时mm分ss秒SSS' },
            // 倒计时结束时是否隐藏组件
            overHide: Boolean
        },
        data() {
            return {
                overTime: null,
                apartDate: null
            }
        },
        computed: {
            visible() {
                if (this.overHide && (!this.overTime || !this.apartDate)) {
                    return false
                }
                return true
            },
            // 是否显示毫秒
            milliscond() {
                return this.format.indexOf('S') > -1
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    this.updateStartTime()
                }
            }
        },
        beforeDestroy() {
            this.stop()
        },
        methods: {
            // 开始倒计时
            start() {
                this.timer = setInterval(this.update, this.milliscond ? 33 : 1000)
                this.update()
            },
            // 停止倒计时
            stop() {
                this.overTime = null
                clearInterval(this.timer)
            },
            // 更新倒计时
            update() {
                var nowTime = new Date()
                var overTime = this.overTime
                if (nowTime > overTime) {
                    this.stop()
                    this.$emit('over')
                    // 倒计时结束隐藏组件，则不进行初始化
                    if (this.overHide) {
                        return
                    }
                }
                var apart = dateTools.apart(overTime, this.format, nowTime)
                if (apart) {
                    this.apartDate = apart.data
                }
            },
            // 更新开始时间
            updateStartTime() {
                if (this.value) {
                    this.stop()
                    this.overTime = dateTools.parse(this.value)
                    this.start()
                } else {
                    this.stop()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-countdown {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>

