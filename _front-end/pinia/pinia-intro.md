---
title: "Pinia"
sequence: "201"
---

Pinna实现状态管理。

所谓“状态管理”，就是一个存储数据的地方。

`pinia`是`Vuex`的新版本。

> 与Vuex的关系

`Pinia`是`Vue`的存储库，它允许您跨组件/页面共享状态。


## 项目搭建

Vue3 + TS + Vite

执行命令：

```text
npm create vite@latest lsieun-vue3 --template vue-ts
```

运行项目：

```text
npm install
npm run dev
```

## pinia基础使用

### 安装pinia

我们想要使用pinia，需要先安装它。

安装命令：

```text
yarn add pinia
或使用npm
npm install pinia
```

安装完成后，我们需要将`pinia`挂载到`Vue`应用中。
也就是，我们需要创建一个根存储传递给应用程序。
简单来说，就是创建一个存储数据的数据桶，放到应用程序中去。

修改`main.ts`，引入`pinia`提供的`createPinia`方法，创建**根存储**。

修改前`main.ts`：

```text
// file: src/main.ts

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

修改后`main.ts`：

```text
// file: src/main.ts

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App);
app.use(pinia); // 使用插件
app.mount('#app');
```

### 创建store

简单来说，`store`就是数据仓库，我们的数据都放在`store`里面。
当然，我们可以将它理解为一个公共组件，只不过该公共组件只存放数据，这些数据我们其它所有的组件都能够访问且可以修改。

我们需要使用`pinia`提供的`defineStore()`方法来创建一个`store`，该`store`用来存放我们需要全局使用的数据。

首先，在项目`src`下新建`store`文件夹，用来存放我们创建的各种`store`，然后在该目录下新建`user.ts`文件，主要用来存放与`user`相关的`store`。

```text
// file: src/store/user.ts

import { defineStore } from 'pinia'

// 第一个参数是应用程序中store的唯一ID
export const useUserStore = defineStore('users', {
    // 其它配置项
});
```

创建`store`很简单，调用`pina`中的`defineStore()`方法即可，该函数接收两个参数：

- `name`：一个字符串，必传项，该`store`的唯一ID
- `options`：一个对象，`store`的配置项，比如配置`store`内的数据，修改数据的方法等等。

我们可以定义任意数量的`store`，因为一个`store`就是一个函数，这也是`pinia`的好处之一，让我们的代码扁平化，这和`Vue3`的实现思路是一样的。

### 使用store

前面我们创建了一个`store`，说白了就是创建了一个方法，那么我们的目的肯定是使用它。
假如我们要在`App.vue`里面使用它，该如何使用呢？

代码如下：

```text
// file: src/App.vue

<template>
  <div>
    <h1>Hello Pinia</h1>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from './store/user'
const store = useUserStore();
console.log('@store', store);
</script>
```

使用`store`很简单，直接引入我们声明的`useUserStore`方法即可。
我们可以使用`console.log()`输出一下它的内容，重点关注它的`[[Target]]`里的`$id`和`$state`。

### 添加state

我们都知道`store`是用来存放公共数据的，那么数据具体存储在哪里呢？

在前面的内容中，我们利用`defineStore`函数创建了一个`store`，该函数的第二个参数是一个`options`配置项，
我们需要存放的数据就放在`options`上的`state`属性内。

假设我们往`store`添加一些任务基本数据，修改`user.ts`代码：

```text
// file: src/store/user.ts

import { defineStore } from 'pinia'

// 第一个参数是应用程序中store的唯一ID
export const useUserStore = defineStore('users', {
    state: () => {
        return {
            name: "万匹丝",
            age: 10,
            sex: "男"
        };
    }
});
```

在上面的代码中，我们给`options`配置项添加了`state`属性，该属性就是用来存储数据的。
我们往`state`中添加了3条数据。

需要注意的是，**`state`接收的是一个箭头函数返回的值，它不能直接接收一个对象**。

### 操作state

我们往`store`存储数据的目的就是为了操作它，那么我们接下来就尝试操作`state`中的数据。

#### 读取state数据

读取`state`数据很简单。

首先，还是使用`console.log()`的方式，查看`store`中的数据，重点关注`[[Target]]`：

- 多个3个字段：`name`， `age`和`sex`
- `$state`发生变化

```text
// file: src/App.vue

<script setup lang="ts">
import { useUserStore } from './store/user'
const store = useUserStore();
console.log('@store', store);
</script>
```

接着，修改`App.vue`文件：

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useUserStore} from './store/user'

const store = useUserStore();
console.log('@store', store);

const name = ref<string>(store.name);
const age = ref<number>(store.age);
const sex = ref<string>(store.sex);
</script>
```

我们可以使用解构的方式，让代码更简洁一点：

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from './store/user'

const store = useUserStore();
console.log('@store', store);

// 这里使用解构
const {name, age, sex } = store;
</script>
```

上段代码实现的效果与一个一个获取的效果一样，不过代码简洁了很多。

#### 多个组件使用state

我们使用`store`的最重要的目的就是为了组件之间共享数据，那么接下来我们新建一个`child.vue`组件，在该组件内部也使用`state`数据。

`src/components/Child.vue`代码如下：

```text
<template>
  <div>
    <h1>Child组件</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from '../store/user'

const store = useUserStore();
console.log('@store', store);

const {name, age, sex} = store;
</script>
```

`src/App.vue`代码如下：

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <Child/>
  </div>
</template>

<script setup lang="ts">
import Child from './components/Child.vue'
</script>
```

#### 修改state数据

如果我们想要修改`store`中的数据，可以直接重新赋值即可。
我们在`App.vue`里面添加一个按钮，点击按钮修改`store`中的某一个数据。

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <button @click="changeName">更改姓名</button>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = store;

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};
</script>
```

我们可以看到`store`中的`name`确实被修改了，但是页面上似乎没有变化，这说明我们使用的`name`不是响应式的。

其实，`pinia`提供了方法给我们，让我们得到`name`等属性变成响应式，我们重新修改代码。

```text
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);
```

我们利用`pinia`的`storeToRefs`函数，将`state`中的数据变为了响应式的。

完整代码：

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <button @click="changeName">更改姓名</button>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};
</script>
```

#### 重置state

有时候，我们修改了`state`数据，想将它还原，这个时候该怎么做呢？
就比如，用户填写了一部分表单，突然想重置为最初始的状态。

此时，我们直接调用`store`的`$reset()`方法即可：

```text
<button @click="resetStore">重置</button>

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}
```

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <button @click="changeName">更改姓名</button>
    <button @click="resetStore">重置</button>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}
</script>
```

当我们点击重置按钮时，`store`中的数据会变为初始状态，页面也会更新。

#### 批量更改state数据

在前面的内容，我们修改`state`的数据都是一条一条修改，比如`store.name="张三"`。
如果我们一次性需要修改很多条数据的话，有更加简便的方法，使用`store.$patch()`方法修改`App.vue`代码，添加一个批量更改数据的方法。

```text
<button @click="patchStore">批量修改数据</button>

const patchStore = () => {
  store.$patch({
    name: "张三",
    age: 20,
    sex: "女"
  });
};
```

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <button @click="changeName">更改姓名</button>
    <button @click="resetStore">重置</button>
    <button @click="patchStore">批量修改数据</button>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}

const patchStore = () => {
  store.$patch({
    name: "张三",
    age: 20,
    sex: "女"
  });
};
</script>
```

我们采用这种批量更改的方式似乎代价有一点大：假如我们`state`中有些字段无需更改，但是按照上段代码的写法，
我们必须要将`state`的所有字段列举出来。

为了解决这个问题，`pinia`提供的`$patch`方法还可以接收一个回调函数，它的用法有点像我们的数组循环回调函数：

#### 直接替换整个state

`pinia`提供了方法让我们直接替换整个`state`对象，使用`store.$state()`方法。

### getter属性

`getters`是`defineStore`参数配置项里面的另一个属性。
前面，我们讲了`state`属性。
`getters`属性值是一个对象，该对象里面是各种各样的方法。大家可以把`getter`想像成`Vue`中的计算属性，它的作用就是返回一个新的结果，
既然它和`Vue`中的计算属性类型，那么它肯定也是会被缓存的，就和`computed`一样。

当然，我们这里的`getters`就是处理`state`数据。

#### 添加getter

我们先来看一下如何定义`getters`：

```text
// file: src/store/user.ts

import { defineStore } from 'pinia'

// 第一个参数是应用程序中store的唯一ID
export const useUserStore = defineStore('users', {
    state: () => {
        return {
            name: "万匹丝",
            age: 10,
            sex: "男"
        };
    },
    getters: {
        getAddedAge: (state) => {
            return state.age + 100
        }
    }
});
```

在上面的代码中，我们在配置项参数中添加了`getter`属性，该属性对象中定义了一个`getAddedAge`方法，
该方法会默认接收一个`state`参数，也就是`state`对象，然后该方法返回一个新的数据。

#### 使用getter

我们在`store`中定义了`getter`，那么在组件中如何使用呢？使用起来非常简单，我们修改`App.vue`：

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <p>Added Age：{{ store.getAddedAge }}</p>
    <button @click="changeName">更改姓名</button><br/>
    <button @click="resetStore">重置</button><br/>
    <button @click="patchStore">批量修改数据</button><br/>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}

const patchStore = () => {
  store.$patch({
    name: "张三",
    age: 20,
    sex: "女"
  });
};
</script>
```

```text
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <p>Added Age：{{ getAddedAge }}</p>
    <button @click="changeName">更改姓名</button><br/>
    <button @click="resetStore">重置</button><br/>
    <button @click="patchStore">批量修改数据</button><br/>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex, getAddedAge} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}

const patchStore = () => {
  store.$patch({
    name: "张三",
    age: 20,
    sex: "女"
  });
};
</script>
```

#### getter中调用其它getter

有的时候，我们需要在一个getter方法中调用其它getter方法，这个时候如何调用呢？

我们可以直接在getter方法中调用`this`，`this`指向的便是`store`实例。

```text
import { defineStore } from 'pinia'

// 第一个参数是应用程序中store的唯一ID
export const useUserStore = defineStore('users', {
    state: () => {
        return {
            name: "万匹丝",
            age: 10,
            sex: "男"
        };
    },
    getters: {
        getAddedAge: (state) => {
            return state.age + 100
        },
        getNameAndAge(): string { // 注意，这里没有使用箭头函数，那样的话，拿到的this就不是state了
            return this.name + this.getAddedAge; // 调用其它getter
        }
    }
});
```

#### getter传参

既然getter函数做了一些计算或者处理，那么我们可能会需要传递参数给getter函数，
但是我们前面说getter函数相当于store的计算属性（computed），和`Vue`的计算属性差不多，
那么我们都知道`Vue`中计算属性是不能直接传递参数的，所以我们这里如果需要接受参数的话，也是需要处理的。

```text
// file: src/store/user.ts

import { defineStore } from 'pinia'

// 第一个参数是应用程序中store的唯一ID
export const useUserStore = defineStore('users', {
    state: () => {
        return {
            name: "万匹丝",
            age: 10,
            sex: "男"
        };
    },
    getters: {
        getAddedAge: (state) => {
            return (num: number) => state.age + num;
        },
        getNameAndAge(): string {
            return this.name + this.getAddedAge; // 调用其它getter
        }
    }
});
```

上面代码中，我们的getter函数`getAddedAge`接收了一个参数`num`，这种写法其实有点闭包的概念在里面了，相当于我们整体返回了一个新的函数，并且
将`state`传入了新的函数。

{% highlight text %}
{% raw %}
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <p>Added Age：{{ store.getAddedAge(50) }}</p>
    <button @click="changeName">更改姓名</button><br/>
    <button @click="resetStore">重置</button><br/>
    <button @click="patchStore">批量修改数据</button><br/>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}

const patchStore = () => {
  store.$patch({
    name: "张三",
    age: 20,
    sex: "女"
  });
};
</script>
{% endraw %}
{% endhighlight %}

### actions属性

前面，我们提到的`state`和`getters`属性都主要是数据层面的，并没有具体的业务逻辑代码，
它们两个就和我们组件代码中的`data`数据和`computed`计算属性一样。

那么，如果我们有业务代码的话，最好就是写在`actions`属性里面，该属性就和我们组件代码中的`methods`相似，
用来放置一些处理业务逻辑的方法。

`actions`属性值，同样是一个对象，该对象里面也是存储的各种各样的方法，包括同步方法和异步方法。

#### 添加action

我们可以尝试着添加一个`actions`方法：

```text
import { defineStore } from 'pinia'

// 第一个参数是应用程序中store的唯一ID
export const useUserStore = defineStore('users', {
    state: () => {
        return {
            name: "万匹丝",
            age: 10,
            sex: "男"
        };
    },
    getters: {
        getAddedAge: (state) => {
            return (num: number) => state.age + num;
        },
        getNameAndAge(): string {
            return this.name + this.getAddedAge; // 调用其它getter
        }
    },
    actions: {
        saveName(name: string) {
            this.name = name;
        }
    }
});
```

上面代码中，我们定义了一个非常简单的action方法。
在实际场景中，该方法可以任何逻辑，比如发送请求、存储token等。
大家把`actions`当作一个普通的方法即可，特殊之处在于该方法内部的`this`指向的是当前`store`。



#### 使用action

使用`actions`中的方法也非常简单，比如我们在`App.vue`中想调用该方法：

{% highlight text %}
{% raw %}
<template>
  <div>
    <h1>Hello Pinia</h1>
    <p>姓名：{{ name }}</p>
    <p>年龄：{{ age }}</p>
    <p>性别：{{ sex }}</p>
    <p>Added Age：{{ store.getAddedAge(50) }}</p>
    <button @click="changeName">更改姓名</button><br/>
    <button @click="resetStore">重置</button><br/>
    <button @click="patchStore">批量修改数据</button><br/>
    <button @click="saveName()">修改名字</button><br/>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from './store/user'

const store = useUserStore();
const {name, age, sex} = storeToRefs(store);

const changeName = () => {
  store.name = "张三";
  console.log('@store', store);
};

const resetStore = () => {
  store.$reset();
  console.log('@resetStore', store);
}

const patchStore = () => {
  store.$patch({
    name: "张三",
    age: 20,
    sex: "女"
  });
};

const saveName = () => {
  store.saveName("李四");
};
</script>
{% endraw %}
{% endhighlight %}

## Reference

- [Pinia 中文文档](https://pinia.web3doc.top/)
- [Pinia基础入门教程](https://www.bilibili.com/video/BV1rv4y1M7qo)
- [大菠萝！这一次彻底搞懂Pinia！](https://juejin.cn/post/7112691686085492767)
- [Pinia简介和开发环境搭建](https://www.bilibili.com/video/BV1oP4y1w7pz)


pinia-plugin-persist

- [pinia-plugin-persist](https://seb-l.github.io/pinia-plugin-persist/)
- [pinia 数据持久化插件 pinia-plugin-persist](https://www.jianshu.com/p/4f6eaeffb31f)
