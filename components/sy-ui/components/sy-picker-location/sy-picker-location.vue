<!--
* @description 地理位置选择器
* @author yxs
!-->
<template>
    <view :class="{link: isClick}" class="sy-picker-location">
        <sy-picker-input
            :props="pickerInputProps"
            @clear="handleClear"
            @click="handleClick"
        />
    </view>
</template>
<script>
    // 工具
    import props from './props'
    import mixinProps, { assignProps } from '../../mixin/props'
    import { gcoordTransform } from '../../utils'

    export default {
        name: 'SyPickerLocation',
        mixins: [mixinProps],
        props,
        data() {
            return {
                viewValue: ''
            }
        },
        computed: {
            isClick() {
                return this.__props.readonly && this.__props.longitude && this.__props.latitude
            },
            pickerInputProps() {
                return assignProps('SyPickerInput', {
                    ...this.__props,
                    value: this.viewValue
                })
            }
        },
        watch: {
            '__props.value': {
                immediate: true,
                handler(value) {
                    this.viewValue = value
                }
            }
        },
        methods: {
            handleClear() {
                this.viewValue = ''
                this.$emit('change')
                this.$emit('input', '')
            },
            handleClick() {
                if (this.__props.readonly) {
                    this.handleOpenLocation()
                } else {
                    this.handleChooseLocation()
                }
            },
            handleOpenLocation() {
                if (this.__props.longitude && this.__props.latitude) {
                    let [longitude, latitude] = this.transform ? gcoordTransform([this.__props.longitude, this.__props.latitude], true) : [this.__props.longitude, this.__props.latitude]
                    uni.openLocation({
                        latitude,
                        longitude,
                        address: this.__props.value
                    })
                }
            },
            handleChooseLocation() {
                uni.chooseLocation({
                    success: (res) => {
                        [res.longitude, res.latitude] = this.__props.transform ? gcoordTransform([res.longitude, res.latitude]) : [res.longitude, res.latitude]
                        this.viewValue = res.address
                        this.$emit('change', res)
                        this.$emit('input', res.address)
                    },
                    fail: (res) => {
                        console.error(res)
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-picker-location{
    &.link {
        color: $APP_COLOR;
    }
}
</style>

