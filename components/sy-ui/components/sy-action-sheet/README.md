sy-action-sheet
===========================
底部操作菜单

### 组件参数

|参数名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|visible|组件可见状态|Boolean|-|false|
|options|菜单配置|Array|数据格式详见[options](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-action-sheet/README.md#options)|-|
|closeOnMask|是否在点击遮罩层后隐藏组件|Boolean|-|true|
|closeOnClick|是否在点击菜单项后隐藏组件|Boolean|-|true|

### options

数据格式

```js
[
    {
        // 菜单的文本
        text: String,
        // 自定义样式
        styles: Object,
        // 是否禁用
        disabled: Boolean
    },
    ...
]
```

[< 返回组件列表](https://github.com/i-yxs/sy-ui/blob/main/README.md#组件列表)
