
import checkboxProps from '../sy-checkbox/props'
import { getProps } from '../../mixin/props'

export default {
    ...getProps({
        data: checkboxProps,
        props: ['size', 'color', 'button', 'readonly', 'disabled']
    }),
    min: { type: [String, Number], default: 0 },
    max: { type: [String, Number], default: Infinity },
    value: null,
    styles: Object,
    options: [Array, String], // 数据源
    labelKey: { type: String, default: 'label' }, // 指定label为数据源的某个属性
    valueKey: { type: String, default: 'value' }, // 指定value为数据源的某个属性
    separator: { type: String, default: '，' },
    placeholder: String // 没有值时的占位符
}
