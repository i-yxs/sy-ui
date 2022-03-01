
import radioProps from '../sy-radio/props'
import { getProps } from '../../mixin/props'

export default {
    ...getProps({
        data: radioProps,
        props: ['size', 'color', 'button', 'isCancel', 'readonly', 'disabled']
    }),
    value: null,
    styles: Object,
    options: [Array, String], // 数据源
    labelKey: { type: String, default: 'label' }, // 指定label为数据源的某个属性
    valueKey: { type: String, default: 'value' }, // 指定value为数据源的某个属性
    excludes: Array, // 指定项不显示，当数据项的value被excludes包含时，视图上将隐藏该数据项
    placeholder: String // 没有值时的占位符
}
