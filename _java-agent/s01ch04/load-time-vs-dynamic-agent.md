---
title: "Load-Time VS. Dynamic Agent"
sequence: "151"
---

## 虚拟机数量

Load-Time Instrumentation 只涉及到一个虚拟机：

![](/assets/images/java/agent/virtual-machine-of-load-time-instrumentation.png)

Dynamic Instrumentation 涉及到两个虚拟机：

![](/assets/images/java/agent/virtual-machine-of-dynamic-instrumentation.png)

## 时机不同

在进行 Load-Time Instrumentation 时，会执行 Agent Jar 当中的 `premain()` 方法；`premain()` 方法是先于 `main()` 方法执行，此时 Application 当中使用的**大多数类还没有被加载**。

在进行 Dynamic Instrumentation 时，会执行 Agent Jar 当中的 `agentmain()` 方法；而 `agentmain()` 方法是往往是在 `main()` 方法之后执行，此时 Application 当中使用的**大多数类已经被加载**。

> 时机不同

## 能力不同

Load-Time Instrumentation 可以做很多事情：添加和删除字段、添加和删除方法等。

Dynamic Instrumentation 做的事情比较有限，大多集中在对于方法体的修改。

## 线程不同

Load-Time Instrumentation 是运行在 `main` 线程里：

```text
Thread Id: main@1(false)
```

```java
package lsieun.agent;

import lsieun.utils.*;

import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);
    }
}
```

Dynamic Instrumentation 是运行在 `Attach Listener` 线程里：

```text
Thread Id: Attach Listener@5(true)
```

```java
package lsieun.agent;

import lsieun.utils.*;

import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(DynamicAgent.class, "Agent-Class", agentArgs, inst);
    }
}
```



## Exception 处理

在处理 Exception 的时候，Load-Time Instrumentation 和 Dynamic Instrumentation 有差异：
[Link](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)

- 当 Load-Time Instrumentation 时，出现异常，会报告错误信息，并且停止执行，退出虚拟机。
- 当 Dynamic Instrumentation 时，出现异常，会报告错误信息，但是不会停止虚拟机，而是继续执行。

在 Load-Time Instrumentation 过程中，遇到异常：

- If the agent cannot be resolved (for example, because the agent class cannot be loaded, or because the agent class does not have an appropriate `premain` method), **the JVM will abort**.
- If a `premain` method throws an uncaught exception, **the JVM will abort**.

在 Dynamic Instrumentation 过程中，遇到异常：

- If the agent cannot be started (for example, because the agent class cannot be loaded, or because the agent class does not have a conformant `agentmain` method), **the JVM will not abort**.
- If the `agentmain` method throws an uncaught exception, **it will be ignored**.

### Agent Class 不存在

#### Load-Time Agent

在 `pom.xml` 中，修改 `Premain-Class` 属性，指向一个不存在的 Agent Class：

```text
<Premain-Class>lsieun.agent.NonExistentAgent</Premain-Class>
```

会出现 `ClassNotFoundException` 异常：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Exception in thread "main" java.lang.ClassNotFoundException: lsieun.agent.NonExistentAgent
        at java.net.URLClassLoader.findClass(URLClassLoader.java:382)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:355)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:304)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)
FATAL ERROR in native method: processing of -javaagent failed
```

#### Dynamic Agent

在 `pom.xml` 中，修改 `Agent-Class` 属性，指向一个不存在的 Agent Class：

```text
<Agent-Class>lsieun.agent.NonExistentAgent</Agent-Class>
```

会出现 `ClassNotFoundException` 异常：

```text
Exception in thread "Attach Listener" java.lang.ClassNotFoundException: lsieun.agent.NonExistentAgent
	at java.net.URLClassLoader.findClass(URLClassLoader.java:382)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
	at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:355)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
	at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:304)
	at sun.instrument.InstrumentationImpl.loadClassAndCallAgentmain(InstrumentationImpl.java:411)
Agent failed to start!
```

### incompatible xxx-main

#### Load-Time Agent

如果 `premain` 方法不符合规范：

```java
public class LoadTimeAgent {
    public static void premain() {
        // do nothing
    }
}
```

会出现 `NoSuchMethodException` 异常：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Exception in thread "main" java.lang.NoSuchMethodException: lsieun.agent.LoadTimeAgent.premain(java.lang.String, java.lang.instrument.Instrumentation)
        at java.lang.Class.getDeclaredMethod(Class.java:2130)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:327)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)
FATAL ERROR in native method: processing of -javaagent failed
```

#### Dynamic Agent

如果 `agentmain` 方法不符合规范：

```java
public class DynamicAgent {
    public static void agentmain() {
        // do nothing
    }
}
```

会出现 `NoSuchMethodException` 异常：

```text
Exception in thread "Attach Listener" java.lang.NoSuchMethodException: lsieun.agent.DynamicAgent.agentmain(java.lang.String, java.lang.instrument.Instrumentation)
	at java.lang.Class.getDeclaredMethod(Class.java:2130)
	at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:327)
	at sun.instrument.InstrumentationImpl.loadClassAndCallAgentmain(InstrumentationImpl.java:411)
Agent failed to start!
```

### 抛出异常

#### Load-Time Agent

```java
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        throw new RuntimeException("exception from LoadTimeAgent");
    }
}
```

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Exception in thread "main" java.lang.reflect.InvocationTargetException
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)
Caused by: java.lang.RuntimeException: exception from LoadTimeAgent
        at lsieun.agent.LoadTimeAgent.premain(LoadTimeAgent.java:7)
        ... 6 more
FATAL ERROR in native method: processing of -javaagent failed
```

#### Dynamic Agent

```java
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        throw new RuntimeException("exception from DynamicAgent");
    }
}
```

```text
Exception in thread "Attach Listener" java.lang.reflect.InvocationTargetException
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
	at sun.instrument.InstrumentationImpl.loadClassAndCallAgentmain(InstrumentationImpl.java:411)
Caused by: java.lang.RuntimeException: exception from DynamicAgent
	at lsieun.agent.DynamicAgent.agentmain(DynamicAgent.java:7)
	... 6 more
Agent failed to start!
```

## 总结

本文内容总结如下：

- 第一点，虚拟机的数量不同。
- 第二点，时机不同和能力不同。
- 第三点，线程不同。
- 第四点，处理异常的方式不同。
