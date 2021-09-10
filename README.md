
## 安装
该组件库虽然可以开箱即用，但是你可能需要根据项目需求自订配置，所以并没使用npm安装的方式  

1、请手动clone组件库代码，地址：[sy-ui](https://github.com/i-yxs/sy-ui)  

2、复制components文件夹下的sy-ui文件夹到你的项目根目录  

3、在package.json文件新增以下配置（如你的项目没有该文件可复制clone下来的package.json文件）  

```json
{
  "devDependencies": {
    "babel-eslint": "8.2.6",
    "eslint": "4.19.1",
    "eslint-friendly-formatter": "4.0.1",
    "eslint-loader": "2.0.0",
    "eslint-plugin-vue": "4.7.1"
  },
  "dependencies": {
    "gcoord": "^0.3.2"
  }
}
```

4、复制uni.scss文件到你项目根目录  

> uni.scss相当于与全局样式，推荐仅用于声明全局scss变量，组件库的主色调依赖于该文件，你可以根据项目设计图的主色调更改变量

5、在根目录下main.js文件中新增

```js
import '@/components/sy-ui'
```

6、如需要启用uniapp的easycom `配置以后sy-ui下的组件不需要在页面引用，可直接在页面使用`，请在pages.json文件中新增  

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sy-(.*)": "@/components/sy-ui/components/sy-$1/sy-$1.vue"
    }
  }
}
```
7、运行`npm i`命令
