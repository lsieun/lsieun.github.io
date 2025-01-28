---
title: "基于 XML 的 Spring 应用"
sequence: "101"
---

Spring 开发中主要是对 Bean 的配置，Bean 的常用配置一览如下：

- `<bean id="" class="">`：Bean 的 id 和全限定名配置
- `<bean name="">`：通过 name 设置 Bean 的别名，通过别名也能直接获取到 Bean 实例
- `<bean scope="">`：Bean 的作用范围，BeanFactory 作为容器时取值 singleton 和 prototype。
- `<bean lazy-init="">`：Bean 的实例化时机，是否延迟加载。BeanFactory 作为容器时无效。
- `<bean init-method="">`：Bean 实例化后自动执行的初始化方法，method 指定方法名。
- `<bean destroy-method="">`：Bean 实例销毁前的方法，method 指定方法名
- `<bean autowire="byType">`：设置自动注入模式，常用的有按照类型 `byType`，按照名字 `byName`
- `<bean factory-bean="" factory-method=""/>`：指定哪个工厂 Bean 的哪个方法完成 Bean 的创建


