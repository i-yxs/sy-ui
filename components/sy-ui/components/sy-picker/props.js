
import pickerViewProps from '../sy-picker-view/props'
import pickerInputProps from '../sy-picker-input/props'

let props = {
    ...pickerViewProps,
    ...pickerInputProps,
    separator: { type: String, default: '/' }, // 间隔符
    valueFormat: String,
    allowCreate: Boolean, // 是否可以创建新条目
    createPlaceholder: { type: String, default: '输入需要创建的新条目' } // 创建新条目时显示的占位符
}
delete props.indicatorStyle

export default props
