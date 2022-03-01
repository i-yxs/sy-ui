
export default {
    min: { type: Number, default: 0 }, // 最小值
    max: { type: Number, default: 100 }, // 最大值
    type: { type: String, default: 'digit' }, // input的类型
    value: Array, // input的值
    height: { default: '52rpx' }, // 输入框的高度
    styles: Object, // 自定义样式
    prepend: String, // 前置内容
    append: String, // 后置内容
    readonly: Boolean, // 是否只读
    clearable: Boolean, // 是否可清空
    separator: { type: String, default: '至' }, // 分隔符
    /**
     * 组件默认返回值为数组，当需要为数组内的每个项赋值给多个属性时
     * 配置的bindProps内的项为value对应下标项的所赋值的属性名
     */
    bindProps: Array,
    quickInput: { default: 0 }, // 是否启用快速输入模式
    prefixPlaceholder: String, // 前置输入框的placeholder
    suffixPlaceholder: String, // 后置输入框的placeholder
    prefixInputProps: Object, // 前置输入框的props
    suffixInputProps: Object // 后置输入框的props
}
