---
title: "Instrumentation.setNativeMethodPrefix()"
sequence: "140"
---

[UP]({% link _java-agent/java-agent-01.md %})

## NativeMethodPrefix

我们的学习对象就是下面两个方法：

```java
public interface Instrumentation {
    // Since: 1.6
    boolean isNativeMethodPrefixSupported();
    // Since: 1.6
    void setNativeMethodPrefix(ClassFileTransformer transformer, String prefix);
}
```

- `isNativeMethodPrefixSupported`: Returns whether the current JVM configuration supports setting a native method prefix.
- `setNativeMethodPrefix`: When used with the `ClassFileTransformer`, it enables **native methods to be instrumented.**

## 示例：修改 native 方法

### 预期目标

我们的预期目标：对 native 方法进行 instrumentation 操作。

Since **native methods** cannot be directly instrumented (they have no bytecodes),
they must be wrapped with a non-native method which can be instrumented.

在 `java.lang.StrictMath` 类当中，有一个 `sin` 方法，它带有 `native` 访问标识：

```java
public final class StrictMath {
    public static native double sin(double a);
}
```

We could transform the class file (with the `ClassFileTransformer` during the **initial definition** of the class) so that this becomes:

> 注意：修改的时机是 **initial definition**。换句话说，在 load-time（加载的时候）进行 instrumentation。

```java
public final class StrictMath {
    public static double sin(double a) {
        double val = 10.0D;
        val += $$$MyAgentWrapped$$$_sin(a);
        return val;
    }

    public static native double $$$MyAgentWrapped$$$_sin(double a);
}
```

Where `sin` becomes a wrapper for the actual native method (`$$$MyAgentWrapped$$$_sin`) with the appended prefix "`$$$MyAgentWrapped$$$_`".

```text
# 修改前
Java: StrictMath.sin(double a)  ---> C: Java_java_lang_StrictMath_sin(JNIEnv *env, jclass unused, jdouble d)

# 修改后
Java: StrictMath.$$$MyAgentWrapped$$$_sin(double a)  ---> C: Java_java_lang_StrictMath_sin(JNIEnv *env, jclass unused, jdouble d)
```

在 OpenJDK 的源码中，`jdk/src/share/native/java/lang/StrictMath.c` 文件中记录了 `sin` 方法的实现：

```text
JNIEXPORT jdouble JNICALL
Java_java_lang_StrictMath_sin(JNIEnv *env, jclass unused, jdouble d)
{
    return (jdouble) jsin((double)d);
}
```

### 预览结果

为了对转换之后的内容有一个直观的理解，我们可以借助于下面的 `StaticInstrumentation` 生成一个示例：

```java
import lsieun.asm.visitor.*;
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import java.io.File;

public class StaticInstrumentation {
    public static void main(String[] args) {
        Class<?> clazz = StrictMath.class;
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
        ClassVisitor cv = new StrictMathVisitor(cw);

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);
        return cw.toByteArray();
    }
}
```

### Application

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.concurrent.TimeUnit;

public class Program {
    public static void main(String[] args) throws Exception {
        // 第一步，打印进程 ID
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);

        // 第二步，倒计时退出
        int count = 600;
        for (int i = 0; i < count; i++) {
            String info = String.format("|%03d| %s remains %03d seconds", i, nameOfRunningVM, (count - i));
            System.out.println(info);

            double value = StrictMath.sin(30);
            System.out.println(value);

            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

### Agent Jar

#### LoadTimeAgent

```java
package lsieun.agent;

import lsieun.cst.Const;
import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(LoadTimeAgent.class, "Premain-Class", agentArgs, inst);

        // 第二步，指定要处理的类
        String className = "java/lang/StrictMath";

        // 第三步，使用 inst：添加 transformer
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, false);
        inst.setNativeMethodPrefix(transformer, Const.NATIVE_PREFIX);
    }
}
```

#### DynamicAgent

```java
package lsieun.agent;

import lsieun.cst.Const;
import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(DynamicAgent.class, "Agent-Class", agentArgs, inst);

        // 第二步，指定要处理的类
        String className = "java.lang.StrictMath";

        // 第三步，使用 inst：进行 re-transform 操作
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, true);
        inst.setNativeMethodPrefix(transformer, Const.NATIVE_PREFIX);
        try {
            Class<?> clazz = Class.forName(className);
            if (inst.isModifiableClass(clazz)) {
                inst.retransformClasses(clazz);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
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
            ClassVisitor cv = new StrictMathVisitor(cw);

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

3284@LenovoWin7
|000| 3284@LenovoWin7 remains 600 seconds
-0.9880316240928618
...
```

#### Load-Time

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

3332@LenovoWin7
|000| 3332@LenovoWin7 remains 600 seconds
transform class: java/lang/StrictMath
9.011968375907138
...
```

#### setNativeMethodPrefix

在 `LoadTimeAgent` 类当中，注释掉以下语句：

```text
inst.setNativeMethodPrefix(transformer, Const.NATIVE_PREFIX);
```

再次运行，会遇到 `UnsatisfiedLinkError` 错误：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

2548@LenovoWin7
|000| 2548@LenovoWin7 remains 600 seconds
transform class: java/lang/StrictMath
Exception in thread "main" java.lang.UnsatisfiedLinkError: java.lang.StrictMath.$$$MyAgentWrapped$$$_sin(D)D
        at java.lang.StrictMath.$$$MyAgentWrapped$$$_sin(Native Method)
        at java.lang.StrictMath.sin(Unknown Source)
        at sample.Program.main(Program.java:18)
```

#### Can-x-Native-x-Prefix

将 `Can-Set-Native-Method-Prefix` 设置成 `false`，再次运行，会遇到 `UnsupportedOperationException` 异常：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

Exception in thread "main" java.lang.reflect.InvocationTargetException
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:401)
Caused by: java.lang.UnsupportedOperationException: setNativeMethodPrefix is not supported in this environment
        at sun.instrument.InstrumentationImpl.setNativeMethodPrefix(InstrumentationImpl.java:211)
        at lsieun.agent.LoadTimeAgent.premain(LoadTimeAgent.java:21)
        ... 6 more
FATAL ERROR in native method: processing of -javaagent failed
```

#### Dynamic: Unsupported

使用 Dynamic Attach 的方式来运行，会遇到 `UnsupportedOperationException` 异常：

```text
transform class: java/lang/StrictMath
java.lang.UnsupportedOperationException: class redefinition failed: attempted to add a method
	at sun.instrument.InstrumentationImpl.retransformClasses0(Native Method)
	at sun.instrument.InstrumentationImpl.retransformClasses(InstrumentationImpl.java:144)
	at lsieun.agent.DynamicAgent.agentmain(DynamicAgent.java:25)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
	at sun.instrument.InstrumentationImpl.loadClassAndCallAgentmain(InstrumentationImpl.java:411)
```

#### Dynamic: replace

修改 `StrictMathVisitor` 类的 `visitMethod()` 方法：替换掉 native 方法的实现。

```java
import lsieun.asm.cst.Const;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import static org.objectweb.asm.Opcodes.*;

/**
 * native method instrumentation.
 */
public class StrictMathVisitor extends ClassVisitor {
    public StrictMathVisitor(ClassVisitor classVisitor) {
        super(Const.ASM_VERSION, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        boolean isNative = (access & Opcodes.ACC_NATIVE) != 0;
        if (isNative && "sin".equals(name) && "(D)D".equals(descriptor)) {
            // ---> 修改开始
            int newAccess = access & (~Opcodes.ACC_NATIVE);
            MethodVisitor mv = super.visitMethod(newAccess, name, descriptor, signature, exceptions);
            if (mv != null) {
                mv.visitCode();
                mv.visitLdcInsn(new Double("10.0"));
                mv.visitInsn(DRETURN);
                mv.visitMaxs(2, 2);
                mv.visitEnd();
            }
            return null;
            // <--- 修改结束
        }
        else {
            return super.visitMethod(access, name, descriptor, signature, exceptions);
        }
    }

}
```

再次运行，输出结果：

```text
|007| 9304@LenovoWin7 remains 593 seconds
-0.9880316240928618


transform class: java/lang/StrictMath
|008| 9304@LenovoWin7 remains 592 seconds
10.0
```

## 总结

本文内容总结如下：

- 第一点，作用。`setNativeMethodPrefix` 方法的作用是为了对 native method 进行 instrumentation。
- 第二点，时机。对 native method 进行 instrumentation 的时机是 **initial definition** of the class。

