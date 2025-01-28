---
title: "Groovy 简单语法"
sequence: "101"
---

在 IDEA 中，找到 `Tools` 菜单下的 `Groovy Console` 菜单项

## 打印

```groovy
println("Hello World");
```

```groovy
// Groovy 中可以省略最末尾的分号
println("Hello World")

// Groovy 中可以省略括号
println "Hello World"
```

## 定义变量

```groovy
// Groovy 中如何定义变量
// def 是弱类型的，Groovy 会自动根据情况给变量赋予对应的类型
def i = 100
println i
```

```groovy
def str = "Hello Groovy"
println str
```

```groovy
// 定义集合类型
def list = ['a', 'b']
// 往 list 中添加元素
list << 'c'
// 取出 list 中第三个元素
println list.get(2)
```

```groovy
// 定义一个 map
def map = ['key1': 'value1', 'key2': 'value2']
// 向 map 中添加键值对
map.key3 = 'value3'
// 打印出 key 的值
println map.get("key3")
println map.key3
```

