
三个应用场景：

- manually
- Java agent
- Build



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
- MemberSubstitution

- MethodDelegationBinder 和 TargetMethodAnnotationDrivenBinder 是进行方法绑定时的概念，需要解决清楚

## TODO

- net.bytebuddy.dynamic.scaffold.TypeWriter#DUMP_PROPERTY: String DUMP_PROPERTY = "net.bytebuddy.dump"
- 读取注解 Annotation

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
