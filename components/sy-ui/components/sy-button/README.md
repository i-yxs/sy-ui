sy-button
===========================
按钮
> ##### 该组件支持 [二级props](https://github.com/i-yxs/sy-ui/blob/main/README.md#二级props)

### 组件参数

|参数名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|type|按钮类型|String|primary / success / warning / danger|-|
|text|按钮文本|String|-|-|
|plain|是否朴素按钮|Boolean|-|false|
|inline|是否内联按钮|Boolean|-|false|
|styles|自定义样式|Object|-|详见[默认styles](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-button/README.md#默认styles)|
|loading|是否加载状态|Boolean|-|false|
|disabled|是否禁用状态|Boolean|-|false|
|loading|加载状态|Boolean|-|false|
|openType|微信开放能力|String|详见微信开发文档[open-type](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)|-|
|prefixIcon|前置图标|String|-|-|
|suffixIcon|后置图标|String|-|-|

### 默认styles

```js
{
    height: '90rpx',
    borderRadius: '45rpx',
    fontSize: '30rpx'
}
```

[< 返回组件列表](https://github.com/i-yxs/sy-ui/blob/main/README.md#组件列表)
