/**
 * 组件props混入
 * 用于解决微信小程序不支持动态v-bind属性，导致维护sy-form-config时，更新props时容易漏改某个组件
 * 注意：props优先级高于$props，所以当props和$props同时拥有相同属性时，会优先使用props的属性值
 */

import SyTree from '../components/sy-tree/props'
import SyInput from '../components/sy-input/props'
import SyRadio from '../components/sy-radio/props'
import SyRadioGroup from '../components/sy-radio-group/props'
import SyCheckbox from '../components/sy-checkbox/props'
import SyCheckboxGroup from '../components/sy-checkbox-group/props'
import SyButton from '../components/sy-button/props'
import SyButtonGroup from '../components/sy-button-group/props'
import SySwitch from '../components/sy-switch/props'
import SyUpload from '../components/sy-upload/props'
import SyUploadCard from '../components/sy-upload-card/props'
import SyTextarea from '../components/sy-textarea/props'
import SyInputRange from '../components/sy-input-range/props'
import SyInputCaptcha from '../components/sy-input-captcha/props'
import SyPicker from '../components/sy-picker/props'
import SyPickerView from '../components/sy-picker-view/props'
import SyPickerDate from '../components/sy-picker-date/props'
import SyPickerTree from '../components/sy-picker-tree/props'
import SyPickerInput from '../components/sy-picker-input/props'
import SyPickerDistrict from '../components/sy-picker-district/props'
import SyPickerLocation from '../components/sy-picker-location/props'
import SyPickerDateTime from '../components/sy-picker-date-time/props'

const Props = {
    SyTree,
    SyInput,
    SyRadio,
    SyRadioGroup,
    SyCheckbox,
    SyCheckboxGroup,
    SyButton,
    SyButtonGroup,
    SySwitch,
    SyUpload,
    SyUploadCard,
    SyTextarea,
    SyInputRange,
    SyInputCaptcha,
    SyPicker,
    SyPickerUrl: SyPickerInput,
    SyPickerView,
    SyPickerDate,
    SyPickerTree,
    SyPickerInput,
    SyPickerDistrict,
    SyPickerLocation,
    SyPickerDateTime
}
// 获取指定prop名称的props对象
export function getProps(option) {
    option = {
        name: null,
        data: null,
        props: [],
        isExclude: false,
        ...option
    }
    let props = {}
    let data = option.name ? Props[option.name] : option.data
    if (data) {
        if (option.isExclude) {
            Object.keys(data).forEach(key => {
                if (option.props.indexOf(key) === -1) {
                    props[key] = data[key]
                }
            })
        } else {
            option.props.forEach(key => {
                props[key] = data[key]
            })
        }
    }
    return props
}
// 为指定props赋值并返回
export function assignProps(name, props) {
    if (Props[name]) {
        let _props = {}
        Object.keys(Props[name]).forEach(key => {
            if (key in props && props[key] !== void 0) {
                _props[key] = props[key]
            }
        })
        return _props
    }
}

export default {
    props: {
        props: Object
    },
    computed: {
        __props() {
            if (this.props) {
                let __props = {}
                if (Props[this.$options.name]) {
                    let props = this.props
                    Object.keys(Props[this.$options.name]).forEach(key => {
                        if (key in props) {
                            __props[key] = props[key]
                        } else {
                            __props[key] = this.$props[key]
                        }
                    })
                }
                return __props
            }
            return this.$props
        }
    }
}
