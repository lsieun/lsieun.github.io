---
title: "Behavior Parameterization"
sequence: "105"
---

## Behavior Parameterization

```text
Behavior Parameterization = Functional Interface + Lambda/Method Reference
```

我希望，能够使用 Behavior Parameterization 来这里涉及的概念“统驭”起来，
也就是将 Functional Interface、Lambda、Method Reference 归并为一个完整的概念。

```text
                                                          ┌─── Lambda Expression
Behavior Parameterization ───┼─── Functional Interface ───┤
                                                          └─── Method Reference
```

Lambda 和 Method Reference 都是属于 Behavior Parameterization 的范围。

## Type 和 Value

```text
int i = 100;
```

其中，`int` 是 Type，是装数据的“容器”，而 100 是 Value，是真正的“数据”；
这表达了 Type 与 Value 之间的关系：Type 是“容器”，Value 是“数据”。

```text
将 Value 装载到 Type 这个容器当中：
Type <-- Value
```

那么，把 Type 和 Value 的概念应用到 Behavior Parameterization 上来说，
Lambda 和 Method Reference 表示的只是 Value，而 Functional Interface 表示的是 Type。

## Behavior Parameterization VS Type Parameterization

Behavior Parameterization 是将 Code（Behavior）进行参数化，
而 Type Parameterization（Generics，泛型）是将 Type 进行参数化。

## Lambda Vs Method Reference

```text
Lambda = anonymous functions
Method Reference = named functions
```
