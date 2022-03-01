SYUI
===========================
兼容全端的UI组件库项目

**使用方法**
1、拉取仓库代码到本地<br>
2、使用命令行运行`npm i`命令安装依赖
3、使用HBuilder X导入项目（文件-导入-从本地目录导入）<br>
4、使用HBuilder X运行项目（运行-选择需要运行的平台）<br>
5、使用HBuilder X发布项目（运行-选择需要发布的平台）<br>

**目录示例**
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
**组件列表**
|组件名|组件说明|
|---|---|
|xxx|[xxx](https://github.com/i-yxs/sy-ui/tree/main/components/sy-ui/components/xxx/README.md)|
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

