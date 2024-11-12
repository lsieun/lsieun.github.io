---
title: "学习代码"
sequence: "103"
---

## 依赖

```text
box-drawing
```

```text
$ git clone https://github.com/lsieun/box-drawing
```

## 代码目录结构

```text
run
├─── buddy --> 使用 ByteBuddy 生成类
│    ├─── basic
│    │    ├─── HelloWorldAnalysis.java   --> 分析（从1到0）
│    │    ├─── HelloWorldGenerate.java   --> 生成（从0到1）--> 生成类、接口、枚举、注解
│    │    └─── HelloWorldTransform.java  --> 转换（从1到1）
│    ├─── common
│    │    ├─── HelloWorldRebase.java     --> Transform
│    │    ├─── HelloWorldRedefine.java   --> Transform
│    │    └─── HelloWorldSubClass.java   --> Generate --> 生成类
│    └─── runtime
│         └─── HelloWorldRuntime.java    --> 加载进当前JVM
└─── test --> 对生成的类的进行测试
     ├─── HelloWorldLoad.java            --> 将生成的类，加载进新的JVM
     ├─── HelloWorldRun.java             --> 将生成的类，加载进新的JVM，创建对象，并运行方法
     └─── HelloWorldSynthetic.java       --> 将生成的类，移除 synthetic 标识
```

```text
       ┌─── Generation ───────┼─── subclass
       │
       │                      ┌─── redefine
ASM ───┼─── Transformation ───┤
       │                      └─── rebase
       │
       └─── Analysis
```
