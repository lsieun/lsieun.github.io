---
title: "总结"
sequence: "149"
---

## 两种启动方式

进行 Load-Time Instrumentation，需要从命令行启动 Java Agent 需要使用 `-javagent` 选项：

```text
-javaagent:jarpath[=options]
```

进行 Dynamic Instrumentation ，需要使用到 JVM 的 Attach 机制。

## Agent Jar 的三个组成部分

在 Agent Jar 当中有三个主要组成部分：

![Agent Jar 中的三个组成部分](/assets/images/java/agent/agent-jar-three-components.png)

在 Manifest 文件中，与 Java Agent 相关的属性有 7 个：

```text
                                       ┌─── Premain-Class
                       ┌─── Basic ─────┤
                       │               └─── Agent-Class
                       │
                       │               ┌─── Can-Redefine-Classes
                       │               │
Manifest Attributes ───┼─── Ability ───┼─── Can-Retransform-Classes
                       │               │
                       │               └─── Can-Set-Native-Method-Prefix
                       │
                       │               ┌─── Boot-Class-Path
                       └─── Special ───┤
                                       └─── Launcher-Agent-Class
```

在 Agent Class 当中，可以定义 `premain` 和 `agentmain` 方法：

```text
public static void premain(String agentArgs, Instrumentation inst);

public static void agentmain(String agentArgs, Instrumentation inst);
```

## Instrumentation API

在 `java.lang.instrument` 最重要的三个类型：

```text
                        ┌─── Instrumentation (接口)
                        │
java.lang.instrument ───┼─── ClassFileTransformer (接口)
                        │
                        └─── ClassDefinition (类)
```

其中，`Instrumentation` 接口的方法可以分成不同的类别：

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

我们可以实现 `ClassFileTransformer` 接口中的 `transform()` 方法可以对具体的 ClassFile 进行转换：

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

那么，`ClassFileTransformer.transform` 方法会在什么时候被调用呢？

```text
                               ┌─── define: ClassLoader.defineClass
               ┌─── loading ───┤
               │               └─── transform
class state ───┤
               │               ┌─── redefine: Instrumentation.redefineClasses
               └─── loaded ────┤
                               └─── retransform: Instrumentation.retransformClasses
```

在 define、redefine 和 retransform 的情况下，会触发哪些 transformer：

![](/assets/images/java/agent/define-redefine-retransform.png)

