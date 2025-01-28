---
title: "Instrumentation API"
sequence: "131"
---

[UP]({% link _java-agent/java-agent-01.md %})

## java.lang.instrument

首先，`java.lang.instrument` 包的作用是什么？

- 它定义了一些“规范”，比如 Manifest 当中的 `Premain-Class` 和 `Agent-Class` 属性，再比如 `premain` 和 `agentmain` 方法，这些“规范”是 Agent Jar 必须遵守的。
- 它定义了一些类和接口，例如 `Instrumentation` 和 `ClassFileTransformer`，这些类和接口允许我们在 Agent Jar 当中实现修改某些类的字节码。

举个形象化的例子。这些“规范”让一个普通的 `.jar` 文件（普通士兵）成为 Agent Jar（禁卫军）；
接着，Agent Jar（禁卫军）就可以在 target JVM（紫禁城）当中对 Application 当中加载的类（平民、官员）进行 instrumentation（巡查守备）任务了。

> 作用

**The mechanism for instrumentation is modification of the byte-codes of methods.**
[Link](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)

```text
instrumentation = modification of the byte-codes of methods
```

其次，`java.lang.instrument` 是 Java 1.5 引入的。

> 时间

再者，`java.lang.instrument` 包在哪里？

- 在 Java 8 版本中，位于 `rt.jar` 文件
- 在 Java 9 版本之后，位于 `java.instrument` 模块（`JDK_HOME/jmods/java.instrument.jmod`）

> 位置

最后，`java.lang.instrument` 包有哪些类呢？

> 有哪些类

```text
                        ┌─── ClassDefinition (类)
                        │
                        ├─── ClassFileTransformer (接口)
                        │
java.lang.instrument ───┼─── Instrumentation (接口)
                        │
                        ├─── IllegalClassFormatException (异常)
                        │
                        └─── UnmodifiableClassException (异常)
```

其中，`IllegalClassFormatException` 类和 `UnmodifiableClassException` 类，都是 `Exception` 类的子类，它们表示了某些情况下无法实现的操作，不需要投入很多时间研究。

我们的关注点就是理解：

- `ClassDefinition` 类
- `ClassFileTransformer` 接口
- `Instrumentation` 接口

换句话说，理解了这三者，也就是理解了 `java.lang.instrument` 的精髓。

在 Agent Jar 当中，Agent Class 是“名义”上的“老大”，但真正的做事情是借助于 `Instrumentation` 对象去完成的。

打个比方，英国的女王是国家虚位元首，象征性的最高领导者，无实权，但真正上管理国家的是首相。

## ClassDefinition

其中，`ClassDefinition` 类是一个非常简单的类，本质上就是对 `Class` 和 `byte[]` 两个字段的封装，很容易就能够掌握。

```text
package java.lang.instrument;

public final class ClassDefinition {
    private final Class<?> mClass;
    private final byte[] mClassFile;
}
```

## ClassFileTransformer

An agent provides an implementation of this interface in order to transform class files.
The **transformation** occurs before the class is **defined** by the JVM.

### transform

```java
public interface ClassFileTransformer {
    byte[] transform(ClassLoader         loader,
                     String              className,
                     Class<?>            classBeingRedefined,
                     ProtectionDomain    protectionDomain,
                     byte[]              classfileBuffer)
        throws IllegalClassFormatException;
}
```

Parameters:

- `loader` - the defining loader of the class to be transformed, may be `null` if the **bootstrap loader**
- `className` - the name of the class in the internal form of fully qualified class and interface names as defined in The Java Virtual Machine Specification. For example, "java/util/List".
- `classBeingRedefined` - if this is triggered by a `redefine` or `retransform`, the class being redefined or retransformed; if this is a class load, `null`
- `protectionDomain` - the protection domain of the class being defined or redefined
- `classfileBuffer` - the input byte buffer in class file format - **must not be modified**

Returns:

- a well-formed class file buffer (the result of the transform), or **`null` if no transform is performed**.

在 `transform` 方法中，我们重点关注 `className` 和 `classfileBuffer` 两个接收参数，以及返回值，

小总结：

- `loader`: 如果值为 `null`，则表示 bootstrap loader。
- `className`: 表示 internal class name，例如 `java/util/List`。
- `classfileBuffer`: 一定不要修改它的原有内容，可以复制一份，在复制的基础上就进行修改。
- 返回值: 如果返回值为 `null`，则表示没有进行修改。

## Instrumentation

在 `java.lang.instrument` 当中，`Instrumentation` 是一个接口：

```java
public interface Instrumentation {
}
```

```text
                                                         ┌─── isRedefineClassesSupported()
                                                         │
                                     ┌─── ability ───────┼─── isRetransformClassesSupported()
                                     │                   │
                   ┌─── Agent Jar ───┤                   └─── isNativeMethodPrefixSupported()
                   │                 │
                   │                 │                   ┌─── addTransformer()
                   │                 └─── transformer ───┤
                   │                                     └─── removeTransformer()
                   │
                   │                                     ┌─── appendToBootstrapClassLoaderSearch()
                   │                 ┌─── classloader ───┤
                   │                 │                   └─── appendToSystemClassLoaderSearch()
Instrumentation ───┤                 │
                   │                 │                                         ┌─── loading ───┼─── transform
                   │                 │                                         │
                   │                 │                   ┌─── status ──────────┤                                  ┌─── getAllLoadedClasses()
                   │                 │                   │                     │               ┌─── get ──────────┤
                   │                 │                   │                     │               │                  └─── getInitiatedClasses()
                   │                 │                   │                     └─── loaded ────┤
                   │                 │                   │                                     │                  ┌─── isModifiableClass()
                   │                 ├─── class ─────────┤                                     │                  │
                   └─── target VM ───┤                   │                                     └─── modifiable ───┼─── redefineClasses()
                                     │                   │                                                        │
                                     │                   │                                                        └─── retransformClasses()
                                     │                   │
                                     │                   │                     ┌─── isNativeMethodPrefixSupported()
                                     │                   └─── native method ───┤
                                     │                                         └─── setNativeMethodPrefix()
                                     │
                                     ├─── object ────────┼─── getObjectSize()
                                     │
                                     │                   ┌─── isModifiableModule()
                                     └─── module ────────┤
                                                         └─── redefineModule()
```

### isXxxSupported

读取 `META-INF/MANIFEST.MF` 文件中的属性信息：

```java
public interface Instrumentation {
    boolean isRedefineClassesSupported();
    boolean isRetransformClassesSupported();
    boolean isNativeMethodPrefixSupported();
}
```

### transform

#### xxxTransformer

添加和删除 `ClassFileTransformer`：

```java
public interface Instrumentation {
    void addTransformer(ClassFileTransformer transformer);
    void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
    boolean removeTransformer(ClassFileTransformer transformer);
}
```

同时，我们也说明一下三个类之间的关系：

```text
Agent Class --> Instrumentation --> ClassFileTransformer
```

三个类之间更详细的关系如下：

```text
               ┌───   premain(String agentArgs, Instrumentation inst)
Agent Class ───┤
               └─── agentmain(String agentArgs, Instrumentation inst)

                   ┌─── void addTransformer(ClassFileTransformer transformer, boolean canRetransform)
Instrumentation ───┤
                   └─── boolean removeTransformer(ClassFileTransformer transformer)
```

#### redefineClasses

```java
public interface Instrumentation {
    void redefineClasses(ClassDefinition... definitions)
        throws ClassNotFoundException, UnmodifiableClassException;
}
```

#### retransformClasses

```java
public interface Instrumentation {
    void retransformClasses(Class<?>... classes) throws UnmodifiableClassException;
}
```

### loader + class + object

#### ClassLoaderSearch

```java
public interface Instrumentation {
    // 1.6
    void appendToSystemClassLoaderSearch(JarFile jarfile);
    // 1.6
    void appendToBootstrapClassLoaderSearch(JarFile jarfile);
}
```

#### xxxClasses

下面三个方法都与已经加载的 `Class` 相关：

```java
public interface Instrumentation {
    Class[] getAllLoadedClasses();
    Class[] getInitiatedClasses(ClassLoader loader);
    boolean isModifiableClass(Class<?> theClass);
}
```

#### Object

```java
public interface Instrumentation {
    long getObjectSize(Object objectToSize);
}
```

### native

```java
public interface Instrumentation {
    boolean isNativeMethodPrefixSupported();
    void setNativeMethodPrefix(ClassFileTransformer transformer, String prefix);
}
```

### module

Java 9 引入

```java
public interface Instrumentation {
    boolean isModifiableModule(Module module);
    void redefineModule (Module module,
                         Set<Module> extraReads,
                         Map<String, Set<Module>> extraExports,
                         Map<String, Set<Module>> extraOpens,
                         Set<Class<?>> extraUses,
                         Map<Class<?>, List<Class<?>>> extraProvides);
}
```

## 总结

本文内容总结如下：

- 第一点，理解 `java.lang.instrument` 包的主要作用：它让一个普通的 Jar 文件成为一个 Agent Jar。
- 第二点，在 `java.lang.instrument` 包当中，有三个重要的类型：`ClassDefinition`、`ClassFileTransformer` 和 `Instrumentation`。
