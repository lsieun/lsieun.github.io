---
title: "模块化"
sequence: "203"
---

## 模块化的基本概念

### 什么是模块化

模块化，是指解决一个复杂问题时，自顶向下逐层把系统划分成若干模块的过程。

对于整个系统来说，模块是可组合、分解和更换的单元。

### 模块化的好处

把代码进行模块化拆分的好处：

- 提高代码的**复用性**
- 提高代码的**可维护性**
- 实现**按需加载**

### 模块化规范

模块化规范，就是对代码进行模块化的拆分与组合时，需要遵守的那些规则。

例如：

- 使用什么样的语法格式来**引用模块**
- 在模块中使用什么样的语法格式**向外暴露成员**

模块化规范的好处：大家都遵守同样的模块化规范写代码，降低了沟通的成本，极大方便了各模块之间的相互调用。

## Node.js中的模块化

### Node.js中模块的三大分类

Node.js中根据模块来源的不同，将模块分为了3大类，分别是：

- **内置模块**，是由Node.js官方提供的，例如fs、path、http等
- **自定义模块**，用户创建的每个`.js`文件，都是自定义模块
- **第三方模块**，由第三方开发出来的模块，并非官方提供的内置模块，也不是用户创建的自定义模块，**使用前需要先下载**

### 加载模块

使用强大的`require()`方法，可以加载需要的**内置模块**、**用户自定义模块**、**第三方模块**进行使用，例如

```text
// 1. 加载内置的fs模块
const fs = require('fs');

// 2. 加载用户的自定义模块
// 在使用require加载用户自定义模块时，可以省略.js的后缀
const custom = require('./custom.js')

// 3. 加载第三方模块
const moment = require('moment');
```

注意：使用`require()`方法加载其它模块时，会执行被加载模块中的代码。

### Node.js中的模块作用域

什么是**模块作用域**？

和函数作用域类似，在自定义模块中定义的变量、方法等成员，只能在当前模块中被访问，
这种模块级别的访问限制，叫作**模块作用域**。

模块作用域的好处：防止全局变量污染的问题。

### 向外共享模块作用域中的成员

#### module对象

在每个`.js`自定义模块中，都有一个module对象，它里面存储了当前模块相关的信息，打印如下：

```text
console.log(module);
```

### module.exports对象

在自定义模块中，可以使用`module.exports`对象，将模块内的成员共享出去，供外界使用。



在外界，用`require()`方法导入自定义模块时，得到的就是`module.exports`所指向的对象。

```text
// filename: m1.js
// 在自定义模块中，默认情况下，module.exports = {}

// 向module.exports对象上挂载username属性
module.exports.username = 'tomcat'

// 向module.exports对象上挂载sayHello方法
module.exports.sayHello = function() {
    console.log('Hello');
}
```

```text
const m = require('./m1.js');

console.log(m);
```

### 共享成员时的注意点

使用`require()`方法导入模块时，导入的结果，永远以`module.exports`指向的对象为准。

### exports对象

由于`module.exports`单词写起来比较复杂，为了简化向我共享成员的代码，
Node提供了`exports`对象。

在默认情况下，`exports`和`module.exports`指向同一个对象。
最终共享的结果，还是以`module.exports`指向的对象为准。

```text
console.log(exports);
console.log(module.exports);
console.log(exports === module.exports);
```

### exports和module.exports的使用误区

时刻觐记，`require()`模块时，得到的永远是`module.exports`指向的对象

注意：为了防止混乱，建议大家不要在同一个模块中同时使用`exports`和`module.exports`。

## CommonJS规定了哪些内容

Node.js中的模块化规范

Node.js遵循了CommonJS模块化规范，CommonJS规定了**模块的特性**和**各模块之间如何相互依赖**。

CommonJS规定：

- 每个模块内部，`module`变量代表当前模块。
- `module`变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。
- 加载某个模块，其实是加载该模块的`module.exports`属性。`require()`方法用于加载模块。

## npm管理包

## 模块的加载机制
