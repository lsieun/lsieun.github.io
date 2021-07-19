---
title:  "Java Agent介绍"
sequence: "101"
---

Java agent is a powerful tool introduced with Java 5. It has been highly useful in profiling activities where developers and application users can monitor tasks carried out within servers and applications. The ability to inject code segments by modifying classes and their method bodies during the run time has become useful in many ways. Intercepting parameter values passed between methods, calculation of execution time of methods can be considered as some examples.

The true power of java agents lie on their ability to do the bytecode instrumentation.

Instrumentation is the process of modifying these bytecode.

Java Agent，并不单单是一个独立的个体，它还需要操作字节码的类库的参与。比较常用的字节码的类库有：

## What is Java Agent?

Java Agent is a thin layer that sits between the JVM and your application.

```text
Java Application
------------------------------------------
Java Agent
------------------------------------------
JVM
```

An agent is deployed as a JAR file. An attribute in the JAR file manifest specifies the agent class which will be loaded to start the agent.

## Instrumentation

The mechanism for instrumentation is modification of the byte-codes of methods.

Instrumentation can be inserted in one of three ways:

- **Static Instrumentation**: The class file is instrumented before it is loaded into the VM - for example, by creating a duplicate directory of `*.class` files which have been modified to add the instrumentation. This method is extremely awkward and, in general, an agent cannot know the origin of the class files which will be loaded.
- **Load-Time Instrumentation**: When a class file is loaded by the VM, the raw bytes of the class file are sent for instrumentation to the agent. This mechanism provides efficient and complete access to one-time instrumentation.
- **Dynamic Instrumentation**: A class which is already loaded (and possibly even running) is modified. Classes can be modified multiple times and can be returned to their original state. The mechanism allows instrumentation which changes during the course of execution.

其实，这里就是讲了`.class`文件的三种状态：没有被加载、正在被加载、已经被加载。

## How an agent works

Mainly, there are two ways that an agent can be invoked. Type of the agent is decided based on the main method type selected by the developer.

- `premain()` – Agent is loaded before main class and other respective classes are loaded onto memory. This `premain` method, as its name described, will be invoked before the main method.
- `agentmain()` – Using this method, we can invoke an agent at an arbitrary point in time, after all the classes are load onto JVM.

## Java Agent的四个层面

{:refdef: style="text-align: center;"}
![Java Agent的四个层次](/assets/images/java/agent/java-agent-mindmap.png)
{: refdef}

