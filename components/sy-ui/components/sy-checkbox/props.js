
import styleVars from '@/uni.scss'

export default {
    text: String,
    size: { type: String, default: '36rpx' },
    color: { type: String, default: styleVars.APP_COLOR },
    value: { default: false },
    button: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    indeterminate: Boolean,
    trueLabel: { default: true }, // 选中时的值
    falseLabel: { default: false }// 没有选中时的值
}
