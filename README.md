SYUI
===========================
兼容全端的UI组件库项目

### 使用方法

1、拉取仓库代码到本地

2、使用命令行运行`npm i`命令安装依赖

3、使用HBuilder X导入项目（文件-导入-从本地目录导入）

4、使用HBuilder X运行项目（运行-选择需要运行的平台）

5、使用HBuilder X发布项目（运行-选择需要发布的平台）


### 目录示例

```json
┌─api                     api接口
├─components              组件目录
│  ├─sy-ui                SYUI组件库目录
│  └─....                 更多组件文件
├─mixin                   混入文件目录
├─pages                   页面文件存放的目录
├─main.js                 Vue初始化入口文件
├─static                  静态文件目录
│  ├─image                图片
│  ├─styles               样式
│  │  ├─common            公共样式
│  │  ├─iconfont          业务iconfont样式
│  └──└─public            业务公共样式
├─store                   vuex文件目录
│  ├─image                图片
│  ├─modules              vuex模块目录
│  │  ├─baseData.js       系统稳定数据
│  ├──└─user.js           用户数据
│  └─index.js             vuex入口文件
├─utils                   工具文件目录
│  ├─enum.js              本地枚举
│  ├─index.js             公共工具类
├─.eslintrc.js            ellint配置
├─.gitignore              忽略文件配置
├─App.vue                 应用配置
├─config.js               api地址配置文件
├─main.js                 
├─manifest.json           
├─pages.json              页面配置
└─uni.scss                全局css变量

```
### 组件列表

|组件名|组件说明|
|---|---|
|sy-action-sheet|[底部操作菜单](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-action-sheet/README.md)|
|sy-button|[按钮](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-button/README.md)|
|sy-button-group|[按钮组](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-button-group/README.md)|
|sy-calendar|[日历](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-calendar/README.md)|
|sy-checkbox|[多选按钮](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-checkbox/README.md)|
|sy-checkbox-group|[多选按钮组](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-checkbox-group/README.md)|
|sy-circular|[圆环进度条](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-circular/README.md)|
|sy-countdown|[倒计时](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-countdown/README.md)|
|sy-form-config|[配置项生成表单](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-form-config/README.md)|
|sy-gesture-swiper|[手势滑动切换动画](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-gesture-swiper/README.md)|
|sy-input|[输入框](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-input/README.md)|
|sy-input-captcha|[带获取验证码的输入框](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-input-captcha/README.md)|
|sy-input-range|[范围输入框](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-input-range/README.md)|
|sy-load-more|[加载提示](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-load-more/README.md)|
|sy-loading|[加载中](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-loading/README.md)|
|sy-map|[地图](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-map/README.md)|
|sy-modal|[模态弹窗](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-modal/README.md)|
|sy-navigation-bar|[导航栏](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-navigation-bar/README.md)|
|sy-picker|[选择器](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker/README.md)|
|sy-picker-date|[日期选择器](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker-date/README.md)|
|sy-picker-date-time|[日期时间选择器](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker-date-time/README.md)|
|sy-picker-location|[地址选择器](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker-location/README.md)|
|sy-picker-tree|[树形控件选择器](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker-tree/README.md)|
|sy-picker-view|[可以嵌入页面的选择器](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker-view/README.md)|
|sy-picker-input|[选择器输入框](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-picker-input/README.md)|
|sy-popover|[弹出层](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-popover/README.md)|
|sy-radio|[单选按钮](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-radio/README.md)|
|sy-radio-group|[单选按钮组](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-radio-group/README.md)|
|sy-read-more|[阅读更多](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-read-more/README.md)|
|sy-safe-area-inset|[安全区域占位块](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-safe-area-inset/README.md)|
|sy-steps|[步骤条](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-steps/README.md)|
|sy-switch|[开关按钮](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-switch/README.md)|
|sy-tab-bar|[底部导航栏](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-tab-bar/README.md)|
|sy-table-config|[配置项生成表格](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-table-config/README.md)|
|sy-textarea|[多行输入框](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-textarea/README.md)|
|sy-tree|[树形控件](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-tree/README.md)|
|sy-upload|[文件上传](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-upload/README.md)|
|sy-upload-card|[文件上传卡片样式](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/sy-upload-card/README.md)|

### uni.scss
> uniapp特有的全局scss文件，该项目只用于定义全局scss变量，可以根据项目需求自行修改
```css
// 主色调
$APP_COLOR
$APP_COLOR_ACTIVE
// 主背景色
$APP_BACKGROUND
$APP_BACKGROUND_ACTIVE
// 成功
$SUCCESS_COLOR
$SUCCESS_COLOR_ACTIVE
// 警告
$WARNING_COLOR
$WARNING_COLOR_ACTIVE
// 危险
$DANGER_COLOR
$DANGER_COLOR_ACTIVE
// 信息
$INFO_COLOR
$INFO_COLOR_ACTIVE
```
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

### baseData
> 开发项目时，该项目通常会存在一些稳定的数据（指大部分时间内都不会变动，但是需要从线上服务器请求的数据，比如数据字典、省市区数据等等），这些数据推荐在用户第一次打开页面时，请求并缓存到vuex，不推荐每次需要时就请求一次，这会极大的增加服务器压力。<br>
> 所以我们在store引入了baseData模块，路径为`store\modules\baseData.js`，用户请求并缓存数据。<br>
> <br>
> 通常我们要为某个组件设置配置数据时，需要发送请求->拿到数据->赋值给组件三步操作，但是有了baseData，我们可以把操作缩减到一步。<br>
> 我们为部分组件的配置项（通常为`options`）增加的String数据类型，可以为它设置baseData内的任意数据属性名（可以使用链式写法），组件内部会自动从baseData获取指定数据。

### 解决方案
> 由于uniapp及微信小程序底层实现的原因，有很多vue的功能无法正常，比如组件的props不支持v-bind、不支持动态组件component、props传递对象时会被JSON.stringify，导致每传递一次，都会生成该对象全新复制，当传递的数据量比较大时会产生严重的性能问题，同时也导致我们无法传递js函数。所以我们引入的几个解决方案用于解决这些问题。

### 二级props
> 该解决方案用于解决组件的props不支持v-bind、不支持动态组件component<br>
> <br>
> 当需要实现一个类似动态组件的功能时，变通的方法则是利用for循环把所有组件遍历出来，然后根据父组件传入的组件名来显示对应的组件，同时为每个组件手动绑定props。这个方法有个很严重的问题，就是我们需要为所有组件显式的绑定props，但是当某个组件修改了props，我们也得为这个动态组件也修改一次，这样会极大的增加维护成本和错误。<br>
> <br>
> 所以我们为部分组件的props下增加一个二级props属性，它接收该组件所有支持的一级props，和直接设置组件一级props是一样的效果，不同的是我们可以传入一个动态对象。

### provideData
> 该解决方案用于解决组件的props传递对象时会被JSON.stringify<br>
> <br>
> 利用vue的provide / inject，我们可以在父组件内为子组件注入任意数据，甚至是父组件的vue实例本身。此时我们拿到了父组件的实例对象，当我们想传递给子组件数据时，只需要为子组件指定属性名称即可，子组件则根据传入的组件名称从父组件实例上获取。<br>
> <br>
> 使用方法如下：

在父组件定义provide，"provideComponent"名称不能修改

```js
provide() {
    return {
        provideComponent: this
    }
}
```
子组件利用inject接收

```js
inject: ['provideComponent']
```

同时子组件会为props新增一个provideKey属性，用于父组件指定属性名称，可以使用链式写法，比如`aaa.bbb.ccc`，当provideKey更新时，会把获取的数据赋值给provideData，此时子组件就可以通过this.provideData来访问传递过来的数据了

