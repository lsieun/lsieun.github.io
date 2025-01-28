---
title: "总结"
sequence: "117"
---

## Command Line

进行 Load-Time Instrumentation，需要从命令行启动 Agent Jar，需要使用 `-javagent` 选项：

```text
-javaagent:jarpath[=options]
```

![](/assets/images/java/agent/java-agent-command-line-options.png)

在 Load-Time Instrumentation 过程中，会用到 `premain` 方法，我们关注两个问题：

- 第一个问题，`Instrumentation` 是一个接口，它的具体实现是哪个类？回答：`sun.instrument.InstrumentationImpl` 类。
- 第二个问题，是“谁”调用了 `premain()` 方法的呢？回答：`InstrumentationImpl.loadClassAndStartAgent()` 方法

```text
public static void premain(String agentArgs, Instrumentation inst)
```

## Attach

进行 Dynmaic Instrumentation，需要用到 Attach API。

Attach API 体现在 `com.sun.tools.attach` 包。

在 `com.sun.tools.attach` 包，最核心的是 `VirtualMachine` 类。

```text
                                       ┌─── VirtualMachine.attach(String id)
                  ┌─── 1. Get VM ──────┤
                  │                    └─── VirtualMachine.attach(VirtualMachineDescriptor vmd)
                  │
                  │                                            ┌─── VirtualMachine.loadAgent(String agent)
                  │                    ┌─── Load Agent ────────┤
VirtualMachine ───┤                    │                       └─── VirtualMachine.loadAgent(String agent, String options)
                  ├─── 2. Use VM ──────┤
                  │                    │                       ┌─── VirtualMachine.getAgentProperties()
                  │                    └─── read properties ───┤
                  │                                            └─── VirtualMachine.getSystemProperties()
                  │
                  └─── 3. detach VM ───┼─── VirtualMachine.detach()
```

