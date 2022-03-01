export default {
    size: { type: String, default: 'normal' }, // 组件的尺寸，mini、small、medium、normal
    round: Boolean, // 是否圆角
    circle: Boolean, // 是否圆形
    config: Object, // 配置项
    hidden: Boolean, // 是否隐藏组件，组件变为不可见，可以使用ref获取组件实例
    overlay: Boolean, // 是否为覆盖模式，组件变为不可见，覆盖容器内容
    readonly: Boolean, // 是否只读
    disabled: Boolean, // 是否禁用
    fileList: { type: Array, default: () => [] }, // 默认展示的文件列表
    placeholder: String, // 没有值时的占位符
    locationToBeforeDraw: Boolean// 是否绘制前获取地理位置
}
