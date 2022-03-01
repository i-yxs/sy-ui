
import inputProps from '../sy-input/props'

export default {
    ...inputProps,
    loading: Boolean, // 是否是加载状态
    cooling: Boolean, // 是否冷却中，冷却中按钮文本变更为倒计时
    duration: { default: 60 }// 冷却时间，单位秒
}
