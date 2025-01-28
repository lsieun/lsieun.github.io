---
title: "Attach Thread"
sequence: "101"
---


JVM source code analysis of the Attach mechanism to achieve a complete interpretation

## What is Attach

Before we talk about this, let's start with something that everyone knows.
When we feel that the thread has been stuck somewhere and want to know where it is stuck,
the first thing that comes to mind is to perform thread dump, and the commonly used command is `jstack`,
we can See the following thread stack

![](http://mmbiz.qpic.cn/mmbiz/rVjEtFN3qZCRwZCrSWv8pa9wsWZ5I7kWVbosynXvZzvGOEvDvAicwAOhggebxTHNH6Jt5VicNNZrZGqeM4LicicL7g/0)

Have you paid attention to the two threads circled above, "Attach Listener" and "Signal Dispatcher",
these two threads are the key to the Attach mechanism we are going to talk about this time.
I will tell you secretly, in fact, the thread of Attach Listener is in jvm
It may not be there when I get up, I will elaborate later.

What is the Attach mechanism?
To put it simply, jvm provides the ability to communicate between jvm processes,
allowing a process to pass commands to another process and let it perform some internal operations,
for example, if we want to dump the thread out of another jvm process,
then We ran a `jstack` process, and then passed a `pid` parameter to tell it which process to thread dump.
Since it is two processes, it must involve inter-process communication and the definition of the transmission protocol,
such as what operation to perform , What parameters passed, etc.

## What can Attach do

To sum up, such as memory dump, thread dump, class information statistics
(such as the class and size loaded and the number of instances, etc.),
dynamic loading agent (btrace used should not be strange),
dynamically set vm flag
(but not all All flags can be set, because some flags are used during the jvm startup process, which is one-time),
print the vm flag, get system properties, etc.
These corresponding source codes (AttachListener.cpp) are as follows

```text
src/hotspot/share/services/attachListener.cpp
```

```text
// names must be of length <= AttachOperation::name_length_max
static AttachOperationFunctionInfo funcs[] = {
  { "agentProperties",  get_agent_properties },
  { "datadump",         data_dump },
  { "dumpheap",         dump_heap },
  { "load",             load_agent },
  { "properties",       get_system_properties },
  { "threaddump",       thread_dump },
  { "inspectheap",      heap_inspection },
  { "setflag",          set_flag },
  { "printflag",        print_flag },
  { "jcmd",             jcmd },
  { NULL,               NULL }
};
```

The following is the processing function corresponding to the command.

## How Attach is implemented in jvm

## Reference

- [Serviceability in HotSpot](https://openjdk.java.net/groups/hotspot/docs/Serviceability.html)
- [JVM Attach机制实现](http://lovestblog.cn/blog/2014/06/18/jvm-attach/)
- [JVM source code analysis of the Attach mechanism to achieve a complete interpretation](https://titanwolf.org/Network/Articles/Article?AID=a9e4799e-5fb5-4909-a8ca-92fa2c328208)
- [Java Attach Mechanism](https://wenfeng-gao.github.io/post/java-attach-mechanism/)

test/hotspot/jtreg/vmTestbase/nsk/share/JVMTIagent.cpp
src/java.instrument/share/native/libinstrument/JPLISAgent.c
