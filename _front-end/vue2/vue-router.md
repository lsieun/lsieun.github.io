---
title: "vue-router"
sequence: "201"
---

## 相关理解

```text
npm install vue-router
```

### 基本使用

第一步，安装`vue-router`，命令：`npm install vue-router`。

第二步，应用插件：`Vue.use(VueRouter)`

第三步，编写router配置项：

```text
// 引入VueRouter
import VueRouter from 'vue-router'
// 引入路由组件
import About from '../components/About'
import Home from '../components/Home'

// 创建router实例对象，去管理一组一组的路由规则
const router = new VueRouter({
    routes: [
        {
            path: '/about',
            component: About
        },
        {
            path: '/home',
            component: Home
        }
    ]
});

// 暴露router
export default router
```

第四步，实现切换（`active-class`可配置高亮样式）

```text
<router-link active-class="active" to="/about">About</router-link>
```

第五步，指定展示位置：

```text
<router-view></router-view>
```

### 几个注意点

- 路由组件通常放在`pages`文件夹，一般组件通常放在`components`文件夹
- 通过切换，“隐藏”了的路由组件，默认是被销毁的，需要的时候再去挂载。
- 每个组件都有自己的`$route`属性，里面存储着自己的路由信息。
- 整个应用只有一个router，可以通过组件的`$router`属性获取到。

## 嵌套（多级）路由

第一步，配置路由规则，使用`children`配置项：

```text
routes: [
    {
        path: '/about',
        component: About
    },
    {
        path: '/home',
        component: Home,
        children: [ // 通过children配置子级路由
            {
                path: 'news', // 此处一定不要写：/news
                component: News
            },
            {
                path: 'message', // 此处一定不要写：/message
                component: Message
            }
        ]
    }
]
```

第二步，跳转（要写完整路径）：

```text
<router-link to="/home/news">News</router-link>
```

### 路由传参

第一步，传递参数

```text
<!-- 跳转并携带query参数，to的字符串写法 -->
<router-link :to="/home/message/detail?id=666&title=你好">跳转</router-link>
<router-link :to="`/home/message/detail?id=${m.id}&title={m.title}`">跳转</router-link>

<!-- 跳转并携带query参数，to的对象写法 -->
<router-link
    :to="{
        path:'/home/message/detail',
        query: {
            id: 666,
            title: '你好'
        }
    }"
>跳转</router-link>

<router-link
    :to="{
        path:'/home/message/detail',
        query: {
            id: m.id,
            title: m.title
        }
    }"
>跳转</router-link>
```

第二步，接收参数：

```text
$route.query.id
$route.query.title
```

### 命名路由

作用：可以简化路由的跳转。

如何使用：

第一步，给路由命名

```text
{
    path: '/demo'
    component: Demo,
    children: [
        {
            name: 'hello', // 给路由命名
            path: 'welcome',
            component: Hello
        }
    ]
}
```

第二步，简化跳转：

```text
<!-- 简化前，需要写完整的路径 -->
<router-link to="/demo/test/welcome">跳转</router-link>

<!-- 简化后，直接通过名字跳转 -->
<router-link :to="{name:'hello'}">跳转</router-link>

<router-link
    :to="{
        name:'hello',
        query: {
            id: 666,
            title: '你好'
        }
    }"
>跳转</router-link>
```

### 路由的params参数

第一步，配置路由，声明接收params参数：

```text
{
    path: '/home',
    component: Home,
    children: [
        {
            path:'news',
            component:News
        },
        {
            path:'message',
            component: Message,
            children: [
                {
                    name: 'xiangqing',
                    path: 'detail/:id/:title', // 使用占位符声明接收params参数
                    component Detail
                }
            ]
        }
    ]
}
```

第二步，传递参数：

```text
<!-- 跳转并携带params参数，to的字符串写法 -->
<router-link :to="/home/message/detail/666/你好">跳转</router-link>

<!-- 跳转并携带params参数，to的对象写法 -->
<router-link
    :to="{
        name:'xiangqing', // 携带params参数，必须使用name，而不能使用path
        params: {
            id: 666,
            title: '你好'
        }
    }"
>跳转</router-link>
```

特别注意：路由携带params参数时，若使用`to`的“对象写法”（上面的第二种写法），则不能使用`path`配置项，必须使用`name`配置项。

第三步，接收参数

```text
$route.params.id
$route.params.title
```

### 路由的props配置

作用：让路由组件方便的收到参数

```text
{
    name:'xiangqing',
    path:'detail/:id',
    component:Detail,
    
    // 第一种写法：props值为对象，该对象中所有的key-value的组合最终会通过props传给Detail组件
    // props: {a:900}
    
    // 第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件
    // props: true
    
    // 第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
    props(route) {
        return {
            id: route.query.id,
            title: route.query.title
        };
    }
}
```

### replace属性

`<router-link>`的replace属性

作用：控制路由跳转时操作浏览器历史记录的模式

浏览器的历史记录有两种写入方式，分别为`push`和`replace`，
`push`是追加历史记录，`replace`是替换当前记录。
路由跳转时候，默认为`push`。

如何开启`replace`模式：

```text
<router-link replace ...>News</router-link>
```

### 编程式路由导航

作用：不借助`<router-link>`实现路由跳转，让路由跳转更加灵活

具体编码：

```text
// $router的两个API
this.$router.push({
    name:'xiangqing',
    params: {
        id: xxx,
        title: xxx
    }
});

this.$router.replace({
    name: 'xiangqing',
    params: {
        id: xxx,
        title: xxx
    }
});

this.$router.back();
this.$router.forward();
this.$router.go(3);
```

### 缓存路由组件

作用：让不展示的路由组件保持挂载，不被销毁。

具体编码：

```text
<keep-alive include="News">
    <router-view></router-view>
</keep-alive>
```

### 两个新的生命周期钩子

作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。

具体名字：

- `activated`：路由组件被激活时触发
- `deactivated`：路由组件失活时触发

## Reference

- [vue-router](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=117)
