import calendarProps from '../sy-calendar/props'
import pickerInputProps from '../sy-picker-input/props'

export default {
    ...calendarProps,
    ...pickerInputProps,
    mode: { default: 'radio' },
    type: { default: 'date' },
    format: { default: 'YYYY-MM-DD' }, // 显示在输入框中的格式
    valueFormat: { default: 'YYYY-MM-DD HH:mm:ss' },
    defaultTime: { default: () => ['00:00:00', '23:59:59'] },
    separator: { type: String, default: ' 至 ' }, // 选择范围时的分隔符
    bindProps: Array
}
