---
title: "ByteBuddy"
sequence: "101"
---



## 方法分类

在 `ByteBuddy` 类当中，我们可以将方法分成两种类型：第一种类型，是配置 ByteBuddy 环境的方法；第二种类型，是生成 `.class` 文件的方法。

一般情况下，**默认配置**，可以满足我们的使用；只有特殊情况下，可能需要进行配置。所以，我们可以重点关注第二种类型的方法。

```text
                            ┌─── with()
             ┌─── config ───┤
             │              └─── ignore()
             │
             │                                 ┌─── subclass()
             │                                 │
             │              ┌─── class ────────┼─── redefine()
ByteBuddy ───┤              │                  │
             │              │                  └─── rebase()
             │              │
             │              ├─── interface ────┼─── makeInterface()
             │              │
             │              ├─── record ───────┼─── makeRecord()
             │              │
             └─── type ─────┼─── annotation ───┼─── makeAnnotation()
                            │
                            ├─── enum ─────────┼─── makeEnumeration()
                            │
                            │                  ┌─── makePackage()
                            ├─── package ──────┤
                            │                  └─── rebase()
                            │
                            └─── special ──────┼─── decorate()
```

