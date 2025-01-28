---
title: "Instrumentation.retransformClasses()"
sequence: "135"
---

[UP]({% link _java-agent/java-agent-01.md %})

## retransformClasses

Retransform the supplied set of classes.

```java
public interface Instrumentation {
    void retransformClasses(Class<?>... classes) throws UnmodifiableClassException;
}
```

This method operates on a set in order to allow interdependent changes to **more than one class** at the same time
(a retransformation of class A can require a retransformation of class B).

## 示例一：修改 toString 方法

### Application

```java
package sample;

public class Program {
    public static void main(String[] args) {
        Object obj = new Object();
        System.out.println(obj);
    }
}
```

### Agent Jar

#### LoadTimeAgent

调用顺序：

- create a transformer
- add the transformer
- call retransform
- remove the transformer

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，指定要修改的类
        String className = "java.lang.Object";

        // 第三步，使用 inst：添加 transformer --> retransform --> 移除 transformer
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, true);
        try {
            Class<?> clazz = Class.forName(className);
            boolean isModifiable = inst.isModifiableClass(clazz);
            if (isModifiable) {
                inst.retransformClasses(clazz);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

#### ASMTransformer

```java
package lsieun.instrument;

import lsieun.asm.visitor.*;
import org.objectweb.asm.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Objects;

public class ASMTransformer implements ClassFileTransformer {
    private final String internalName;

    public ASMTransformer(String internalName) {
        Objects.requireNonNull(internalName);
        this.internalName = internalName.replace(".", "/");
    }

    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (className.equals(internalName)) {
            System.out.println("transform class: " + className);
            ClassReader cr = new ClassReader(classfileBuffer);
            ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
            ClassVisitor cv = new ToStringVisitor(cw, "This is an object.");

            int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
            cr.accept(cv, parsingOptions);

            return cw.toByteArray();
        }

        return null;
    }
}
```

### Run

```text
mvn clean package
```

#### None

```text
$ java -cp ./target/classes/ sample.Program
java.lang.Object@15db9742
```

#### Load-Time

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

This is an object.
```

#### addTransformer: false

将 `Instrumentation.addTransformer(ClassFileTransformer, boolean)` 的第二个参数设置为 `false`：

```text
inst.addTransformer(transformer, false);
```

那么，再次运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

java.lang.Object@7d4991ad
```

#### Can-Retransform: false

在 `pom.xml` 文件中，将 `Can-Retransform-Classes` 设置成 `false`：

```text
<Can-Retransform-Classes>false</Can-Retransform-Classes>
```

再次运行，会出现 `UnsupportedOperationException` 异常：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

Caused by: java.lang.UnsupportedOperationException: adding retransformable transformers is not supported in this environment
        at sun.instrument.InstrumentationImpl.addTransformer(InstrumentationImpl.java:88)
        at lsieun.agent.LoadTimeAgent.premain(LoadTimeAgent.java:20)
        ... 6 more
FATAL ERROR in native method: processing of -javaagent failed

```

## 示例二：Dump

本示例的目的是将 JVM 当中已经加载的类导出。

### Agent Jar

#### LoadTimeAgent

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，指定要处理的类
        String className = "java.lang.Object";

        // 第三步，使用 inst：添加 transformer --> retransform --> 移除 transformer
        ClassFileTransformer transformer = new DumpTransformer(className);
        inst.addTransformer(transformer, true);
        try {
            Class<?> clazz = Class.forName(className);
            boolean isModifiable = inst.isModifiableClass(clazz);
            if (isModifiable) {
                inst.retransformClasses(clazz);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

#### DumpTransformer

```java
package lsieun.instrument;

import lsieun.utils.DateUtils;
import lsieun.utils.DumpUtils;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;
import java.util.Objects;

public class DumpTransformer implements ClassFileTransformer {
    private final String internalName;

    public DumpTransformer(String internalName) {
        Objects.requireNonNull(internalName);
        this.internalName = internalName.replace(".", "/");
    }

    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (className.equals(internalName)) {
            String timeStamp = DateUtils.getTimeStamp();
            String filename = className.replace("/", ".") + "." + timeStamp + ".class";
            DumpUtils.dump(filename, classfileBuffer);
        }
        return null;
    }
}
```

### Run

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

file:///D:\git-repo\learn-java-agent\dump\java.lang.Object.2022.01.28.10.00.01.768.class
```

## 示例三：Dump（Regex）

本示例的目的是使用正则表达式（Regular Expression）将 JVM 当中已经加载的一些类导出。

### Agent Jar

#### DynamicAgent

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.util.ArrayList;
import java.util.List;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(DynamicAgent.class, "Agent-Class", agentArgs, inst);

        // 第二步，设置正则表达式：agentArgs
        RegexUtils.setPattern(agentArgs);

        // 第三步，使用 inst：进行 re-transform 操作
        ClassFileTransformer transformer = new DumpTransformer();
        inst.addTransformer(transformer, true);
        try {
            Class<?>[] classes = inst.getAllLoadedClasses();
            List<Class<?>> candidates = new ArrayList<>();
            for (Class<?> c : classes) {
                String className = c.getName();

                // 这些 if 判断的目的是：不考虑 JDK 自带的类
                if (className.startsWith("java")) continue;
                if (className.startsWith("javax")) continue;
                if (className.startsWith("jdk")) continue;
                if (className.startsWith("sun")) continue;
                if (className.startsWith("com.sun")) continue;
                if (className.startsWith("[")) continue;

                boolean isModifiable = inst.isModifiableClass(c);
                boolean isCandidate = RegexUtils.isCandidate(className);

                System.out.println("Loaded Class: " + className + " - " + isModifiable + ", " + isCandidate);
                if (isModifiable && isCandidate) {
                    candidates.add(c);
                }
            }

            System.out.println("candidates size: " + candidates.size());
            if (!candidates.isEmpty()) {
                inst.retransformClasses(candidates.toArray(new Class[0]));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

#### DumpTransformer

```java
package lsieun.instrument;

import lsieun.utils.DateUtils;
import lsieun.utils.DumpUtils;
import lsieun.utils.RegexUtils;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class DumpTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (RegexUtils.isCandidate(className)) {
            String timeStamp = DateUtils.getTimeStamp();
            String filename = className.replace("/", ".") + "." + timeStamp + ".class";
            DumpUtils.dump(filename, classfileBuffer);
        }
        return null;
    }
}
```

### Run

在 `run.instrument.DynamicInstrumentation` 类中，传入参数：

```text
vm.loadAgent(agent, "sample\\..*");
```

```text
file:///D:\git-repo\learn-java-agent\dump\sample.HelloWorld.2022.01.28.09.45.51.218.class
file:///D:\git-repo\learn-java-agent\dump\sample.Program.2022.01.28.09.45.51.223.class
```

## 注意事项

- 第一点，`retransformClasses()` 方法是针对已经加载的类（already loaded classes）。
- 第二点，如果某个方法正在执行（active stack frames），修改之后的方法会在下一次执行。
- 第三点，静态初始化（class initialization）不会再次执行，不受 `retransformClasses()` 方法的影响。
- 第四点，`retransformClasses()` 方法的功能是有限的，主要集中在对方法体（method body）的修改。
- 第五点，当 `retransformClasses()` 方法出现异常的时候，就相当于“什么都没有发生过”，不会对类产生影响。


This function facilitates the instrumentation of **already loaded classes**.

### active stack frames

If a retransformed method has active stack frames,
those active frames continue to run the bytecodes of the original method.
The retransformed method will be used on new invokes.

### initialization

This method does not cause any initialization except that which would occur under the customary JVM semantics.
In other words, redefining a class does not cause its initializers to be run.
The values of static variables will remain as they were prior to the call.

Instances of the retransformed class are not affected.

### restrictions

The retransformation may change method bodies, the constant pool and attributes.

The retransformation must not add, remove or rename fields or methods, change the signatures of methods, or change inheritance.
These restrictions maybe be lifted in future versions.

### exception

The class file bytes are not checked, verified and installed until after the transformations have been applied,
if the resultant bytes are in error this method will throw an exception.

If this method throws an exception, no classes have been retransformed.

## 总结

本文内容总结如下：

- 第一点，`retransformClasses()` 方法的主要作用是针对已经加载的类（already loaded classes）进行转换。
- 第二点，`retransformClasses()` 方法的一个特殊用途是将加载类的字节码进行导出。
- 第三点，在使用 `retransformClasses()` 方法的过程中，需要注意一些细节内容。
