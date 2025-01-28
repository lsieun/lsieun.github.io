---
title: "Instrumentation.xxxClasses()"
sequence: "137"
---

[UP]({% link _java-agent/java-agent-01.md %})

## xxxClasses()

```java
public interface Instrumentation {
    Class[] getAllLoadedClasses();
    Class[] getInitiatedClasses(ClassLoader loader);
    boolean isModifiableClass(Class<?> theClass);
}
```

- `Class[] getAllLoadedClasses()`: Returns an array containing all the classes loaded by the JVM, zero-length if there are none.
- `Class[] getInitiatedClasses(ClassLoader loader)`: Returns an array of all classes for which `loader` is **an initiating loader**. If the supplied loader is `null`, classes initiated by the **bootstrap class loader** are returned.
- `boolean isModifiableClass(Class<?> theClass)`: Determines whether a class is modifiable by **retransformation** or **redefinition**. If a class is modifiable then this method returns `true`. If a class is not modifiable then this method returns `false`.
  - For a class to be **retransformed**, `isRetransformClassesSupported` must also be `true`. But the value of `isRetransformClassesSupported()` does not influence the value returned by this function.
  - For a class to be **redefined**, `isRedefineClassesSupported` must also be `true`. But the value of `isRedefineClassesSupported()` does not influence the value returned by this function.
  - **Primitive classes** (for example, `java.lang.Integer.TYPE`) and **array classes** are never modifiable.

这三个方法都与 `java.lang.Class` 相关，要么是方法的返回值，要么是方法的参数。

第一个方法，`Class[] getAllLoadedClasses()` 的作用就是获取**所有已经加载的类**；功能虽然强大，但是要慎重使用，因为它花费的时间也比较多。

有的时候，我们要找到某个类，就想调用 `getAllLoadedClasses()` 方法，然后遍历查找，这样的执行效率会比较低。如果我们明确的知道要找某个类，可以直接使用 `Class.forName()` 方法。

第二个方法，`Class[] getInitiatedClasses(ClassLoader loader)` 的作用是获取由某一个 initiating class loader 已经加载的类。

什么是 initiating class loader 和 defining class loader 呢？

In Java terminology, a class loader that is asked to load a type,
but returns a type loaded by some other class loader, is called an **initiating class loader** of that type.
The class loader that actually defines the type is called the **defining class loader** for the type.

第三个方法，`boolean isModifiableClass(Class<?> theClass)` 的作用是判断某一个 Class 是否可以被修改（modifiable）。

要对一个已经加载的类进行修改，需要考虑四个因素：

- 第一，JVM 是否支持？
- 第二，Agent Jar 是否支持？在 `MANIFEST.MF` 文件中，是否将 `Can-Redefine-Classes` 和 `Can-Retransform-Classes` 设置为 `true` ？
- 第三，`Instrumentation` 和 `ClassFileTransformer` 是否支持？是否将 `addTransformer(ClassFileTransformer transformer, boolean canRetransform)` 的 `canRetransform` 参数设置为 `true` ？
- 第四，当前的 Class 是否为可修改的？ `boolean isModifiableClass(Class<?> theClass)` 是否返回 `true` ？

需要注意的是，**Primitive classes** 和 **array classes** 是不能被修改的。

## 示例一：All Loaded Class 和 Modifiable

### LoadTimeAgent.java

```java
package lsieun.agent;

import lsieun.utils.PrintUtils;

import java.lang.instrument.Instrumentation;
import java.util.ArrayList;
import java.util.List;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，获取所有加载的类
        Class<?>[] allLoadedClasses = inst.getAllLoadedClasses();

        // 第三步，分成两组
        List<String> modifiableClassList = new ArrayList<>();
        List<String> notModifiableClassList = new ArrayList<>();
        for (Class<?> clazz : allLoadedClasses) {
            boolean isModifiable = inst.isModifiableClass(clazz);
            String className = clazz.getName();
            if (isModifiable) {
                modifiableClassList.add(className);
            }
            else {
                notModifiableClassList.add(className);
            }
        }

        // 第四步，输出
        System.out.println("Modifiable Classes:");
        for (String item : modifiableClassList) {
            System.out.println("    " + item);
        }
        System.out.println("Not Modifiable Classes:");
        for (String item : notModifiableClassList) {
            System.out.println("    " + item);
        }
    }
}
```

### 运行

在使用 `Instrumentation.isModifiableClass(Class<?> theClass)` 判断时，
除了**原始类型**和**数组类型**（例如，`[Ljava.lang.Object;` 和 `[B` 等）返回 `false` 值；其它的类型（例如，`java.lang.Object`）都会返回 `true` 值。
这也就意味着我们可以对大部分的 Class 进行 retransform 和 redefine 操作。

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1704856573
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

Modifiable Classes:
    lsieun.utils.PrintUtils    // 自己写的类，是可以被修改的
    java.lang.Object           // JDK 内部的类，也是可以被修改的
    ...
Not Modifiable Classes:
    ...
    [[C
    [Ljava.lang.Object;
    [Ljava.lang.Long;          // 数组类型，是不可以被修改的
    [J
    [I
    [S
    [B
    [D
    [F
    [C
    [Z
```

## 示例二：initiating class loader

这个示例主要是为了验证一下：System ClassLoader 是不是 `java.lang.StrictMath` 类的 initiating class loader ？

```java
package lsieun.agent;

import lsieun.utils.PrintUtils;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，加载一个 java.lang.StrictMath 类
        {
            Class<StrictMath> clazz = StrictMath.class;
            System.out.println("Load Class: " + clazz.getName());
            System.out.println("==============================");
        }

        // 第三步，查看加载的类
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        Class<?>[] initiatedClasses = inst.getInitiatedClasses(systemClassLoader);
        if (initiatedClasses != null) {
            for (Class<?> clazz : initiatedClasses) {
                String message = String.format("%s: %s", clazz.getName(), clazz.getClassLoader());
                System.out.println(message);
            }
        }
    }
}
```

## 示例三：尝试修改 int.class

本示例目的：当我们尝试修改不能修改的类时，会出现 `UnmodifiableClassException` 异常。

```java
package lsieun.agent;

import lsieun.utils.*;

import java.lang.instrument.Instrumentation;
import java.lang.instrument.UnmodifiableClassException;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws UnmodifiableClassException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，使用 inst
        Class<?> clazz = int.class; // 或 String[].class;
        boolean isModifiable = inst.isModifiableClass(clazz);
        System.out.println(isModifiable);
        inst.retransformClasses(clazz);
    }
}
```

输出结果：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

false
Exception in thread "main" java.lang.reflect.InvocationTargetException
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)
Caused by: java.lang.instrument.UnmodifiableClassException
        at sun.instrument.InstrumentationImpl.retransformClasses0(Native Method)
        at sun.instrument.InstrumentationImpl.retransformClasses(InstrumentationImpl.java:144)
        at lsieun.agent.LoadTimeAgent.premain(LoadTimeAgent.java:17)
        ... 6 more
FATAL ERROR in native method: processing of -javaagent failed
```

## 总结

本文内容总结如下：

- 第一点，`getAllLoadedClasses()` 方法是获取所有已经加载的类；功能虽然强大，但是要慎重使用。如果知道类的名字，使用 `Class.forName()` 是更好的选择。
- 第二点，`getInitiatedClasses(ClassLoader loader)` 方法是加载由某个 class loader 加载的类。注意区分 initiating class loader 和 defining class loader 两个概念。
- 第三点，`isModifiableClass(Class<?> theClass)` 是判断一个 Class 是否可以被修改，这是进行 redefine 和 retransform 的前提。同时，要注意 **Primitive classes** 和 **array classes** 是不能被修改的。
