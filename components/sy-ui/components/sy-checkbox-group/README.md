sy-checkbox-group
===========================
多选按钮组
> ##### 该组件支持 [baseData](https://github.com/i-yxs/sy-ui/blob/main/README.md#baseData)
> ##### 该组件支持 [二级props](https://github.com/i-yxs/sy-ui/blob/main/README.md#二级props)
> ##### 该组件支持 [provideData](https://github.com/i-yxs/sy-ui/blob/main/README.md#provideData)

### 组件参数

|参数名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|value / v-model|绑定值|-|-|-|
|min|可被勾选的最小数量|String, Number|-|0|
|max|可被勾选的最大数量|String, Number|-|Infinity|
|styles|自定义样式|Object|-|-|
|options|配置选项|Array[Object] / String|配置项数据格式见[options](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-checkbox-group/README.md#options)，当数据格式为字符串时，从[baseData](https://github.com/i-yxs/sy-ui/blob/main/README.md#baseData)获取|-|
|labelKey|指定label为数据源的某个属性|String|-|label|
|valueKey|指定value为数据源的某个属性|String|-|value|
|separator|只读状态时的分隔符|String|-|，|
|placeholder|没有值时的占位符|String|-|-|
|size|同[sy-checkbox](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-checkbox/README.md#组件参数)|-|-|-|
|button|同[sy-checkbox](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-checkbox/README.md#组件参数)|-|-|-|
|color|同[sy-checkbox](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-checkbox/README.md#组件参数)|-|-|-|
|readonly|同[sy-checkbox](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-checkbox/README.md#组件参数)|-|-|-|
|disabled|同[sy-checkbox](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-checkbox/README.md#组件参数)|-|-|-|

### options

```js
{
    [labelKey]: String,
    [valueKey]: Any
}
```

[< 返回组件列表](https://github.com/i-yxs/sy-ui/blob/main/README.md#组件列表)
