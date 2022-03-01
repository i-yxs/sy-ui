
import pickerProps from '../sy-picker/props'
import pickerTreeProps from '../sy-picker-tree/props'

const props = {
    ...pickerProps,
    ...pickerTreeProps,
    type: { type: String, default: 'picker' } // 选择器类型 picker：普通联动选择器 tree：树状选择器
}
delete props.loading

export default props
