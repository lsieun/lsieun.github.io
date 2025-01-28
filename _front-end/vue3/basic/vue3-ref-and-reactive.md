---
title: "ref和reactive函数"
sequence: "202"
---

## ref函数

作用：定义一个响应式的数据

语法：

```text
const xxx = ref(initValue)
```

- 创建一个包含响应数据的**引用对象**（reference对象）
- JS中操作数据：`xxx.value`
- 模板中读取数据：不需要`.value`，直接

{% highlight text %}
{% raw %}
<div>{{xxx}}</div>
{% endraw %}
{% endhighlight %}

备注：

- 接收的数据可以是：基本类型，也可以是对象类型
- **基本类型**的数据：响应式依然是靠`Object.defineProperty()`的`get`与`set`完成的。
- **对象类型**的数据：内部“求助”了Vue 3.0中的一个新函数——`reactive`函数。

```text
ref(对象类型) --> reactive函数 --> ES6的Proxy
```

## reactive函数

作用：定义一个**对象类型**的响应式数据（**基本类型**别用它，用`ref`函数）

语法：

```text
const 代理对象 = reactive(被代理对象)
```

接收一个对象（或数组），返回一个**代码器对象**（proxy对象）

reactive定义的响应式数据是“深层次”的。

内部基于ES6的Proxy实现，通过**代理对象**操作**源对象**内部数据都是响应式的。

## Vue3.0中的响应式原理

### Vue2.x的响应式

实现原理：

- 对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）。
- 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

```text
Object.defineProperty(data, 'count', {
    get() {},
    set() {}
});
```

存在问题：

- 新增属性、删除属性，界面不会更新。
- 直接通过下标修改数组，界面不会自动更新。

### Vue3.0的响应式

实现原理：

- 通过Proxy（代理）：拦截对象中任意属性的变化，包括属性值的读写、属性的添加、属性的删除等。
- 通过Reflect（反射）：对被源对象的属性进行操作。

MDN文档中描述的Proxy与Reflect：

- Proxy: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
- Reflect: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

```text
const proxy = new Proxy(data, {
    // 拦截读取属性值
    get(target, prop) {
        return Reflect.get(target, prop);
    },
    // 拦截设置属性值或添加新属性
    set(target, prop, value) {
        return Reflect.set(target, prop, value);
    },
    // 拦截删除属性
    deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
});

proxy.name = 'tom';
```

## reactive对比ref

从定义数据角度对比：**数据类型**

- `ref`用来定义：基本类型的数据。
- `reactive`用来定义：对象（或数组）类型的数据
- 备注：`ref`也可以用来定义**对象（或数组）类型数据**，它内部会自动通过`reactive`转为**代理对象**。

从原理角度对比：**底层实现**

- `ref`通过`Object.defineProperty()`的`get`与`set`来实现响应式（数据劫持）
- `reactive`通过使用`Proxy`来实现响应式（数据劫持），并通过`Reflect`操作**源对象**内部的数据。

从使用角度对比：**如何使用**

- `ref`定义的数据：操作（写入）数据时，需要`.value`；读取数据时，在模板中直接读取，不需要`.value`。
- `reactive`定义的数据：操作数据与读取数据，均不需要`.value`。

```text
底层实现 ---> 定义（数据类型） ---> 如何使用
```

## Reference

- [ref函数](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=142)
