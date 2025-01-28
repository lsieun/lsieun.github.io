---
title: "vue3-router"
sequence: "201"
---

## vue-router

- createRouter
- createWebHashHistory
- createWebHistory
- RouteRecordRaw

在`vue-router.d.ts`文件中，有如下定义：

```text
export declare function createMemoryHistory(base?: string): RouterHistory;
export declare function createWebHashHistory(base?: string): RouterHistory;
export declare function createWebHistory(base?: string): RouterHistory;

export declare function createRouter(options: RouterOptions): Router;

export declare interface RouterOptions extends PathParserOptions {
    history: RouterHistory;
    routes: Readonly<RouteRecordRaw[]>;
}
```

## content

File: `src/router/index.ts`

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue')
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router
```

File: `src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

File: `src/App.vue`

```text
<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/register">About</RouterLink>
    </nav>
  </header>

  <RouterView/>
</template>

<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>
```

## 路由模式

### hash实现

hash是URL中hash（`#`）及后面的那部分，常用作锚点在页面内进行导航，**改变URL中的hash部分不会引起页面刷新**。

通过`hashchange`事件监听URL的变化，改变URL的方式只有这几种：

- 通过浏览器前进后退改变URL
- 通过`<a>`标签改变URL
- 通过`window.location`改变URL

可以在浏览器的Console页面输入：`location.hash`查看值

这个应该是`window.location`对象

也通过修改`location.hash`改变页面的内容：

```text
location.hash='#/register'
location.hash='#/'
```

```text
window.addEventListener('hashchange', (e) => {
    console.log(e);
});
```

### history实现

history提供了pushState和replaceState两个方法，**这两个方法改变URL中path部分不会引导起页面刷新**。

history提供类似`hashchange`事件的`popstate`事件，但是`popstate`事件有些不同：

- 通过浏览器前进后退改变URL时会触发popstate事件
- 通过`pushState`/`replaceState`或`<a>`标签改变URL不会触发popstate事件。
- 我们可以拦截`pushState`/`replaceState`的调用和`<a>`标签的点击事件来检测URL变化
- 通过js调用history的back/forward/go方法会触发该事件

所以监听URL变化可以实现

```text
window.addEventListener('popstate', (e) => {
    console.log(e);
});
```

### 使用name

File: `src/router/index.ts` （注意，添加了`name`）

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login', // 这里添加了name
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/register',
        name: 'Register', // 这里添加了name
        component: () => import('@/views/register.vue')
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

File: `src/App.vue` （注意`:to`前面有冒号，并且使用了对象的方式）

```text
<template>
  <header>
    <nav>
      <RouterLink :to="{name:'Login'}">Home</RouterLink>
      <RouterLink :to="{name:'Register'}">About</RouterLink>
    </nav>
  </header>
  <hr/>

  <RouterView/>
</template>

<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>
```

## 编程式导航

```text
<template>
  <header>
    <nav>
      <button @click="toPage('/')">Login</button>
      <button @click="toPage('/register')">Register</button>
    </nav>
  </header>
  <hr/>

  <RouterView/>
</template>

<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'

const router = useRouter();

const toPage = (url: string) => {
  // 字符串形式
  // router.push(url);

  // 对象形式
  router.push({
    path: url
  });
};
</script>
```

## 历史记录

第一种方式，使用`RouterLink`添加`replace`属性，就会不记录“历史”：

```text
<RouterLink replace :to="{name:'Login'}">Home</RouterLink>
<RouterLink replace :to="{name:'Register'}">About</RouterLink>
```

在编程式导航中，将`push`方法变成`replace`方法，就可以不记录“历史”。

## 路由传参

File: `src/views/list.json`

```text
{
  "data":[
    {
      "id": 1,
      "name": "方便面",
      "price": 200
    },
    {
      "id": 2,
      "name": "矿泉水",
      "price": 300
    },
    {
      "id": 3,
      "name": "面包",
      "price": 500
    }
  ]
}
```

### query

File: `src/views/login.vue` （传递数据）

```text
<template>
  <div>登录页面</div>
  <table>
    <thead>
    <tr>
      <th>商品</th>
      <th>价格</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr :key="item.id" v-for="item in data">
      <td>{{item.name}}</td>
      <td>{{item.price}}</td>
      <td><button @click="toDetail(item)">详情</button></td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import {data} from './list.json';
import {useRouter} from 'vue-router';

const router = useRouter();

interface Product {
  id: number;
  name: string;
  price: number;
}

const toDetail = (item: Product) => {
  router.push({
    path: '/register',
    query: {...item}
  });
};
</script>
```

File: `src/views/register.vue` （接收数据）

```text
<template>
  <div>注册页面</div>
  <button @click="router.back()">返回</button>
  <p>ID: {{route.query.id}}</p>
  <p>商品: {{route.query.name}}</p>
  <p>价格: {{route.query.price}}</p>
</template>

<script setup lang="ts">
// 注意：获取传递过来的值useRoute（没有r）
import {useRoute, useRouter} from 'vue-router'

const route = useRoute();

const router = useRouter();
</script>
```

### params传参

File: `src/views/login.vue` （传递数据）

```text
<template>
  <div>登录页面</div>
  <table>
    <thead>
    <tr>
      <th>商品</th>
      <th>价格</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr :key="item.id" v-for="item in data">
      <td>{{item.name}}</td>
      <td>{{item.price}}</td>
      <td><button @click="toDetail(item)">详情</button></td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import {data} from './list.json';
import {useRouter} from 'vue-router'

const router = useRouter();

interface Product {
  id: number;
  name: string;
  price: number;
}

const toDetail = (item: Product) => {
  router.push({
    name: 'Register', // 注意这里使用name，不能使用path
    // path: '/register',
    params: {...item} // 注意，这里替换成了params参数
  });
};
</script>
```

如果使用`path`，会出现如下提示，并且传值不成功：

```text
vue-router.mjs:35 [Vue Router warn]: Path "/register" was passed with params but they will be ignored. Use a named route alongside params instead.
```

解决方法：使用`name`就可以了。

File: `src/views/register.vue` （接收数据）

```text
<template>
  <div>注册页面</div>
  <button @click="router.back()">返回</button>
  <p>ID: {{route.params.id}}</p>
  <p>商品: {{route.params.name}}</p>
  <p>价格: {{route.params.price}}</p>
</template>

<script setup lang="ts">
// 注意：获取传递过来的值useRoute（没有r）
import {useRoute, useRouter} from 'vue-router'

const route = useRoute();

const router = useRouter();
</script>
```

### 动态路由参数

File: `src/router/index.ts` （注意`/register/:id`）

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/register/:id', //注意，这里添加了:id
        name: 'Register',
        component: () => import('@/views/register.vue')
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

File: `src/views/login.vue`

```text
<template>
  <div>登录页面</div>
  <table>
    <thead>
    <tr>
      <th>商品</th>
      <th>价格</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr :key="item.id" v-for="item in data">
      <td>{{item.name}}</td>
      <td>{{item.price}}</td>
      <td><button @click="toDetail(item)">详情</button></td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import {data} from './list.json';
import {useRouter} from 'vue-router'

const router = useRouter();

interface Product {
  id: number;
  name: string;
  price: number;
}

const toDetail = (item: Product) => {
  router.push({
    name: 'Register', // 注意这里使用name，不能使用path
    // path: '/register',
    params: {...item} // 注意，这里替换成了params参数
  });
};
</script>
```

File: `src/views/register.vue`

```text
<template>
  <div>注册页面</div>
  <button @click="router.back()">返回</button>
  <p>ID: {{route.params.id}}</p>
  <p>商品: {{route.params.name}}</p>
  <p>价格: {{route.params.price}}</p>
</template>

<script setup lang="ts">
// 注意：获取传递过来的值useRoute（没有r）
import {useRoute, useRouter} from 'vue-router'

const route = useRoute();

const router = useRouter();
</script>
```

## 嵌套路由

File: `src/components/footer.vue`

```text
<template>
  <div>
    <RouterView/>
    <hr/>
    <h1>我是父路由</h1>
  </div>
</template>

<script setup lang="ts"></script>
```

File: `src/router/index.ts`

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/components/footer.vue'), // 注意，这里使用了footer.vue
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('@/views/login.vue'),
            },
            {
                path: 'register', //注意，这里添加了:id
                name: 'Register',
                component: () => import('@/views/register.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

## 命名视图

File: `src/router/index.ts`

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/components/root.vue'),
        children: [
            {
                path: 'user1',
                components: {
                    default: () => import('@/components/A.vue')
                },
            },
            {
                path: 'user2',
                components: {
                    bbb: () => import('@/components/B.vue'),
                    ccc: () => import('@/components/C.vue')
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

File: `src/components/root.vue`

```text
<template>
  <div>
    <RouterLink to="/user1">User1</RouterLink>
    <RouterLink to="/user2">User2</RouterLink>
    <br/>
    <RouterView/>
    <RouterView name="bbb"/>
    <RouterView name="ccc"/>
  </div>
</template>

<script setup lang="ts"></script>
```

File: `src/components/A.vue`

```text
<template>
  <h1>A.vue</h1>
</template>

<script setup lang="ts"></script>
```

## 重定向

File: `src/router/index.ts`

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        // redirect: '/user1', // 如果访问"/"，会重定向到"/user1"
        // redirect: {
        //     path: '/user1'
        // },
        // redirect: to => {
        //     console.log('@to', to);
        //     return '/user1';
        // },
        redirect: to => {
            return {
                path: '/user1',
                query: {
                    id: 1,
                    name: 'liusen'
                }
            };
        },
        component: () => import('@/components/root.vue'),
        children: [
            {
                path: 'user1',
                components: {
                    default: () => import('@/components/A.vue')
                },
            },
            {
                path: 'user2',
                components: {
                    bbb: () => import('@/components/B.vue'),
                    ccc: () => import('@/components/C.vue')
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

## 别名

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        alias: ['/root', '/home', '/index'], // 这里使用了alias
        component: () => import('@/components/root.vue'),
        children: [
            {
                path: 'user1',
                components: {
                    default: () => import('@/components/A.vue')
                },
            },
            {
                path: 'user2',
                components: {
                    bbb: () => import('@/components/B.vue'),
                    ccc: () => import('@/components/C.vue')
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

## 导航守卫

安装ElementUI:

```text
npm install element-plus --save
```

### 全局前置守卫

File: `src/main.ts`

```text
import { createApp } from 'vue'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App);

app.use(router);
app.use(ElementUI);

app.mount('#app');
```

```text
type Form = {
    user: string,
    password: string
}

type Rules = {
    [K in keyof Form]?: Array<FormItemRule>
}

const formInline = reactive<Form>({
    user: '',
    password: ''
});

const rules = reactive<Rules>({
    user: [
        {
            required: true,
            message: "请输入账号",
            type: "string"
        }
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            type: "string"
        }
    ]
});

const onSubmit = () => {
    form.value?.validate((flag) => {
        console.log(flag);
        if(flag) {
            router.push('/index');
            localStorage.setItem('token', '1');
        }
        else {
        }
    });
};
```

### 全局后置守卫

使用场景：一般可以用来做loadingBar

也可以注册全局后置钩子，然后和前置守卫不同的是，这些钩子不会接受next函数，也不会改变导航本身：

```text

```

计时器一直是Javascript动画的核心技术，而编写动画循环的关键是要知道延迟时间多长合适。
一方面，循环间隔必须足够短，这样才能让不同的动画效果显得平滑流畅；
另一方面，循环间隔还要足够长，这样才能确保浏览器有能力渲染产生的变化。

大多数电脑显示器的刷新频率是60Hz，大概相当于每秒重绘60次。
大多数浏览器会对重绘操作加以限制，不超过显示器的重绘频率。
因为即使超过那个频率，用户体验也不会有提升，因此，最平滑动画的最佳循环间隔是1000ms/16，约等于16.6ms。

但是，`setTimeout`和`setInterval`的问题是，它们都不精准。
它们的内在运行机制决定了时间间隔参数，只是指定了把动画代码添加到浏览器UI线程队列中以等待执行的时间。
如果队列前面已经加入了其它任务，那动画代码就要等前面的任务完成后再执行。

`requestAnimationFrame`采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；
也不会因为间隔时间太长，使动画效果不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，
提高系统性能，改善视觉效果。

File: `src/main.ts`

```text
import {createApp, createVNode, render} from 'vue'
import {createPinia} from 'pinia'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import loadingBar from './components/loadingBar.vue'

import './assets/main.css'

const Vnode = createVNode(loadingBar);
render(Vnode, document.body);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementUI);

const whiteList = ['/', '/login'];
router.beforeEach((to, from, next) => {
    Vnode.component?.exposed?.startLoading();
    let token = localStorage.getItem('token');
    // 白名单有值，或者登录过存储了token，可以跳转；否则，就去登录页面。
    if (whiteList.includes(to.path) || token) {
        next();
    } else {
        // next('/');
        next({
            path: '/'
        });
    }
});

router.afterEach((to, from) => {
    Vnode.component?.exposed?.endLoading();
});

app.mount('#app');
```

## 路由元信息

通过路由记录的`meta`属性可以定义路由的**元信息**。
使用路由元信息可以在路由中添加自定义的数据，例如：

- 权限验证标识
- 路由组件的过滤名称
- 路由组件持久化缓存（keep-alive）的相关配置
- 标题名称

我们可以在**导航守卫**或者是**路由对象**中访问路由的元信息数据：

File: `src/router/index.ts`

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string;
    }
}

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/login.vue'),
        meta: {
            title: '登录页面'
        }
    },
    {
        path: '/index',
        component: () => import('@/views/index.vue'),
        meta: {
            title: '首页'
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

```text
const whiteList = ['/', '/login'];
router.beforeEach((to, from, next) => {
    // 这里获取元数据title
    document.title = to.meta.title;
    let token = localStorage.getItem('token');
    // 白名单有值，或者登录过存储了token，可以跳转；否则，就去登录页面。
    if (whiteList.includes(to.path) || token) {
        next();
    } else {
        // next('/');
        next({
            path: '/'
        });
    }
});
```

## 路由过渡动画效果

如果想在路径组件上使用转场，并对导航进行动画处理，需要使用[`v-slot API`](https://router.vuejs.org/zh/api/#router-link-%E7%9A%84-v-slot)：

```text
<route-view #default="{route, Component}">
    <transition :enter-active-class="`animate__animated ${route.meta.transition}`">
        <component :is="Component"></component>
    </transition>
</route-view>
```

上面的用法会对所有的路由使用相同的过渡。

如果想让每个路由组件有不同的过渡，可以将“元信息”和动态的`name`结合在一起，放在`<transition>`上：

```text
npm install animate.css --save
```

- [animate.style](https://animate.style/)

File: `src/router/index.ts`

```text
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string;
        transition: string;
    }
}

const myRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/login.vue'),
        meta: {
            title: '登录页面',
            transition: 'animate_fadeIn'
        }
    },
    {
        path: '/index',
        component: () => import('@/views/index.vue'),
        meta: {
            title: '首页',
            transition: 'animate_bounceIn'
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: myRoutes
})

export default router;
```

```text
  <RouterView #defaul="{route, Component}">
    <transition :enter-active-class="`animate__animated ${route.meta.transition}`">
      <component :is="Component"></component>
    </transition>
  </RouterView>
```

File: `src/App.vue`

```text
<template>
  <header>
    <h1>App.vue</h1>
  </header>
  <hr/>

  <RouterView #defaul="{route, Component}">
    <transition :enter-active-class="`animate__animated ${route.meta.transition}`">
      <component :is="Component"></component>
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
// 注意：需要引用
import 'animate.css'
import {RouterView, useRoute} from 'vue-router'

const route = useRoute();
</script>
```

## 滚动行为

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。
`vue-router`可以自定义路由切换时页面如何滚动。

## 动态路由

我们一般使用动态路由都是后台会返回一个路由表，前端通过调用接口拿到后处理（后端处理路由）

主要使用的方法就是`router.addRoute`。

动态路由，主要通过两个函数实现：`router.addRoute()`和`router.removeRoute()`。
它们只注册一个新的路由

### 添加路由

### 删除路由



## Reference

- [小满vue3-Router4视频](https://www.bilibili.com/video/BV1oL411P7JX)
- [小满Router文章](https://blog.csdn.net/qq1195566313/category_11696205.html)

