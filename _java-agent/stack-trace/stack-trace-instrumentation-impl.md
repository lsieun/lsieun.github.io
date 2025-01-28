---
title: "Stack Trace: InstrumentationImpl"
sequence: "612"
---

[UP]({% link _java-agent/java-agent-01.md %})

## Application

### HelloWorld.java

```java
package sample;

public class HelloWorld {
    public void test() {
        Class<?> clazz = HelloWorld.class;
        System.out.println("===>Class: " + clazz.getName());
        System.out.println("ClassLoader: " + clazz.getClassLoader());
        System.out.println("Thread Id: " + Thread.currentThread().getName() + "@" + Thread.currentThread().getId());
        System.out.println("This is test method from HelloWorld class.");
        System.out.println("==========================================");
    }
}
```

### Program.java

```java
public class Program {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Program.class;
        System.out.println("===>Class: " + clazz.getName());
        System.out.println("ClassLoader: " + clazz.getClassLoader());
        System.out.println("This is main method from Program class.");
        System.out.println("=======================================");

        for (int i = 0; i < 10; i++) {
            HelloWorld instance = new HelloWorld();
            instance.test();
            Thread.sleep(5000);
        }
    }
}
```

## StaticInstrumentation

预期目标：修改 `sun.instrument.InstrumentationImpl` 的 `transform` 方法，打印相关信息。

```java
import lsieun.asm.visitor.*;
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;
import sun.instrument.InstrumentationImpl;

import java.io.File;
import java.util.EnumSet;
import java.util.Set;

public class StaticInstrumentation {
    public static void main(String[] args) {
        Class<?> clazz = InstrumentationImpl.class;
        String user_dir = System.getProperty("user.dir");
        String filepath = user_dir + File.separator +
                "target" + File.separator +
                "classes" + File.separator +
                "data" + File.separator +
                clazz.getName().replace(".", "/") + ".class";
        filepath = filepath.replace(File.separator, "/");

        byte[] bytes = dump(clazz);
        FileUtils.writeBytes(filepath, bytes);
        System.out.println("file:///" + filepath);
    }

    public static byte[] dump(Class<?> clazz) {
        String className = clazz.getName();
        byte[] bytes = FileUtils.readClassBytes(className);

        ClassReader cr = new ClassReader(bytes);
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        Set<MethodInfo> flags = EnumSet.of(
                MethodInfo.NAME_AND_DESC,    // 打印方法名和描述符
                MethodInfo.PARAMETER_VALUES, // 打印方法接收的参数值
                MethodInfo.CLASSLOADER,      // 打印 ClassLoader
                MethodInfo.THREAD_INFO,      // 打印线程 ID
                MethodInfo.STACK_TRACE);     // 打印 Stack Trace
        ClassVisitor cv = new PrintMethodInfoVisitor(cw, "transform", "*", flags);

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
        return cw.toByteArray();
    }
}
```

## Agent.jar

### LoadTimeAgent.java

```java
package lsieun.agent;

import java.io.IOException;
import java.io.InputStream;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.Instrumentation;
import java.lang.instrument.UnmodifiableClassException;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        Class<?> agentClass = LoadTimeAgent.class;
        System.out.println("===>Premain-Class: " + agentClass.getName());
        System.out.println("ClassLoader: " + agentClass.getClassLoader());
        System.out.println("Thread Id: " + Thread.currentThread().getName() + "@" + Thread.currentThread().getId());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");

        try {
            Class<?> clazz = Class.forName("sun.instrument.InstrumentationImpl");
            if (inst.isModifiableClass(clazz)) {
                String resource = "/data/" + clazz.getName().replace(".", "/") + ".class";
                System.out.println("resource: " + resource);
                InputStream in = LoadTimeAgent.class.getResourceAsStream(resource);
                int available = in.available();
                byte[] bytes = new byte[available];
                in.read(bytes);
                ClassDefinition classDefinition = new ClassDefinition(clazz, bytes);
                inst.redefineClasses(classDefinition);
            }
        } catch (ClassNotFoundException | UnmodifiableClassException | IOException e) {
            e.printStackTrace();
        }
    }
}
```

### DynamicAgent.java

```java
package lsieun.agent;

import lsieun.instrument.*;

import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        Class<?> agentClass = DynamicAgent.class;
        System.out.println("===>Agent-Class: " + agentClass.getName());
        System.out.println("ClassLoader: " + agentClass.getClassLoader());
        System.out.println("Thread Id: " + Thread.currentThread().getName() + "@" + Thread.currentThread().getId());
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");

        inst.addTransformer(new InfoTransformer(), true);

        try {
            Class<?> clazz = Class.forName("sample.HelloWorld");
            if (inst.isModifiableClass(clazz)) {
                inst.retransformClasses(clazz);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

## 运行

```text
mvn compile package
```

### 第一次运行

```text
$ java -cp ./target/classes/ sample.Program
===>Class: sample.Program
ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
This is main method from Program class.
=======================================
===>Class: sample.HelloWorld
ClassLoader: sun.misc.Launcher$AppClassLoader@73d16e93
Thread Id: main@1
This is test method from HelloWorld class.
==========================================
```

### 第二次运行

```text
$ java -jar ./target/TheAgent.jar
Usage:
    java -javaagent:/path/to/TheAgent.jar sample.Program
Example:
    java -cp ./target/classes sample.Program
    java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
```
