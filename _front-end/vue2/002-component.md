---
title: "组件"
sequence: "202"
---

## 组件

组件的定义：实现应用中**局部**功能**代码**和**资源**的**集合**。

## 一个重要的内置关系

```html
<script type="text/javascript">
    Vue.config.productionTip = false;

    // 定义一个构造函数
    function Demo() {
        this.a = 1;
        this.b = 2;
    }
    
    // 创建一个Demo的实例对象
    const d = new Demo();
    
    // 这两者指向同一个原型对象
    console.log(Demo.prototype); // 显示原型属性
    console.log(d.__proto__);    // 隐式原型属性
    
    console.log(Demo.prototype === d.__proto__)
    
    // 程序员通过“显示原型属性”操作“原型对象”，追加一个x属性，值为99
    Demo.prototype.x = 99;
    
    console.log(d.__proto__.x)
    console.log(d.x)
</script>
```

- 一个重要的内置关系：`VueComponent.prototype.__proto__ === Vue.prototype`
- 为什么要有这个关系：让组件实例对象（`vc`）可以访问到Vue原型上的属性、方法。

## 单文件组件

```text
<template>
    <!-- 组件的结构 -->
</template>

<script>
    // 组件交互相互的代码（数据、方法等）
</script>

<style>
    /* 组件的样式 */
</style>
```
