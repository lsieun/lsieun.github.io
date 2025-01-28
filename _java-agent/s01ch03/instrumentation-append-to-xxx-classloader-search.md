---
title: "Instrumentation.appendToXxxClassLoaderSearch()"
sequence: "139"
---

## ClassLoaderSearch

```java
public interface Instrumentation {
    // 1.6
    void appendToBootstrapClassLoaderSearch(JarFile jarfile);
    // 1.6
    void appendToSystemClassLoaderSearch(JarFile jarfile);
}
```

- `void appendToBootstrapClassLoaderSearch(JarFile jarfile)`: Specifies a JAR file with instrumentation classes to be defined by the **bootstrap class loader**.
  - When the virtual machine's built-in class loader, known as the "bootstrap class loader", unsuccessfully searches for a class, the entries in the JAR file will be searched as well.
  - This method may be used **multiple times** to add multiple JAR files to be searched in the order that this method was invoked.
  - The agent should take care to ensure that the JAR does not contain any classes or resources other than those to be defined by the bootstrap class loader for the purpose of instrumentation.
    Failure to observe this warning could result in unexpected behavior that is difficult to diagnose.
- `void appendToSystemClassLoaderSearch(JarFile jarfile)`: Specifies a JAR file with instrumentation classes to be defined by the **system class loader**.
  - When the system class loader for delegation unsuccessfully searches for a class, the entries in the JarFile will be searched as well.
  - This method may be used **multiple times** to add multiple JAR files to be searched in the order that this method was invoked.
  - The agent should take care to ensure that the JAR does not contain any classes or resources other than those to be defined by the system class loader for the purpose of instrumentation.
    Failure to observe this warning could result in unexpected behavior that is difficult to diagnose (see appendToBootstrapClassLoaderSearch).
  - This method does not change the value of `java.class.path` system property.

这两个方法很相似，都是将 `JarFile` 添加到 class path 当中，不同的地方在于：一个是添加到 bootstrap classloader，另一个是添加到 system classloader。

这两个方法的共同点，还体现在：

- 方法可以调用多次，来添加多个 `JarFile`。
- 使用时候要注意，只添加必要的 `JarFile`；否则，可能会造成无法预料的问题。

## 示例一：Class Path

本示例的目的：看看这两个方法对 class path 有什么影响。

### Application

#### 版本一

第一个版本，通过 `URLClassLoader.getURLs()` 来获取 class path

```java
package sample;

import lsieun.utils.PrintUtils;

public class Program {
    public static void main(String[] args) {
        PrintUtils.printBootstrapClassPath();
        PrintUtils.printExtensionClassPath();
        PrintUtils.printApplicationClassPath();
    }
}
```

#### 版本二

第二个版本，通过读取属性（例如，`java.class.path`）来获取 class path

```java
package sample;

import lsieun.utils.ClassPathType;
import lsieun.utils.PrintUtils;

public class Program {
    public static void main(String[] args) {
        PrintUtils.printClassPath(ClassPathType.SUN_BOOT_CLASS_PATH);
        PrintUtils.printClassPath(ClassPathType.JAVA_EXT_DIRS);
        PrintUtils.printClassPath(ClassPathType.JAVA_CLASS_PATH);
    }
}
```

### Agent Jar

```java
import lsieun.utils.ArgUtils;
import lsieun.utils.JarUtils;
import lsieun.utils.PrintUtils;

import java.io.IOException;
import java.lang.instrument.Instrumentation;
import java.util.jar.JarFile;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws IOException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，添加 Class Search Path
        String jarPath = JarUtils.getToolsJarPath();
        JarFile jarFile = new JarFile(jarPath);
        String append = ArgUtils.parseAgentArgs(agentArgs, "append");
        if ("app".equals(append)) {
            inst.appendToSystemClassLoaderSearch(jarFile);
            System.out.println("Append to Application Class Path: " + jarPath);
        }
        else if ("boot".equals(append)) {
            inst.appendToBootstrapClassLoaderSearch(jarFile);
            System.out.println("Append to Bootstrap Class Path: " + jarPath);
        }
        else {
            System.out.println("No Append: " + jarPath);
        }


        // 第三步，加载 Class
        String className = ArgUtils.parseAgentArgs(agentArgs, "class");
        if (className != null) {
            System.out.println("try to load class: " + className);
            try {
                Class<?> clazz = Class.forName(className);
                ClassLoader loader = clazz.getClassLoader();
                String message = String.format("load class %s from %s", clazz.getName(), loader);
                System.out.println(message);
            } catch (ClassNotFoundException e) {
                System.out.println("load class failed: " + className);
                e.printStackTrace();
            }
        }
    }
}
```

### Run

#### None

```text
$ java -cp ./target/classes/ sample.Program
Picked up JAVA_TOOL_OPTIONS: -Duser.language=en -Duser.country=US
=========Bootstrap ClassPath=========
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/resources.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/rt.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/sunrsasign.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/jsse.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/jce.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/charsets.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/jfr.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/classes

=========Extension ClassPath=========
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/access-bridge-64.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/cldrdata.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/dnsns.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/jaccess.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/jfxrt.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/localedata.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/nashorn.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/sunec.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/sunjce_provider.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/sunmscapi.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/sunpkcs11.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/ext/zipfs.jar

=========Application ClassPath=========
--->file:/D:/git-repo/learn-java-agent/target/classes/
```

#### Load-Time

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: null
    (3) Instrumentation: sun.instrument.InstrumentationImpl
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

No Append: C:\Program Files\Java\jdk1.8.0_301\lib\tools.jar
=========Bootstrap ClassPath=========
......

=========Extension ClassPath=========
......

=========Application ClassPath=========
--->file:/D:/git-repo/learn-java-agent/target/classes/
--->file:/D:/git-repo/learn-java-agent/target/TheAgent.jar         // 注意，这里是新添加的内容
```

#### Class-Path

在 `TheAgent.jar` 的 `META-INF/MANIFEST.MF` 文件中，有 `Class-Path` 属性：

```text
Class-Path: lib/asm-9.2.jar lib/asm-util-9.2.jar lib/asm-commons-9.2.jar
 lib/asm-tree-9.2.jar lib/asm-analysis-9.2.jar
```

```text
class=org.objectweb.asm.Opcodes
```

再次运行时，添加 `class:org.objectweb.asm.Opcodes` 选项：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=class=org.objectweb.asm.Opcodes sample.Program
Picked up JAVA_TOOL_OPTIONS: -Duser.language=en -Duser.country=US
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: class=org.objectweb.asm.Opcodes
    (3) Instrumentation: sun.instrument.InstrumentationImpl
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

No Append: C:\Program Files\Java\jdk1.8.0_301\lib\tools.jar
try to load class: org.objectweb.asm.Opcodes
load class org.objectweb.asm.Opcodes from sun.misc.Launcher$AppClassLoader@18b4aac2    // 注意，Opcodes 类是从 Class-Path 中加载到的
=========Bootstrap ClassPath=========
......

=========Extension ClassPath=========
......

=========Application ClassPath=========
--->file:/D:/git-repo/learn-java-agent/target/classes/
--->file:/D:/git-repo/learn-java-agent/target/TheAgent.jar
```

#### SystemCLSearch

测试目标：

- 将 `tools.jar` 文件添加到 System ClassLoader 的搜索范围
- 尝试加载 `com.sun.tools.attach.VirtualMachine` 类，该类位于 `tools.jar` 文件内

```text
append=app,class=com.sun.tools.attach.VirtualMachine
```

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=append=app,class=com.sun.tools.attach.VirtualMachine sample.Program
Picked up JAVA_TOOL_OPTIONS: -Duser.language=en -Duser.country=US
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: append=app,class=com.sun.tools.attach.VirtualMachine
    (3) Instrumentation: sun.instrument.InstrumentationImpl
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

Append to Application Class Path: C:\Program Files\Java\jdk1.8.0_301\lib\tools.jar
try to load class: com.sun.tools.attach.VirtualMachine
load class com.sun.tools.attach.VirtualMachine from sun.misc.Launcher$AppClassLoader@18b4aac2    // 注意，这里是由 AppClassLoader 加载
=========Bootstrap ClassPath=========
......

=========Extension ClassPath=========
......

=========Application ClassPath=========
--->file:/D:/git-repo/learn-java-agent/target/classes/
--->file:/D:/git-repo/learn-java-agent/target/TheAgent.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/lib/tools.jar    // 注意，这里是 tools.jar 文件
```

#### BootstrapCLSearch

测试目标：

- 将 `tools.jar` 文件添加到 Bootstrap ClassLoader 的搜索范围
- 尝试加载 `com.sun.tools.attach.VirtualMachine` 类，该类位于 `tools.jar` 文件内

```text
append=boot,class=com.sun.tools.attach.VirtualMachine
```

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar=append=boot,class=com.sun.tools.attach.VirtualMachine sample.Program
Picked up JAVA_TOOL_OPTIONS: -Duser.language=en -Duser.country=US
========= ========= ========= SEPARATOR ========= ========= =========
Agent Class Info:
    (1) Premain-Class: lsieun.agent.LoadTimeAgent
    (2) agentArgs: append=boot,class=com.sun.tools.attach.VirtualMachine
    (3) Instrumentation: sun.instrument.InstrumentationImpl
    (4) Can-Redefine-Classes: true
    (5) Can-Retransform-Classes: true
    (6) Can-Set-Native-Method-Prefix: true
    (7) Thread Id: main@1(false)
    (8) ClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2
========= ========= ========= SEPARATOR ========= ========= =========

Append to Bootstrap Class Path: C:\Program Files\Java\jdk1.8.0_301\lib\tools.jar
try to load class: com.sun.tools.attach.VirtualMachine
load class com.sun.tools.attach.VirtualMachine from null    // 注意，这里是由 Bootstrap ClassLoader 加载
=========Bootstrap ClassPath=========
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/resources.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/rt.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/sunrsasign.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/jsse.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/jce.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/charsets.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/lib/jfr.jar
--->file:/C:/Program%20Files/Java/jdk1.8.0_301/jre/classes    // 注意，并没有出现 tools.jar

=========Extension ClassPath=========
......

=========Application ClassPath=========
--->file:/D:/git-repo/learn-java-agent/target/classes/
--->file:/D:/git-repo/learn-java-agent/target/TheAgent.jar
```

## 示例二：Bootstrap Search

本示例是介绍一种应用场景：JDK 的内部类如何调用我们自己写的类。

`StrictMath` 修改之前的代码：

```java
public final class StrictMath {
    public static int addExact(int x, int y) {
        return Math.addExact(x, y);
    }
}
```

`StrictMath` 第一次修改：（正常）

```java
public final class StrictMath {
    public static int addExact(int var0, int var1) {
        System.out.println("Method Enter: java/lang/StrictMath.addExact(II)I");
        return Math.addExact(var0, var1);
    }
}
```

`StrictMath` 第二次修改：（出错）

```java
public final class StrictMath {
    public static int addExact(int var0, int var1) {
        ParameterUtils.printText("Method Enter: java/lang/StrictMath.addExact(II)I");
        return Math.addExact(var0, var1);
    }
}
```

### Application

```java
package sample;

public class Program {
    public static void main(String[] args) {
        int sum = StrictMath.addExact(10, 20);
        System.out.println(sum);
    }
}
```

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

        // 第二步，指定要修改的类
        String className = "java.lang.StrictMath";
        
        // 第三步，使用 inst：添加 transformer
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, false);
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
            ClassVisitor cv = new MethodEnterVisitor(cw);

            int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
            cr.accept(cv, parsingOptions);

            return cw.toByteArray();
        }

        return null;
    }
}
```

#### MethodEnterVisitor

```java
import lsieun.cst.Const;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MethodEnterVisitor extends ClassVisitor {
    private String owner;

    public MethodEnterVisitor(ClassVisitor classVisitor) {
        super(Const.ASM_VERSION, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & Opcodes.ACC_ABSTRACT) == Opcodes.ACC_ABSTRACT;
            boolean isNativeMethod = (access & Opcodes.ACC_NATIVE) == Opcodes.ACC_NATIVE;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodEnterAdapter(mv, owner, name, descriptor);
            }
        }
        return mv;
    }

    private static class MethodEnterAdapter extends MethodVisitor {
        private final String owner;
        private final String methodName;
        private final String methodDesc;

        public MethodEnterAdapter(MethodVisitor methodVisitor, String owner, String methodName, String methodDesc) {
            super(Const.ASM_VERSION, methodVisitor);
            this.owner = owner;
            this.methodName = methodName;
            this.methodDesc = methodDesc;
        }

        @Override
        public void visitCode() {
            // 首先，处理自己的代码逻辑
            String message = String.format("Method Enter: %s.%s%s", owner, methodName, methodDesc);
            // (1) 引用自定义的类
//            super.visitLdcInsn(message);
//            super.visitMethodInsn(Opcodes.INVOKESTATIC, "lsieun/utils/ParameterUtils", "printText", "(Ljava/lang/String;)V", false);

            // (2) 引用 JDK 的内部类
            super.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            super.visitLdcInsn(message);
            super.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);

            // 其次，调用父类的方法实现
            super.visitCode();
        }
    }
}
```

### 出现问题

当我们使用 `MethodEnterAdapter` 类当中第(2)种方式时，不会出现错误；但是，当我们使用第(1)种方式时，就会出现 `NoClassDefFoundError` 错误：

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

transform class: java/lang/StrictMath
Exception in thread "main" java.lang.NoClassDefFoundError: lsieun/utils/ParameterUtils
        at java.lang.StrictMath.addExact(Unknown Source)
        at sample.Program.main(Program.java:5)
```

### 解决问题

那么，如何解决这个问题呢？

首先，我们可以将 `lsieun.utils.ParameterUtils` 放到一个 `.jar` 文件当中，取名为 `lsieun-utils.jar`：

```text
jar -cvf lsieun-utils.jar lsieun/utils/ParameterUtils.class
```

第一种解决方式，我们在代码当中调用 `Instrumentation.appendToBootstrapClassLoaderSearch()` 方法来加载 `lsieun-utils.jar`：

```java
import lsieun.instrument.*;
import lsieun.utils.*;

import java.io.IOException;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.util.jar.JarFile;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws IOException {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，指定要修改的类
        String className = "java.lang.StrictMath";

        // 第三步，使用 inst：添加 transformer
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, false);

        // 第四步，添加 jar 包
        String jarPath = "D:\\git-repo\\learn-java-agent\\target\\lsieun-utils.jar";
        JarFile jarFile = new JarFile(jarPath);
        inst.appendToBootstrapClassLoaderSearch(jarFile);
    }
}
```

第二种解决方式，在 `MANIFEST.MF` 文件中添加 `Boot-Class-Path` 属性：

```text
<Boot-Class-Path>lsieun-utils.jar</Boot-Class-Path>
```

## 总结

本文内容总结如下：

- 第一点，这两个方法的本质就是“请求支援”。当前的 Agent Jar 没有办法实现某种功能，因此请求外来的 `JarFile` 来协助。
- 第二点，示例一是演示两个方法对于 class path 的影响。
- 第三点，示例二是介绍了一种使用 `void appendToBootstrapClassLoaderSearch(JarFile jarfile)` 的场景：JDK 的内部类如何调用我们自己写的类。
