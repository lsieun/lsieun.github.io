---
title: "Instrumentation.xxxTransformer()"
sequence: "133"
---

[UP]({% link _java-agent/java-agent-01.md %})

在本文当中，我们关注两个问题：

- `Instrumentation` 和 `ClassFileTransformer` 两者是如何建立联系？
- `ClassFileTransformer.transform()` 方法什么时候调用呢？

## 添加和删除 Transformer

```java
public interface Instrumentation {
    void addTransformer(ClassFileTransformer transformer);
    void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
    boolean removeTransformer(ClassFileTransformer transformer);
}
```

### addTransformer

在 `Instrumentation` 当中，定义了两个 `addTransformer` 方法，但两者本质上一样的：

- 调用 `addTransformer(ClassFileTransformer transformer)` 方法，相当于调用 `addTransformer(transformer, false)`

```java
public interface Instrumentation {
    // Since 1.5
    void addTransformer(ClassFileTransformer transformer);
    // Since 1.6
    void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
}
```

那么，`addTransformer` 方法的 `canRetransform` 参数起到一个什么样的作用呢？

- 第一点，它影响 `transformer` 对象**存储的位置**
- 第二点，它影响 `transformer` 对象**功能的发挥**


关于 `transformer` 对象存储的位置，我们可以参考 `sun.instrument.InstrumentationImpl` 源码当中的实现：

```java
public class InstrumentationImpl implements Instrumentation {
    private final TransformerManager mTransformerManager;
    private TransformerManager mRetransfomableTransformerManager;
    
    // 以下是经过简化之后的代码
    public synchronized void addTransformer(ClassFileTransformer transformer, boolean canRetransform) {
        if (canRetransform) {
            mRetransfomableTransformerManager.addTransformer(transformer);
        }
        else {
            mTransformerManager.addTransformer(transformer);
        }
    }    
}
```

- 如果 `canRetransform` 的值为 `true`，我们就将 `transformer` 对象称为 retransformation capable transformer
- 如果 `canRetransform` 的值为 `false`，我们就将 `transformer` 对象称为 retransformation incapable transformer

小总结：

- 第一点，两个 `addTransformer` 方法两者本质上是一样的。
- 第二点，第二个参数 `canRetransform` 影响第一个参数 `transformer` 的存储位置。

### removeTransformer

不管是 retransformation capable transformer，还是 retransformation incapable transformer，都使用同一个 `removeTransformer` 方法：

```java
public interface Instrumentation {
    boolean removeTransformer(ClassFileTransformer transformer);
}
```

同样，我们可以参考 `InstrumentationImpl` 类当中的实现：

```java
public class InstrumentationImpl implements Instrumentation {
    private final TransformerManager mTransformerManager;
    private TransformerManager mRetransfomableTransformerManager;
    
    // 以下是经过简化之后的代码
    public synchronized boolean removeTransformer(ClassFileTransformer transformer) {
        TransformerManager mgr = findTransformerManager(transformer);
        if (mgr != null) {
            mgr.removeTransformer(transformer);
            return true;
        }
        return false;
    }  
}
```

在什么时候对 `removeTransformer` 方法进行调用呢？有两种情况。

第一种情况，想处理的 `Class` 很明确，那就尽量早的调用 `removeTransformer` 方法，让 `ClassFileTransformer` 影响的范围最小化。

```java
public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("Agent-Class: " + DynamicAgent.class.getName());
        ClassFileTransformer transformer = new ASMTransformer();
        try {
            inst.addTransformer(transformer, true);
            Class<?> targetClass = Class.forName("sample.HelloWorld");
            inst.retransformClasses(targetClass);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

第二种情况，想处理的 `Class` 不明确，可以不调用 `removeTransformer` 方法。

```java
public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        ClassFileTransformer transformer = new InfoTransformer();
        inst.addTransformer(transformer);
    }
}
```

## 调用的时机

当我们将 `ClassFileTransformer` 添加到 `Instrumentation` 之后，`ClassFileTransformer` 类当中的 `transform` 方法什么时候执行呢？

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

首先，对 `ClassFileTransformer.transform()` 方法调用的时机有三个：

- 类加载的时候
- 调用 `Instrumentation.redefineClasses` 方法的时候
- 调用 `Instrumentation.retransformClasses` 方法的时候

在 OpenJDK 的源码中，`hotspot/src/share/vm/prims/jvmtiThreadState.hpp` 文件定义了一个 `JvmtiClassLoadKind` 结构：

```text
enum JvmtiClassLoadKind {
    jvmti_class_load_kind_load = 100,
    jvmti_class_load_kind_retransform,
    jvmti_class_load_kind_redefine
};
```

接着，来介绍一下 redefine 和 retransform 两个概念，它们与类的加载状态有关系：

- 对于正在加载的类进行修改，它属于 define 和 transform 的范围。
- 对于已经加载的类进行修改，它属于 redefine 和 retransform 的范围。

对于已经加载的类（loaded class），redefine 侧重于以“新”换“旧”，而 retransform 侧重于对“旧”的事物进行“修补”。

```text
                               ┌─── define: ClassLoader.defineClass
               ┌─── loading ───┤
               │               └─── transform
class state ───┤
               │               ┌─── redefine: Instrumentation.redefineClasses
               └─── loaded ────┤
                               └─── retransform: Instrumentation.retransformClasses
```

再者，触发的方式不同：

- load，是类在加载的过程当中，JVM 内部机制来自动触发。
- redefine 和 retransform，是我们自己写代码触发。

最后，就是不同的时机（load、redefine、retransform）能够接触到的 transformer 也不相同：

![](/assets/images/java/agent/define-redefine-retransform.png)

## 总结

本文内容总结如下：

- 第一点，介绍了 `Instrumentation` 添加和移除 `ClassFileTransformer` 的两个方法。
- 第二点，介绍了 `ClassFileTransformer` 被调用的三个时机：load、redefine 和 retransform。
