import inputProps from '../sy-input/props'

export default {
    ...inputProps,
    hidden: Boolean, // 是否显示组件，组件变为不可见，可以使用ref获取组件实例
    overlay: Boolean, // 是否为覆盖模式，组件变为不可见，覆盖在容器上面
    loading: Boolean, // 是否是加载状态
    suffixIcon: { default: 'sy-ui-icon-arrow-right' },
    allowInput: { default: false }
}
