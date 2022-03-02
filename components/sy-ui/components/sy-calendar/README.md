sy-calendar
===========================
用于嵌入页面的日历选择器
> ##### 该组件支持传入对象props，详见[props组件](https://github.com/i-yxs/sy-ui/edit/main/README.md#props组件)

### 组件参数

|参数名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|value / v-model|绑定值|-|-|-|
|mode|选择模式|String|radio（单选） range（范围选择） multiple（多选）|-|
|type|展示类型|String|date（日期） week（星期） month（月份） year（年份）|date|
|defaultTime|范围选择时选中日期所使用的当日内具体时刻|Array|数组，长度为 2，每项值为字符串，形如12:00:00，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 00:00:00|-|
|valueFormat|绑定值的格式|String|见日期格式|YYYY-MM-DD|
|min|可选的最早日期|String / Date|-|-|
|max|可选的最晚日期|String / Date|-|-|
|loading|加载状态|Boolean|-|false|
|yearRange|可选择的年份范围（指当前年份的前后多少年份）|Number|-|100|
|firstDayOfWeek|周起始日|Number|1-7|1|

### 日期格式

> ##### 所有格式都支持多位数，值不够位数时补0

|格式|含义|备注|举例|
|---|---|---|---|
|YYYY|年|-|2022|
|M|月|不补0|1|
|MM|月|-|01|
|D|日|不补0|1|
|DD|日|-|01|
|H|小时|24小时制；不补0|1|
|HH|小时|24小时制|01|
|h|小时|12小时制；不补0|1|
|hh|小时|12小时制|01|
|m|分钟|不补0|1|
|s|秒|不补0|1|
|ss|秒|-|01|
|S|毫秒|-|-|
