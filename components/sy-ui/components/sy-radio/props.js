
import styleVars from '@/uni.scss'

export default {
    text: String,
    value: null,
    label: null,
    size: { type: String, default: '36rpx' },
    color: { type: String, default: styleVars.APP_COLOR },
    button: Boolean,
    isCancel: Boolean, // 是否可以取消选中
    readonly: Boolean,
    disabled: Boolean
}
