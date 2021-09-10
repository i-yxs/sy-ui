<!--
* @description 开关按钮
* @author yxs
!-->
<template>
    <view
        :style="style"
        class="sy-switch"
    >
        <template v-if="readonly">
            <text v-if="isEmpty(viewValue)" class="input-placeholder">
                {{ placeholder }}
            </text>
            <text v-else>{{ viewValue }}</text>
        </template>
        <switch
            v-else
            :color="color"
            :checked="checked"
            :disabled="disabled"
            @change="handleChange"
        />
    </view>
</template>
<script>
    import styleVars from '@/uni.scss'
    import { jsonToCss } from '@/components/sy-ui/utils'

    export default {
        name: 'SySwitch',
        props: {
            value: { default: false },
            color: { type: String, default: styleVars.APP_COLOR },
            styles: Object,
            // 是否只读
            readonly: { type: Boolean, default: false },
            disabled: { type: Boolean, default: false },
            trueValue: { default: true },
            trueLabel: { type: String, default: '是' },
            // 没有选中时的值
            falseValue: { default: false },
            falseLabel: { type: String, default: '否' },
            // 没有值时的占位符
            placeholder: String
        },
        data() {
            return {
                checked: false
            }
        },
        computed: {
            style() {
                return jsonToCss(this.styles)
            },
            viewValue() {
                return this.checked ? this.trueLabel : this.falseLabel
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.checked = this.trueValue === value
                }
            }
        },
        methods: {
            handleChange(e) {
                this.checked = e.detail.value
                var value = this.checked ? this.trueValue : this.falseValue
                this.$emit('input', value)
                this.$emit('change', value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-switch {
    display: inline-flex;
    align-items: center;
}
</style>

