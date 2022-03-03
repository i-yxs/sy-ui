export default {
    type: String, // 按钮类型 primary success warning danger
    text: String, // 按钮文本
    plain: Boolean, // 是否朴素按钮
    inline: Boolean, // 是否内联按钮
    styles: Object, // 自定义样式
    loading: Boolean, // 是否加载状态
    disabled: Boolean, // 是否禁用状态
    openType: String, // 微信开放能力
    prefixIcon: String, // 前置图标
    suffixIcon: String // 后置图标
}
