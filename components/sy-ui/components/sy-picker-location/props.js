
import pickerInputProps from '../sy-picker-input/props'

export default {
    ...pickerInputProps,
    latitude: [String, Number],
    longitude: [String, Number],
    transform: { type: Boolean, default: true }// 是否转换成百度坐标系
}
