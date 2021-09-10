
import defaultValue from './defaultValue'

const publicProps = {
    pickerInput: {
        rows: { default: 1 },
        height: { type: String, default: defaultValue.input.height },
        hidden: { type: Boolean, default: false }, // 是否显示组件，组件变为不可见，可以使用ref获取组件实例
        overlay: { type: Boolean, default: false }, // 是否为覆盖模式，组件变为不可见，覆盖在容器上面
        loading: { type: Boolean, default: false }, // 是否加载中
        readonly: { type: Boolean, default: false }, // 是否只读
        disabled: { type: Boolean, default: false }, // 是否禁用
        clearable: { type: Boolean, default: true }, // 是否清空按钮
        prefixIcon: String, // 输入框头部图标
        suffixIcon: { type: String, default: defaultValue.pickerInput.suffixIcon }, // 输入框尾部图标
        placeholder: String, // 没有值时的占位符
        inputProps: { type: Object, default: () => ({}) } // 其他input参数
    }
}
export function getExclude(name, props) {
    let data = {}
    let prop = publicProps[name]
    Object.keys(prop).forEach(key => {
        if (props.indexOf(key) === -1) {
            data[key] = prop[key]
        }
    })
    return data
}
export default publicProps
