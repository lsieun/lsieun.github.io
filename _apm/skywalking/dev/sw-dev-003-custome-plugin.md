---
title: "SkyWalking 自定义插件开发"
sequence: "103"
---

本篇主要介绍一些 SkyWalking-agent 中的基本概念然后介绍插件开发的一些规则，
主要包括 Span、Trace Segment、ContextCarrier、ContextSnapshot、ContextManager。
其中

- Span、Trace Segment是 trace 数据存储的核心；（线程内）
- ContextSnapshot 是 trace 数据在**线程间**传递的核心；（同一个进程，不同线程之间）
- ContextCarrier 是 trace 数据在**进程间**传递的核心；（不同进程）
- 
- ContextManager提供了对 Trace Segment、ContextCarrier、ContextSnapshot的相关操作。

掌握这些类的功能、作用有利于在工作中对skywalking进行二次开发、扩展。

## 思路

- 定义**拦截点**，通常是类的方法
- 定义**拦截器**，支持在拦截方法执行前后进行日志采集
- 定义**配置文件**，启用拦截点
- 编译打包，将生成的 jar 放到探针的 `skywalking-agent/plugins` 目录下

## 定义拦截点

### 官方提供的拦截点扩展入口

SkyWalking 提供了 2 种供扩展的拦截点：

- `ClassInstanceMethodsEnhancePluginDefine`：支持定义构造方法和实例方法的拦截点。
- `ClassStaticMethodsEnhancePluginDefine`：支持定义静态方法的拦截点。

当然还可以直接扩展 `ClassEnhancePluginDefine`，这个类是上面两个类的父类。这种方式较为麻烦，一般不推荐使用。

这里以拦截实例方法为例，继承 `ClassInstanceMethodsEnhancePluginDefine` 类。

### 类拦截规则

SkyWalking 提供了 4 种类拦截的规则：

- `byName`：类名匹配（包名+类名）
- `byClassAnnotationMatch`：类注解匹配
- `byMethodAnnotationMatch`：方法注解匹配
- `byHierarchyMatch`：父类或接口匹配

注意：

- 这里的匹配规则要用字符串，不要用类引用的方式（`byName(ThirdPartyClass.class.getName()`)），否则可能会导致探针异常。
- 注解匹配的方式，不支持继承的注解
- 父类或接口匹配的方法，尽量避免使用，否则可能会出现一些难以预料的问题

### 设置要拦截的类名

实现 `enhanceClass()` 方法，定义要拦截的类名，必须是全路径的名称，即包名+类名。

### 设置拦截的实例方法和拦截器的类名

实现 `getInstanceMethodsInterceptPoints()` 方法，定义要拦截的实例方法，以及对应拦截器的类名。拦截器类名也是包名+类名。

这里支持定义多个实例方法，每个实例方法可以使用不同的拦截器。还支持拦截私有方法（private）。

## 定义拦截器

### 三种常见的拦截器接口

- StaticMethodsAroundInterceptor：静态方法拦截器
- InstanceConstructorInterceptor：构造方法拦截器
- InstanceMethodsAroundInterceptor：实例方法拦截器

要拦截对应的方法，必须要实现对应的接口。这里以实现 `InstanceMethodsAroundInterceptor` 接口，拦截实例方法为例。

### 在方法执行前拦截

实现 `beforeMethod(EnhancedInstance, Method, Object[], Class<?>[], MethodInterceptResult)` 方法，
此方法会在被拦截的方法执行前执行。
此方法中一般是定义日志链路节点 span 对象，一个 span 对象对应着日志链路中的一个节点。

拦截方法参数说明：

- 1.EnhancedInstance objInst：被增强的实例，一般用不上
- 2.Method method：被拦截的方法
- 3.Object[] allArguments：被拦截方法的入参
- 4.Class<?>[] argumentsTypes：被拦截方法的入参的类型
- 5.MethodInterceptResult result：此参数可以作为被拦截方法的返回参数，如果给此参数赋值了，会阻断被拦截方法的执行，直接返回此参数。
  可以通过defineReturnValue()方法来定义要返回的数据。

链路节点对象 span 的类型：

- 节点对象都实现了 `AbstractSpan` 接口，可以借助 `ContextManager` 类来创建和获取节点对象。

创建一个 span 对象后，就会生成一个链路日志的节点。

```text
1.EntrySpan：入口层span，它会作为一条链路的起点。如接收Http请求的接口层、Dubbo服务的提供方以及MQ消费者。
2.LocalSpan：中间层span，它会出现在链路的中间节点上。如一个业务方法被调用。
3.ExitSpan：出口层span，它会作为一条链路的终点。如发送Http请求的工具、Dubbo服务的调用方以及MQ生产者。
```

链路节点对象 span 常用的设置项

```text
1.component：组件类型，比如说Tomcat、Dubbo、SpringMVC...可以从ComponentsDefine类中定义好的一些官方组件类型中选，
自定义的组件类型是无法在UI中显示出来的。也可以不设置值，默认会显示Unknown。（可选的类型就那么多，一般自定义时根本找不到合适的）。
2.layer：日志层级，可以从SpanLayer类中选择，一共就5个：DB、RPC_FRAMEWORK、HTTP、MQ和CACHE。
可选的也不多，不合适可以不设置，默认会显示Unknown。
3.tag：日志标签，支持自定义日志字段，可以通过 span.tag(new StringTag("msg"), msg) 的方式来设置。
结合后端配置项 core.default.searchableTracesTags可以达到自定义字段搜索的目的。
```

### 在方法执行后拦截

实现 `afterMethod(EnhancedInstance, Method, Object[], Class<?>[], Object)` 方法，此方法会在被拦截的方法执行前执行。
此方法中一般是将方法的返回数据记录到链路节点对象中。

拦截方法参数说明：

```text
前4个参数和beforeMethod()方法中一样，介绍下最后那个参数
Object ret：方法的返回数据
```

## Reference

- [skywalking01 - skywalking介绍](https://developer.aliyun.com/article/1252909)
- [skywalking02 - skywalking安装](https://developer.aliyun.com/article/1252910)
- [skywalking03 - skywalking入门使用](https://developer.aliyun.com/article/1252912)
- [skywalking04 - skywalking自定义链路追踪@Trace](https://developer.aliyun.com/article/1252913)
- [skywalking05 - skywalking探针插件开发](https://developer.aliyun.com/article/1252915)
- [skywalking06 - skywalking也可以作为日志中心收集日志了!](https://developer.aliyun.com/article/1252918)
- [skywalking07 - skywalking如何收集Controller的链路](https://developer.aliyun.com/article/1252936)
- [skywalking08 - 链路追踪tag查找配置(上)](https://developer.aliyun.com/article/1252938)
- [skywalking08 - 链路追踪tag查找配置(下)](https://developer.aliyun.com/article/1252939)
- [skywalking番外01 - 如何扩展%tid的logback占位符](https://developer.aliyun.com/article/1252920)


- [SkyWalking 源码--探针插件开发](https://blog.csdn.net/SO_zxn/article/details/127025911)
- [Skywalking插件开发Java agent](https://blog.csdn.net/weixin_42467874/article/details/127528921)
- [性能分析工具SkyWalking插件开发指南](https://insights.thoughtworks.cn/skywalking-plugin-guide/)
- [如何编写一个 SkyWalking 插件](https://cloud.tencent.com/developer/article/1749194?areaSource=102001.12&traceId=nBJ824eLrjhAjNdQFMWBH)
- [Skywalking 插件开发](http://www.icodebang.com/article/326981.html)
- [Skywalking 插件开发](https://shenyifengtk.github.io/2022/06/14/Skywalking-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91/)
- [插件开发指南](https://skyapm.github.io/document-cn-translation-of-skywalking/zh/6.1.0/guides/Java-Plugin-Development-Guide.html)
- [手把手教你编写Skywalking插件](https://segmentfault.com/a/1190000025172414?sort=newest)
- [Skywalking自定义增强插件开发](https://blog.csdn.net/gaoweijiegwj/article/details/113398719)



- wind-wound
  - [skywalking插件工作原理剖析](https://www.cnblogs.com/wind-wound/p/17275591.html)
  - [skywalking自定义插件开发](https://www.cnblogs.com/wind-wound/p/17275591.html)
