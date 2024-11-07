---
title: "Multiple Agents"
sequence: "153"
---

## Multiple Agents

### Load-Time

The `-javaagent` switch may be used multiple times on the same command-line, thus creating **multiple agents**.
More than one agent may use the same jarpath. [Link](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)

```text
-javaagent:jarpath[=options]
```

### Dynamic

在[java.lang.instrument API](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)文档中，
并没有明确提到使用多个 Dynamic Agent，但是我们可以进行测试。

### 顺序执行

当有多个 Agent Jar 时，它们是按先后顺序执行，还是以某种随机、不固定的方式执行呢？

不管是 Load-Time Instrumentation，还是 Dynamic Instrumentation，多个 Agent Jar 是按照加载的先后顺序执行。

After the Java Virtual Machine (JVM) has initialized,
each `premain` method will be called in the order the agents were specified,
then the real application `main` method will be called.

Each `premain` method must return in order for the startup sequence to proceed.

## 不同视角

### ClassLoader 视角

#### Load-Time

The agent class will be loaded by the **system class loader**.
This is the class loader which typically loads the class containing the application `main` method.
The `premain` methods will be run under the same security and classloader rules as the application `main` method.

There are no modeling restrictions on what the agent `premain` method may do.
Anything application `main` can do, including **creating threads**, is legal from `premain`.

#### Dynamic

The agent JAR is appended to the **system class path**.
This is the class loader that typically loads the class containing the application `main` method.
The agent class is loaded and the JVM attempts to invoke the `agentmain` method.

### Thread 视角

在 Load-Time Instrumentation 情况下，多个 Agent Class 运行在 `main` 线程当中。

在 Dynamic Instrumentation 情况下，多个 Agent Class 运行在 `Attach Listener` 线程当中。

如果某一个 Agent Jar 的 `premain()` 或 `agentmain()` 方法不退出，后续的 Agent Jar 执行不了。

### Instrumentation 实例

JVM 加载每一个的 Agent Jar 都有一个属于自己的 `Instrumentation` 实例。
每一个 `Instrumentation` 实例管理自己的 `ClassFileTransformer`。

![](/assets/images/java/agent/multi-agent-jar.png)

## 示例：多个 Agent Jar

### Application

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.concurrent.TimeUnit;

public class Program {
    public static void main(String[] args) throws Exception {
        // 第一步，打印进程 ID
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);

        // 第二步，倒计时退出
        int count = 600;
        for (int i = 0; i < count; i++) {
            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

### Agent Jar

如果手工的生成一个一个的 Agent Jar 文件，会比较麻烦一些。
那么，我们可以写一个类的“模板”，然后借助于 ASM 修改类的名字，然后生成多个 Agent Jar 文件。

```java
package lsieun.agent;

import lsieun.utils.PrintUtils;

import java.lang.instrument.Instrumentation;
import java.util.concurrent.TimeUnit;

public class TemplateAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws InterruptedException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(TemplateAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，睡 10 秒钟
        for (int i = 0; i < 10; i++) {
            String message = String.format("%s: %03d", TemplateAgent.class.getSimpleName(), i);
            System.out.println(message);
            TimeUnit.SECONDS.sleep(1);
        }
    }

    public static void agentmain(String agentArgs, Instrumentation inst) throws InterruptedException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(TemplateAgent.class, "Agent-Class", agentArgs, inst);

        // 第二步，睡 30 秒钟
        for (int i = 0; i < 30; i++) {
            String message = String.format("%s: %03d", TemplateAgent.class.getSimpleName(), i);
            System.out.println(message);
            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

### Run

#### Load-Time

```text
$ java -cp ./target/classes -javaagent:./target/TemplateAgent001.jar -javaagent:./target/TemplateAgent002.jar sample.Program

========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.TemplateAgent001
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1550089733
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

TemplateAgent001: 000
TemplateAgent001: 001
...
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.TemplateAgent002
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@2101973421
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

TemplateAgent002: 000
TemplateAgent002: 001
...
```

#### Dynamic

```text
java -cp "${JAVA_HOME}/lib/tools.jar"\;./target/classes run.instrument.DynamicInstrumentation ./target/TemplateAgent001.jar
java -cp "${JAVA_HOME}/lib/tools.jar"\;./target/classes run.instrument.DynamicInstrumentation ./target/TemplateAgent002.jar
java -cp "${JAVA_HOME}/lib/tools.jar"\;./target/classes run.instrument.DynamicInstrumentation ./target/TemplateAgent003.jar
```

```text
$ java -cp ./target/classes/ sample.Program
...
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Agent-Class: lsieun.agent.TemplateAgent001
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1582797393
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: Attach Listener@5(true)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
========= ========= ========= SEPARATOR ========= ========= =========

TemplateAgent001: 000
TemplateAgent001: 001
...
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Agent-Class: lsieun.agent.TemplateAgent002
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1760363924
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: Attach Listener@5(true)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
========= ========= ========= SEPARATOR ========= ========= =========

TemplateAgent002: 000
TemplateAgent002: 001
...
```

## 总结

本文内容总结如下：

- 第一点，不管是 Load-Time Instrumentation 情况，还是 Dynamic Instrumentation 的情况，多个 Agent Jar 可以一起使用的，它们按照加载的先后顺序执行。
- 第二点，从不同的视角来理解多个 Agent Jar 的运行
  - 从 ClassLoader 的视角来说，它们都是使用 system classloader 加载。
  - 从 Thread 的视角来说，Load-Time Agent Class 运行在 `main` 线程里，Dynamic Agent Class 运行在 `Attach Listener` 线程里。
  - 从 Instrumentation 实例的视角来说，JVM 对于每一个加载的 Agent Jar 都有一个属于自己的 `Instrumentation` 实例。

