---
title: "Javascript Intro"
sequence: "202"
---

## 浏览器中的Javascript的组成部分

- 浏览器中的Javascript
  - JS核心语法
    - 变量、数据类型
    - 循环、分支、判断
    - 函数、作用域、this
    - etc...
  - WebAPI
    - DOM操作
    - BOM操作
    - 基于XMLHttpRequest的Ajax操作
    - etc...

## 为什么Javascript可以在浏览吕中被执行

在浏览器中有一个“JavaScript解析引擎”。

不同的浏览器，使用不同的“JavaScript解析引擎”：

- Chrome浏览器：V8
- Firefox浏览器：OdinMonkey（奥丁猴）
- Safari浏览器：JSCore
- IE：Chakra（查克拉）

其中，Chrome浏览器的V8解析引擎性能最好。

## 为什么Javascript可以操作DOM和BOM

每个浏览器**内置**了DOM、BOM这样的API函数，
因此，浏览器中的JavaScript才可以调用它们。

