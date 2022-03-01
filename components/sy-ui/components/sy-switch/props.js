
import styleVars from '@/uni.scss'

export default {
    value: { default: false },
    color: { type: String, default: styleVars.APP_COLOR },
    styles: Object,
    readonly: Boolean,
    disabled: Boolean,
    trueValue: { default: true }, // 选中时的值
    trueLabel: { type: String, default: '是' },
    falseValue: { default: false }, // 没有选中时的值
    falseLabel: { type: String, default: '否' },
    placeholder: String// 没有值时的占位符
}
