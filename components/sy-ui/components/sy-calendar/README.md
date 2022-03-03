sy-calendar
===========================
用于嵌入页面的日历选择器
> ##### 该组件支持 [二级props](https://github.com/i-yxs/sy-ui/blob/main/README.md#二级props)
> ##### 该组件支持 [provideData](https://github.com/i-yxs/sy-ui/blob/main/README.md#provideData)

### 组件参数

|参数名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|value / v-model|绑定值|-|-|-|
|mode|选择模式|String|radio（单选） range（范围选择） multiple（多选）|-|
|type|展示类型|String|date（日期） week（星期） month（月份） year（年份）|date|
|defaultTime|范围选择时选中日期所使用的当日内具体时刻|Array|数组，长度为 2，每项值为字符串，形如12:00:00，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 00:00:00|-|
|valueFormat|绑定值的格式|String|见[日期格式](https://github.com/i-yxs/sy-ui/blob/main/README.md#日期格式)|YYYY-MM-DD|
|min|可选的最早日期|String / Date|-|-|
|max|可选的最晚日期|String / Date|-|-|
|loading|加载状态|Boolean|-|false|
|yearRange|可选择的年份范围（指当前年份的前后多少年份）|Number|-|100|
|firstDayOfWeek|周起始日|Number|1-7|1|
|provideKey|-|String|指定父组件的配置对象名称，数据格式详见[provideData](https://github.com/i-yxs/sy-ui/blob/main/components/sy-ui/components/sy-calendar/README.md#providedata)|-|

### provideData

数据格式

```js
{
    // 用于在指定日期上显示标记点
    markers: {
        // 日期，当使用 YYYY / YYYY-MM / YYYY-MM-DD 时，则为 年份 / 月份 / 日期 视图添加标记点
        'YYYY-MM-DD': {
            // 显示的文本
            text: String,
            // 自定义样式
            styles: Object
        },
    }
}
```

[< 返回组件列表](https://github.com/i-yxs/sy-ui/blob/main/README.md#组件列表)
