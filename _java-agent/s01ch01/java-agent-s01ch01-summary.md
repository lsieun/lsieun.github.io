---
title: "总结"
sequence: "108"
---

[UP]({% link _java-agent/java-agent-01.md %})

## 三个组成部分

在 Java Agent 对应的 `.jar` 文件里，有三个主要组成部分：

- Manifest
- Agent Class
- ClassFileTransformer

![Agent Jar 中的三个组成部分](/assets/images/java/agent/agent-jar-three-components.png)

三个组成部分：

```text
                ┌─── Manifest ───────────────┼─── META-INF/MANIFEST.MF
                │
                │                            ┌─── LoadTimeAgent.class: premain
TheAgent.jar ───┼─── Agent Class ────────────┤
                │                            └─── DynamicAgent.class: agentmain
                │
                └─── ClassFileTransformer ───┼─── ASMTransformer.class
```

彼此之间的关系：

```text
Manifest --> Agent Class --> Instrumentation --> ClassFileTransformer
```

## Load-Time VS. Dynamic

### Load-Time

在 Load-Time Instrumentation 当中，只涉及到一个 JVM：

![](/assets/images/java/agent/virtual-machine-of-load-time-instrumentation.png)

在 Manifest 部分，需要定义 `Premain-Class` 属性。

在 Agent Class 部分，需要定义 `premain` 方法。下面是 `premain` 的两种写法：

```text
public static void premain(String agentArgs, Instrumentation inst);
public static void premain(String agentArgs);
```

在运行的时候，需要配置 `-javaagent` 选项加载 Agent Jar：

```text
java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
```

在运行的过程当中，先执行 Agent Class 的 `premain` 方法，再执行 Application 的 `main` 方法。

### Dynamic

在 Dynamic Instrumentation 当中，涉及到两个 JVM：

![](/assets/images/java/agent/virtual-machine-of-dynamic-instrumentation.png)


在 Manifest 部分，需要定义 `Agent-Class` 属性。

在 Agent Class 部分，需要定义 `agentmain` 方法。下面是 `agentmain` 的两种写法：

```text
public static void agentmain(String agentArgs, Instrumentation inst);
public static void agentmain(String agentArgs);
```

在运行的时候，需要使用 Attach 机制加载 Agent Jar。

在运行的过程当中，一般 Application 的 `main` 方法已经开始执行，而 Agent Class 的 `agentmain` 方法后执行。

## 总结

本文内容总结如下：

- 第一点，Agent Jar 的三个组成部分：Manifest、Agent Class 和 ClassFileTransformer。
- 第二点，对 Load-Time Instrumentation 和 Dynamic Instrumentation 有一个初步的理解。
  - Load-Time Instrumentation: `Premain-Class` ---> `premain()` ---> `-javaagent` 
  - Dynamic Instrumentation: `Agent-Class` ---> `agentmain()` ---> Attach
