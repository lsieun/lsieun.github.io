---
title: "Self Attach"
sequence: "155"
---

有些情况下，我们想在当前的 JVM 当中获得一个 `Instrumentation` 实例。

## 获取 VM PID

### Pre Java 9

代码片段：

```text
String jvmName = ManagementFactory.getRuntimeMXBean().getName();
String jvmPid = jvmName.substring(0, jvmName.indexOf('@'));
```

完整代码：

```java
import java.lang.management.ManagementFactory;

public class HelloWorld {
    public static void main(String[] args) {
        String jvmName = ManagementFactory.getRuntimeMXBean().getName();
        String jvmPid = jvmName.substring(0, jvmName.indexOf('@'));
        System.out.println(jvmName);
        System.out.println(jvmPid);
    }
}
```

运行结果：

```text
5452@LenovoWin7
5452
```

### Java 9

In Java 9 the `java.lang.ProcessHandle` can be used:

```text
long pid = ProcessHandle.current().pid();
```

```java
import java.lang.management.ManagementFactory;

public class HelloWorld {
    public static void main(String[] args) {
        String jvmName = ManagementFactory.getRuntimeMXBean().getName();
        String jvmPid = jvmName.substring(0, jvmName.indexOf('@'));
        System.out.println(jvmName);
        System.out.println(jvmPid);

        long pid = ProcessHandle.current().pid();
        System.out.println(pid);
    }
}
```

Output:

```text
9836@LenovoWin7
9836
9836
```

## 示例

### Application

```java
package sample;

import lsieun.agent.SelfAttachAgent;

import java.lang.instrument.Instrumentation;

public class Program {
    public static void main(String[] args) throws Exception {
        Instrumentation inst = SelfAttachAgent.getInstrumentation();
        System.out.println(inst);
    }
}
```

### SelfAttachAgent

```java
package lsieun.agent;

import com.sun.tools.attach.VirtualMachine;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.instrument.Instrumentation;
import java.lang.management.ManagementFactory;
import java.util.jar.Attributes;
import java.util.jar.JarOutputStream;
import java.util.jar.Manifest;

public class SelfAttachAgent {
    private static volatile Instrumentation globalInstrumentation;

    public static void premain(String agentArgs, Instrumentation inst) {
        globalInstrumentation = inst;
    }

    public static void agentmain(String agentArgs, Instrumentation inst) {
        globalInstrumentation = inst;
    }

    public static Instrumentation getInstrumentation() {
        if (globalInstrumentation == null) {
            loadAgent();
        }
        return globalInstrumentation;
    }

    public static void loadAgent() {
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        int index = nameOfRunningVM.indexOf('@');
        String pid = nameOfRunningVM.substring(0, index);

        VirtualMachine vm = null;
        try {
            String jarPath = createTempJarFile().getPath();
            System.out.println(jarPath);

            vm = VirtualMachine.attach(pid);
            vm.loadAgent(jarPath, "");

        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (vm != null) {
                try {
                    vm.detach();
                } catch (IOException ignored) {
                }
            }
        }
    }

    public static File createTempJarFile() throws IOException {
        File jar = File.createTempFile("agent", ".jar");
        jar.deleteOnExit();
        createJarFile(jar);
        return jar;
    }

    private static void createJarFile(File jar) throws IOException {
        String className = SelfAttachAgent.class.getName();

        Manifest manifest = new Manifest();
        Attributes attrs = manifest.getMainAttributes();
        attrs.put(Attributes.Name.MANIFEST_VERSION, "1.0");
        attrs.put(new Attributes.Name("Premain-Class"), className);
        attrs.put(new Attributes.Name("Agent-Class"), className);
        attrs.put(new Attributes.Name("Can-Retransform-Classes"), "true");
        attrs.put(new Attributes.Name("Can-Redefine-Classes"), "true");

        JarOutputStream jos = new JarOutputStream(new FileOutputStream(jar), manifest);
        jos.flush();
        jos.close();
    }
}
```

### Run

#### Java 8

```text
$ java -cp "${JAVA_HOME}/lib/tools.jar"\;./target/classes/ sample.Program

7704
C:\Users\liusen\AppData\Local\Temp\agent3349937074235412866.jar
sun.instrument.InstrumentationImpl@65b54208
```

#### Java 9

```text
$ java -cp ./target/classes/ sample.Program

Caused by: java.io.IOException: Can not attach to current VM
```

**Attach API cannot be used to attach to the current VM by default** [Link](https://www.oracle.com/java/technologies/javase/9-notes.html)

The implementation of Attach API has changed in JDK 9 to disallow attaching to the current VM by default.
This change should have no impact on tools that use the Attach API to attach to a running VM.
It may impact libraries that misuse this API as a way to get at the `java.lang.instrument` API.
The system property `jdk.attach.allowAttachSelf` may be set on the command line to mitigate any compatibility with this change.

Note: since JDK 9 attaching to current process requires setting the system property:

```text
-Djdk.attach.allowAttachSelf=true
```

```text
$ java -Djdk.attach.allowAttachSelf=true -cp ./target/classes/ sample.Program
```

Java 9 adds the `Launcher-Agent-Class` attribute which can be used on executable JAR files to start an agent before the main class is loaded.

## 总结

本文内容总结如下：

- 第一点，如何获取当前 VM 的 PID 值。
- 第二点，在 Java 9 的情况下，默认不允许 attach 到当前 VM，解决方式是将 `jdk.attach.allowAttachSelf` 属性设置成 `true`。
