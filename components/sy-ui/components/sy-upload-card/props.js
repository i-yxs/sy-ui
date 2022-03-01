
export default {
    value: Object,
    label: String,
    config: Object,
    readonly: Boolean, // 是否只读
    disabled: Boolean, // 是否禁用
    styleType: { default: 1 }, // 样式类型
    placeholder: String, // 没有值时的占位符
    locationToBeforeDraw: Boolean// 是否绘制前获取地理位置
}
