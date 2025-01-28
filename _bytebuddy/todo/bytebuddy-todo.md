三个应用场景：

- manually
- Java agent
- Build

## 思路

- [ ] 概念：
- [ ] 本质：
- [ ] 解读
    - [ ] API 如何使用，编写代码的思路是什么
    - [ ] 当前类它自身包含的方法、子类型有哪些
    - [ ] 表达形式
        - [ ] UML 表示
        - [ ] box-drawing
    - [ ] 注意事项是什么
- [ ] 学习
  - [ ] 快速开始
  - [ ] 普通场景
  - [ ] 特殊场景

- [x] MethodDescription
    - [x] CONSTRUCTOR_INTERNAL_NAME
    - [x] TYPE_INITIALIZER_INTERNAL_NAME
- [x] LoadedTypeInitializers
- [x] 项目目录介绍
- [x] 依赖 box-drawing-utils
- [x] isVisible 和 isAccessible()
- [x] 实现打印语句
- [x] net.bytebuddy.asm.Advice.WithCustomMapping
- [ ] Advice - Assigner
- [ ] InvokeDynamic
- [ ] 使用 ASM 自动生成 ByteBuddy 的代码
- [ ] AuxiliaryType
- [ ] Implementation
    - [ ] 有哪些子类
    - [ ] Implementation.Target 是什么？
    - [ ] SubclassImplementationTarget
    - [ ] RebaseImplementationTarget
- [ ] JavaConstant
- [ ] TypeProxy implements AuxiliaryType
- [ ] TypeResolutionStrategy <-- DynamicType.Builder
- [ ] TypeWriter
- [ ] DynamicType.Builder.make(TypeResolutionStrategy.Passive.INSTANCE)
- [ ] SubclassDynamicTypeBuilder
- [ ] net.bytebuddy.TypeCache
- [ ] net.bytebuddy.asm.MemberSubstitution
- [ ] net.bytebuddy.implementation.attribute.TypeAttributeAppender
- [ ] net.bytebuddy.implementation.attribute.FieldAttributeAppender
- [ ] net.bytebuddy.implementation.attribute.MethodAttributeAppender
- MethodGraph 和 MethodLocator
- MethodCall
- Agent 文章整理
- [x] 
- ClassLoadingStrategy.BOOTSTRAP_LOADER

简而言之，ByteBuddy，或者任何其它技术，都是“易于使用，难以精通”！

代码的编写，“流淌”着一种思路。

- 问题定位：
    - 字节码修改的问题
    - 后续处理：
        - 类加载的问题
- 本地有 `.class` 会先加载本地的 `.class` 文件
- 思考的思路是什么
- 听不懂，没有关系（一次听不懂，没有关系；我会再讲，逐渐熟悉）
- 有对 jdk 对象增强的例子吗？如：jdk.线程池
- 在应用的时候发现有的类在 onDiscovery 里监听到，但是 onTransformation 和 onIgnored 里都没有监听到的情况，这是什么原因呢
- ClassLoader
    - Bootstrap ClassLoader
    - Extention ClassLoader
    - App ClassLoader
- ClassLoadingStrategy

- MethodDelegationBinder 和 TargetMethodAnnotationDrivenBinder 是进行方法绑定时的概念，需要解决清楚



## TODO

- net.bytebuddy.dynamic.scaffold.TypeWriter#DUMP_PROPERTY: String DUMP_PROPERTY = "net.bytebuddy.dump"
- 读取注解 Annotation

## StackOverflow

- [How to redefine class with MethodDelegation?](https://github.com/raphw/byte-buddy/issues/104)
- [How to dynamically replace methods with Byte Buddy?](https://stackoverflow.com/questions/77778682/how-to-dynamically-replace-methods-with-byte-buddy)

## 设计模式

ByteBuddy是一个动态的Java字节码生成库，它使得在运行时生成和操作Java类变得更为简单。
这个库广泛使用了几种设计模式来提供灵活、强大且易于使用的API。以下是一些在ByteBuddy中常见的设计模式：

建造者模式（Builder Pattern）:
ByteBuddy广泛使用建造者模式来简化复杂对象的构建过程。通过链式调用方法，可以逐步构建出一个类的定义。这种模式不仅使代码更清晰，而且易于理解和维护。

代理模式（Proxy Pattern）:
ByteBuddy可以用来创建代理类，这是实现AOP（面向切面编程）的一种常用方法。通过代理模式，可以在不修改原始类代码的情况下，增加额外的功能。

适配器模式（Adapter Pattern）:
在需要将一个类的接口转换为另一个接口以供客户端使用时，可以使用适配器模式。ByteBuddy允许开发者定义方法拦截器，这些拦截器可以将调用适配到不同的方法或行为上。

工厂模式（Factory Pattern）:
ByteBuddy使用工厂模式来创建类或其他复杂对象。这种模式支持高度的定制和动态生成，使得创建特定行为的类变得简单。

策略模式（Strategy Pattern）:
这个模式在ByteBuddy中用于选择不同的生成或者拦截策略。例如，可以定义不同的方法拦截策略，并在运行时根据需要选择使用哪一种。

装饰者模式（Decorator Pattern）:
装饰者模式允许动态地添加新功能到现有对象上。在ByteBuddy中，这可以通过动态添加方法或拦截器来实现，从而增强类的功能而不改变其接口。

这些模式的应用使得ByteBuddy成为一个非常强大且灵活的库，能够满足广泛的需求，从简单的类修改到复杂的运行时代码生成和变换。通过这些设计模式，ByteBuddy为Java开发者提供了一个高效和直观的方式来操作和生成字节码。

- [arthas再见swapper你好](https://www.xiaogenban1993.com/blog/24.07/arthas%E5%86%8D%E8%A7%81swapper%E4%BD%A0%E5%A5%BD)
- [ByteBuddy字节码编程学习（场景、增强方式、类加载器策略、实践）](https://blog.51cto.com/panyujie/8649112)
- [ByteBuddy杂谈](https://www.bilibili.com/video/BV13m42137Ct/)
- [黑马JVM教程-高级篇-18-使用ByteBuddy打印方法执行的参数和耗时](https://haokan.baidu.com/v?pd=wisenatural&vid=4211276753009388296)
- [黑马JVM全套视频教程-高级篇-17-使用ASM增强方法](https://haokan.baidu.com/v?vid=735819025384870533&collection_id=)
- []()
- []()
- [How to create a JVM-global Singleton?](https://stackoverflow.com/questions/23445434/how-to-create-a-jvm-global-singleton/25273429#25273429)
- [Bytecode features not available in the Java language](https://stackoverflow.com/questions/6827363/bytecode-features-not-available-in-the-java-language/23218472#23218472)
- [How to access type annotations on a receiver type's parameters](https://stackoverflow.com/questions/34560790/how-to-access-type-annotations-on-a-receiver-types-parameters/34747633#34747633)
- []()
- [bytebuddy入门](https://blog.csdn.net/qq_39203337/article/details/139146850)
- [Spring - 1.字节码增强技术](https://blog.csdn.net/yueerba126/article/details/131962751)
- []()

## 源码

- [bytebuddy实现原理分析 &源码分析 （二）](https://blog.csdn.net/wanxiaoderen/article/details/107314149)
- [Java字节码ByteBuddy使用及原理解析上](https://www.jb51.net/program/284790hhz.htm)
- [Java字节码ByteBuddy使用及原理解析下](https://www.jb51.net/program/284792rez.htm)
- [bytebuddy源码解析](https://blog.csdn.net/wanxiaoderen/article/details/106594057)
- [bytebuddy动态加载原理解析](https://www.jianshu.com/p/f55bfa7d472c)
- [ByteBuddy（五）—拦截方法参数、方法返回和实例变量](https://www.jianshu.com/p/3c1dbff6ce54)
- [ByteBuddy（十三）—生成泛型构造函数、方法和实例变量](https://www.jianshu.com/p/89050a744178)
- []()
- []()
