import calendarProps from '../sy-calendar/props'
import pickerInputProps from '../sy-picker-input/props'

export default {
    ...calendarProps,
    ...pickerInputProps,
    format: { default: 'YYYY-MM-DD HH:mm:ss' },
    valueFormat: { default: 'YYYY-MM-DD HH:mm:ss' }
}
