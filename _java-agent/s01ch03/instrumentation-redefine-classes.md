---
title: "Instrumentation.redefineClasses()"
sequence: "134"
---

[UP]({% link _java-agent/java-agent-01.md %})

## redefine

### redefineClasses

Redefine the supplied set of classes using the supplied class files.

```java
public interface Instrumentation {
    void redefineClasses(ClassDefinition... definitions)
        throws ClassNotFoundException, UnmodifiableClassException;
}
```

This method operates on a set in order to allow interdependent changes to **more than one class** at the same time
(a redefinition of class A can require a redefinition of class B).

### ClassDefinition

#### class info

```java
public final class ClassDefinition {
}
```

#### fields

```java
public final class ClassDefinition {
    private final Class<?> mClass;
    private final byte[] mClassFile;
}
```

#### constructor

```java
public final class ClassDefinition {
    public ClassDefinition(Class<?> theClass, byte[] theClassFile) {
        if (theClass == null || theClassFile == null) {
            throw new NullPointerException();
        }
        mClass      = theClass;
        mClassFile  = theClassFile;
    }
}
```

#### methods

```java
public final class ClassDefinition {
    public Class<?> getDefinitionClass() {
        return mClass;
    }

    public byte[] getDefinitionClassFile() {
        return mClassFile;
    }
}
```

## 示例一：替换 Object 类

### StaticInstrumentation

在 `StaticInstrumentation` 类当中，主要是对 `java.lang.Object` 类的 `byte[]` 内容进行修改：让 `toString()` 方法返回 `This is an object.` 字符串。

修改前：

```java
public class Object {
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}
```

修改后：

```java
public class Object {
    public String toString() {
        return "This is an object.";
    }  
}
```

将修改后 `byte[]` 内容保存到工作目录下的 `target/classes/data/java/lang/Object.class` 文件中。

```java
import lsieun.asm.visitor.*;
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import java.io.File;

public class StaticInstrumentation {
    public static void main(String[] args) {
        Class<?> clazz = Object.class;
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
        ClassVisitor cv = new ToStringVisitor(cw, "This is an object.");

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
        return cw.toByteArray();
    }
}
```

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

```java
package lsieun.agent;

import lsieun.utils.*;

import java.io.InputStream;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，redefine
        try {
            Class<?> clazz = Object.class;
            if (inst.isModifiableClass(clazz)) {
                InputStream in = LoadTimeAgent.class.getResourceAsStream("/data/java/lang/Object.class");
                int available = in.available();
                byte[] bytes = new byte[available];
                in.read(bytes);
                ClassDefinition classDefinition = new ClassDefinition(clazz, bytes);
                inst.redefineClasses(classDefinition);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 运行

第一次运行，直接运行 `sample.Program` 类：

```text
$ java -cp ./target/classes/ sample.Program
java.lang.Object@15db9742
```

第二次运行，加载 `TheAgent.jar` 运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1704856573
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

This is an object.
```

第三次运行，在 `pom.xml` 文件中，将 `Can-Redefine-Classes` 设置成 `false`：

```text
<Can-Redefine-Classes>false</Can-Redefine-Classes>
```

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
Picked up JAVA_TOOL_OPTIONS: -Duser.language=en -Duser.country=US
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl@1704856573
    (4) Can-Redefine-Classes: false
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

java.lang.UnsupportedOperationException: redefineClasses is not supported in this environment
        at sun.instrument.InstrumentationImpl.redefineClasses(InstrumentationImpl.java:156)
        at lsieun.agent.LoadTimeAgent.premain(LoadTimeAgent.java:23)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)
java.lang.Object@70dea4e
```

## 示例二：Hot Swap

### Application

#### Program.java

```java
package sample;

public class Program {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        for (int i = 1; i < 20; i++) {
            instance.test(12, 3);
            System.out.println("intValue: " + HelloWorld.intValue);
        }
    }
}
```

#### HelloWorld.java

```java
package sample;

public class HelloWorld {
    public static int intValue = 20;

    public void test(int a, int b) {
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        try {
            Thread.sleep(5000);
        } catch (Exception ignored) {
        }
        int c = a * b;
        System.out.println("a * b = " + c);
        System.out.println("============");
        System.out.println();
    }
}
```

### Agent Jar

#### Agent Class

```java
import lsieun.thread.HotSwapThread;

import java.lang.instrument.Instrumentation;

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

        Thread t = new HotSwapThread("hot-swap-thread", inst);
        t.setDaemon(true);
        t.start();
    }
}
```

#### HotSwapThread

```java
import java.io.InputStream;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.Instrumentation;
import java.nio.file.*;
import java.util.List;

import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;

public class HotSwapThread extends Thread {
    private final Instrumentation inst;

    public HotSwapThread(String name, Instrumentation inst) {
        super(name);
        this.inst = inst;
    }

    @Override
    public void run() {
        try {
            FileSystem fs = FileSystems.getDefault();
            WatchService watchService = fs.newWatchService();
            // 注意：修改这里的路径信息
            Path watchPath = fs.getPath("D:\\git-repo\\learn-java-agent\\target\\classes\\sample\\");
            watchPath.register(watchService, ENTRY_MODIFY);
            WatchKey changeKey;
            while ((changeKey = watchService.take()) != null) {
                // Prevent receiving two separate ENTRY_MODIFY events: file modified and timestamp updated.
                // Instead, receive one ENTRY_MODIFY event with two counts.
                Thread.sleep( 50 );

                System.out.println("Thread Id: ===>" + Thread.currentThread().getName() + "@" + Thread.currentThread().getId());
                List<WatchEvent<?>> watchEvents = changeKey.pollEvents();
                for (WatchEvent<?> watchEvent : watchEvents) {
                    // Ours are all Path type events:
                    WatchEvent<Path> pathEvent = (WatchEvent<Path>) watchEvent;

                    Path path = pathEvent.context();
                    WatchEvent.Kind<Path> eventKind = pathEvent.kind();
                    System.out.println(eventKind + "(" + pathEvent.count() +")" + " for path: " + path);
                    String filepath = path.toFile().getCanonicalPath();
                    if (!filepath.endsWith("HelloWorld.class")) continue;

                    Class<?> clazz = Class.forName("sample.HelloWorld");
                    if (inst.isModifiableClass(clazz)) {
                        System.out.println("Before Redefine");
                        InputStream in = clazz.getResourceAsStream("HelloWorld.class");
                        int available = in.available();
                        byte[] bytes = new byte[available];
                        in.read(bytes);
                        ClassDefinition classDefinition = new ClassDefinition(clazz, bytes);
                        inst.redefineClasses(classDefinition);
                        System.out.println("After Redefine");
                    }

                }
                changeKey.reset(); // Important!
                System.out.println("Thread Id: <===" + Thread.currentThread().getName() + "@" + Thread.currentThread().getId());
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

### Run

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

===>Premain-Class: lsieun.agent.LoadTimeAgent
ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
Thread Id: main@1
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
a = 12
b = 3
a * b = 36
============

a = 12
b = 3
Thread Id: ===>hot-swap-thread@6
ENTRY_MODIFY(1) for path: HelloWorld.class
Before Redefine
After Redefine
Thread Id: <===hot-swap-thread@6
a * b = 36                                               // 注意：这里仍然执行乘法操作
============

a = 12
b = 3
a + b = 15
============

a = 12
b = 3
a + b = 15
============
```

在 `Instrumentation.redefineClasses` 方法的 API 中描述到：
If a redefined method has **active stack frames**,
those active frames continue to run the bytecodes of the original method.
The redefined method will be used on new invokes.

## 细节之处

- 第一点，`redefineClasses()` 方法是对已经加载的类进行以“新”换“旧”操作。
- 第二点，如果某个方法正在执行（active stack frames），修改之后的方法会在下一次执行。
- 第三点，静态初始化（class initialization）不会再次执行，不受 `redefineClasses()` 方法的影响。
- 第四点，`redefineClasses()` 方法的功能是有限的，主要集中在对方法体（method body）的修改。
- 第五点，当 `redefineClasses()` 方法出现异常的时候，就相当于“什么都没有发生过”，不会对类产生影响。

### fix-and-continue

This method is used to **replace** the definition of a class without reference to **the existing class file bytes**,
as one might do when recompiling from source for **fix-and-continue** debugging.
Where **the existing class file bytes** are to be transformed (for example in bytecode instrumentation) `retransformClasses` should be used.

### active stack frames

If a redefined method has **active stack frames**, those active frames continue to run the bytecodes of the original method.
The redefined method will be used on new invokes.

### initialization

This method does not cause any initialization except that which would occur under the customary JVM semantics.
In other words, redefining a class does not cause its initializers to be run.
The values of static variables will remain as they were prior to the call.

Instances of the redefined class are not affected.

### restrictions

The redefinition may change method bodies, the constant pool and attributes.

The redefinition must not add, remove or rename fields or methods,
change the signatures of methods, or change inheritance.
These restrictions maybe be lifted in future versions.

### exception

The class file bytes are not checked, verified and installed until after the transformations have been applied,
if the resultant bytes are in error this method will throw an exception.

If this method throws an exception, no classes have been redefined.

## 总结

本文内容总结如下：

- 第一点，`redefineClasses()` 方法可以对 Class 进行重新定义。
- 第二点，`redefineClasses()` 方法的一个使用场景就是 fix-and-continue。
- 第三点，使用 `redefineClasses()` 方法需要注意一些细节。

