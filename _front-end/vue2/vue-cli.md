---
title: "vue cli"
sequence: "202"
---

## 安装vue cli

```text
npm run serve
```

```text
npm inspect > output.js
```

## 查看Vue项目的版本

`vue -V`或者是`vue --version`查询的是vue-cli的版本，也就是vue脚手架的版本：

```text
vue --version
vue -V
```

如果想要查看vue项目的版本，直接去项目中，找到`package.json`文件夹 找"dependencies"然后就可以看到你装的vue的版本了：

```text
"dependencies": {
  "animate.css": "^4.1.1",
  "axios": "^0.27.2",
  "crypto-js": "^4.1.1",
  "dayjs": "^1.11.3",
  "echarts": "^5.3.3",
  "element-plus": "^2.2.8",
  "js-cookie": "^3.0.1",
  "pinia": "^2.0.14",
  "vite": "^2.9.9",
  "vue": "^3.2.25",
  "vue-router": "^4.1.1"
},
```


## 脚手架文件结构

- node_modules
- public
  - favicon.ico: 图标
  - index.html: 主页面
- src
  - assets: 存放静态资源
    - logo.png
  - component: 存放组件
    - HelloWorld.vue
  - App.vue: 汇总所有组件
  - main.js: 入口文件
- .gitignore: git版本管理忽略的配置
- babel.config.js: babel的配置文件，将ES6转换成ES5
- package.json: 应用包配置文件
- README.md
- package-lock.json: 包版本控制文件

## 关于不同版本的Vue

`vue.js`与`vue.runtime.xxx.js`的区别：

- `vue.js`是完整版的Vue，包含：核心功能 + 模板解析器。
- `vue.runtime.xxx.js`是运行版的Vue，只包含：核心功能，没有模板解析器。

因为`vue.runtime.xxx.js`没有模板解析器，所以不能使用template配置项，
需要使用`render`函数接收到的`createElement`函数去指定具体的内容。

## vue.config.js配置文件

使用`vue inspect > output.js`可以查看Vue脚手架的默认配置。

> 默认配置

使用`vue.config.js`可以对脚手架进行个性化定制，详情见[Configuration Reference][vue-config]

> 自定义配置

## ref属性

- 用来给元素或子组件注册引用信息（id的替代者）
- 应用在html标签上，获取的是真实DOM元素；应用在组件标签上，是组件实例对象（vc）。

使用方式：

- 打标识：`<h1 ref="xxx">`或 `<School ref="xxx"></School>`
- 获取：`this.$refs.xxx`

## 配置项props

功能：让组件接收外部传过来的数据。

传递数据：

```text
<Demo name="xxx"/>
```

接收数据：

第一种方式（只接收）：

```text
props:['name']
```

第二种方式（限制类型）：

```text
props: {
    name:String,
    age:Number
}
```

第三种方式（限制类型、限制必要性、指定默认值）：

```text
props: {
    name: {
        type:String, // 类型
        required:true, // 必要性
        default:'你好' // 默认值
    }
}
```

备注：`props`是只读，Vue底层会监测你对`props`的修改。
如果进行了修改，就会发出警告。
若业务需求确实需要修改，那么请复制`props`的内容到`data`中一份，
然后去修改`data`中的数据。

## mixin（混入）

功能：可以把多个组件共用的配置提取成一个混入对象

使用方式：

第一步，定义混合，例如：

```text
{
    data(){...},
    methods:{...},
    ...
}
```

第二步，使用混入，例如：

- 全局混入：`Vue.mixin(xxx)`
- 局部混入：`mixins:['xxx']`

## 插件

功能：用于增强Vue

本质：包含`install`方法的一个对象，
`install`的第一个参数是`Vue`，
第二个以后的参数是插件使用者传递的数据。

定义插件：

```text
对象.install = function(Vue, options) {
    // 1. 添加全局过滤器
    Vue.filter(...);
    
    // 2. 添加全局指令
    Vue.directive(...);
    
    // 3. 配置全局混入（混合）
    Vue.mixin(...);
    
    // 4. 添加实例方法
    Vue.prototype.$myMethod = function() {...};
    Vue.prototype.$myProperty = xxx;
}
```

使用插件：

```text
Vue.use();
```

## scoped样式

作用：让样式在局部生效，防止冲突。

写法：

```text
<style scoped>

</style>
```


## Reference

- [Vue CLI](https://cli.vuejs.org/)
  - [Guide](https://cli.vuejs.org/guide/)
  - [Configuration Reference](https://cli.vuejs.org/config/)

[vue-config]: https://cli.vuejs.org/config/