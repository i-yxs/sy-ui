export default {
    rows: { default: 1 }, // 最多显示行数
    height: { default: '68rpx' }, // 输入框的高度
    readonly: Boolean, // 是否只读
    clearable: Boolean, // 是否可清空
    moneyMode: Boolean, // 是否启用金额模式，失去焦点时会以金额格式显示
    allowInput: { type: Boolean, default: true }, // 是否允许输入
    prefixIcon: String, // 输入框头部图标
    suffixIcon: String, // 输入框尾部图标
    prefixIconStyle: { type: Object, default: () => ({ fontSize: '30rpx', color: '#c5c5c5' }) }, // 头部图标样式
    suffixIconStyle: { type: Object, default: () => ({ fontSize: '30rpx', color: '#c5c5c5' }) }, // 尾部图标样式
    quickInput: null, // 是否启用快速输入模式，启用时当input获取焦点且value等于指定值时，自动清空value，从而避免用户还需要删除原来的值
    showPassword: Boolean, // 是否显示切换密码图标
    showWordLimit: Boolean, // 是否显示输入字数统计
    popoverHiddenAfterDisplay: { type: Boolean, default: true }, // 当sy-popover显示时隐藏组件
    // 原生属性
    type: String,
    value: null,
    focus: Boolean,
    cursor: null,
    password: Boolean,
    disabled: Boolean,
    maxlength: { default: 140 },
    placeholder: { default: '' },
    confirmType: null,
    confirmHold: Boolean,
    alwaysEmbed: Boolean,
    holdKeyboard: Boolean,
    cursorSpacing: null,
    selectionEnd: null,
    selectionStart: null,
    adjustPosition: { type: Boolean, default: true }
}
