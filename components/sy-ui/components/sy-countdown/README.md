sy-countdown
===========================
倒计时

### 组件参数

|参数名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|value / v-model|绑定值|String|见[日期格式](https://github.com/i-yxs/sy-ui/blob/main/README.md#日期格式)|-|
|format|倒计时格式|String|见[日期格式](https://github.com/i-yxs/sy-ui/blob/main/README.md#日期格式)，“{}”包裹的单位及比它大的单位小于等于0时不会返回，每次只能包裹一个单位|-|
|overHide|倒计时结束时是否隐藏组件|Boolean|-|false|

### Slot

|名称|说明|
|---|---|
|-|自定义内容|

### 示例代码
``` html
<sy-countdown
    v-slot="{type, value}"
    :value="value"
    format="YYYYMMDDHHmmssSSS"
>
    <view>{{ value }}{{ { 'Y': '年', 'M': '个月', 'D': '天', 'H': '小时', 'm': '分', 's': '秒', 'S': '毫秒' }[type] }}</view>
</sy-countdown>
```


[< 返回组件列表](https://github.com/i-yxs/sy-ui/blob/main/README.md#组件列表)
