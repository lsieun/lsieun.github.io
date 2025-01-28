---
title: "Attach Thread"
sequence: "210"
---

在[Serviceability in HotSpot](http://openjdk.java.net/groups/hotspot/docs/Serviceability.html)中提到：

<fieldset>
<b>Dynamic Attach.</b>
This is a Sun private mechanism that allows an external process to start a thread in HotSpot
that can then be used to launch an agent to run in that HotSpot,
and to send information about the state of HotSpot back to the external process.
</fieldset>



## [HotSpot Dynamic Attach Mechanism](http://openjdk.java.net/groups/hotspot/docs/Serviceability.html#battach)

This is a Sun extension that allows a tool to 'attach' to another process running Java code and
launch a JVM TI agent or a `java.lang.instrument` agent in that process.
This also allows the **system properties** to be obtained from the target JVM.
The Sun implementation of this API also includes some HotSpot specific methods
that allow additional information to be obtained from HotSpot:

- The ctrl-break output from the local JVM
- The ctrl-break output from the remote JVM
- A dump of the heap
- A histogram showing the number of instances of the classes loaded in the target JVM. Either all instances or just 'live' instances can be counted.
- The value of a manageable command line flag. Such flags can also be set.

Dynamic attach has an **attach listener thread** in the **target JVM**.
This is a thread that is started when the first attach request occurs.
On Linux and Solaris, the client creates a file named `.attach_pid(pid)` and sends a `SIGQUIT` to the target JVM process.
The existence of this file causes the `SIGQUIT` handler in HotSpot to start the attach listener thread.
On Windows, the client uses the Win32 CreateRemoteThread function to create a new thread in the target process.
The **attach listener thread** then communicates with the **source JVM** in an OS dependent manner:

- On Solaris, the Doors IPC mechanism is used. The door is attached to a file in the file system so that clients can access it.
- On Linux, a Unix domain socket is used. This socket is bound to a file in the filesystem so that clients can access it.
- On Windows, the created thread is given the name of a pipe which is served by the client. The result of the operations are written to this pipe by the target JVM.

## Application

### Program

```java
public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Program.class;
        System.out.println("===>Class: " + clazz.getName());
        System.out.println("ClassLoader: " + clazz.getClassLoader());
        System.out.println("Thread Id: " +
                Thread.currentThread().getName() + "@" +
                Thread.currentThread().getId() +
                "(" + Thread.currentThread().isDaemon() + ")"
        );
        System.out.println("This is main method from Program class.");
        System.out.println("=======================================");

        for (int i = 0; i < 10; i++) {
            System.out.println("for loop");
            System.out.println("========");
            Thread.sleep(5000);
        }
        System.out.println("Exit: " +
                Thread.currentThread().getName() + "@" +
                Thread.currentThread().getId() +
                "(" + Thread.currentThread().isDaemon() + ")"
        );
    }
}
```

## Agent Class

### DynamicAgent

```java
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        Class<?> agentClass = DynamicAgent.class;
        System.out.println("===>Agent-Class: " + agentClass.getName());
        System.out.println("ClassLoader: " + agentClass.getClassLoader());
        System.out.println("Thread Id: " +
                Thread.currentThread().getName() + "@" +
                Thread.currentThread().getId() +
                "(" + Thread.currentThread().isDaemon() + ")"
        );
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");

        try {
            Thread.sleep(20000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## Run

```text
mvn clean package
```

```text
# 编译 VMAttach.java（Windows)
$ java -cp "%JAVA_HOME%/lib/tools.jar";./target/classes run.DynamicInstrumentation

# 编译 VMAttach.java（Linux)
$ java -cp "${JAVA_HOME}/lib/tools.jar":./target/classes run.DynamicInstrumentation

# 编译 VMAttach.java（MINGW64)
$ java -cp "${JAVA_HOME}/lib/tools.jar"\;./target/classes run.DynamicInstrumentation
```

```text
$ java -cp ./target/classes/ sample.Program
===>Class: sample.Program
ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
Thread Id: main@1(false)
This is main method from Program class.
=======================================
for loop
========
===>Agent-Class: lsieun.agent.DynamicAgent
ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
Thread Id: Attach Listener@5(true)
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
for loop
========
for loop
========
for loop
========
for loop
========
===>Agent-Class: lsieun.agent.DynamicAgent
ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
Thread Id: Attach Listener@5(true)
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
for loop
========
for loop
========
for loop
========
for loop
========
for loop
========
Exit: main@1(false)
```

