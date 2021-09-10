<!--
* @description 地理位置选择器
* @author yxs
!-->
<template>
    <view
        :class="{link: isClick}"
        class="sy-picker-location"
    >
        <sy-picker-input
            :value="inputLabel"
            :height="height"
            :hidden="hidden"
            :overlay="overlay"
            :loading="loading"
            :disabled="disabled"
            :clearable="clearable"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIconName"
            :placeholder="placeholder"
            :input-props="inputProps"
            readonly
            @clear="handleClear"
            @click="handleClick"
        />
    </view>
</template>
<script>
    // 方法
	import gcoord from 'gcoord'
    import publicProps from '@/components/sy-ui/utils/publicProps'
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    export default {
        name: 'SyPickerLocation',
        components: {
        },
        props: {
            rows: [String, Number],
            value: null,
            latitude: [String, Number],
            longitude: [String, Number],
            // 是否转换成百度坐标系
            transform: { type: Boolean, default: true },
            // picker 参数
            ...publicProps.pickerInput,
            prefixIcon: { default: defaultValue.pickerLocation.prefixIcon },
            inputProps: { default: () => defaultValue.pickerLocation.inputProps }
        },
        data() {
            return {
                inputLabel: ''
            }
        },
        computed: {
            isClick() {
                return this.readonly && this.longitude && this.latitude
            },
            suffixIconName() {
                if (!this.readonly) {
                    return this.loading ? 'sy-ui-icon-loading' : this.suffixIcon
                }
                return ''
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.inputLabel = value
                }
            }
        },
        methods: {
			transformLocation(location = [], isTransGCJ02 = false) {
				let trans = isTransGCJ02 ? [gcoord.BD09, gcoord.GCJ02] : [gcoord.GCJ02, gcoord.BD09]
				try {
					return gcoord.transform(location, ...trans)
				} catch (e) {
					// 失败 操作
					return [0, 0]
				}
			},
            handleClear() {
                this.inputLabel = ''
                this.$emit('change')
                this.$emit('input', '')
            },
            handleClick() {
                if (this.readonly) {
                    this.handleOpenLocation()
                } else {
                    this.handleChooseLocation()
                }
            },
            handleOpenLocation() {
                if (this.longitude && this.latitude) {
                    var [longitude, latitude] = this.transform ? this.transformLocation([this.longitude, this.latitude], true) : [this.longitude, this.latitude]
                    uni.openLocation({
                        latitude,
                        longitude,
                        address: this.value
                    })
                }
            },
            handleChooseLocation() {
                uni.chooseLocation({
                    success: (res) => {
                        [res.longitude, res.latitude] = this.transform ? this.transformLocation([res.longitude, res.latitude]) : [res.longitude, res.latitude]
                        this.inputLabel = res.address
                        this.$emit('change', res)
                        this.$emit('input', res.address)
                    },
                    fail: (res) => {
                        console.log(res)
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

