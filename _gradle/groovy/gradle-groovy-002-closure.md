---
title: "Groovy 闭包"
sequence: "102"
---

什么是闭包？闭包，其实就是一段代码块。在 Gradle 中，我们主要是把闭包当参数来使用。

```groovy
// 定义一个闭包
def b1 = {
    println "Hello b1"
}

// 定义个方法，方法里面需要闭包类型的参数
def method1(Closure closure) {
    closure();
}


// 调用方法 method1
method1(b1)
```

```groovy
// 定义一个闭包，还参数
def b2 = {
    v ->
    println "Hello ${v}"
}

// 定义个方法，方法里面需要闭包类型的参数
def method2(Closure closure) {
    closure("World");
}


// 调用方法 method2
method2(b2)
```
