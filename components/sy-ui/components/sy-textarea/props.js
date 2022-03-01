export default {
    styles: Object, // 自定义样式
    height: { default: '140rpx' }, // 输入框的高度
    readonly: Boolean, // 是否只读
    allowInput: { type: Boolean, default: true }, // 是否允许输入
    quickInput: null, // 是否启用快速输入模式，启用时当input获取焦点且value等于指定值时，自动清空value，从而避免用户还需要删除原来的值
    showWordLimit: Boolean, // 是否显示输入字数统计
    popoverHiddenAfterDisplay: { type: Boolean, default: true }, // 当sy-popover显示时隐藏组件
    // 原生属性
    value: null,
    focus: Boolean,
    fixed: Boolean,
    cursor: null,
    disabled: Boolean,
    maxlength: { default: 500 },
    autoHeight: Boolean,
    confirmType: null,
    confirmHold: Boolean,
    placeholder: null,
    holdKeyboard: Boolean,
    cursorSpacing: null,
    selectionEnd: null,
    selectionStart: null,
    showConfirmBar: { type: Boolean, default: true },
    adjustPosition: { type: Boolean, default: true }
}
