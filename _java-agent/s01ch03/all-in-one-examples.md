---
title: "All In One Examples"
sequence: "148"
---

## Application

### Program

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.Random;
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

            Random rand = new Random(System.currentTimeMillis());
            int a = rand.nextInt(10);
            int b = rand.nextInt(10);
            boolean flag = rand.nextBoolean();
            String message;
            if (flag) {
                message = String.format("a + b = %d", HelloWorld.add(a, b));
            }
            else {
                message = String.format("a - b = %d", HelloWorld.sub(a, b));
            }
            System.out.println(message);

            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

### HelloWorld

```java
package sample;

public class HelloWorld extends Object implements Cloneable {
    public int intValue;
    public String strValue;

    public static int add(int a, int b) {
        return a + b;
    }

    public static int sub(int a, int b) {
        return a - b;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

## Agent Jar

### define

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
        String className = "sample.HelloWorld";

        // 第三步，使用 inst：添加 transformer
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, false);
    }
}
```

### redefine

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.io.InputStream;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(DynamicAgent.class, "Agent-Class", agentArgs, inst);

        // 第二步，指定要修改的类
        String className = "sample.HelloWorld";

        // 第三步，使用 inst：进行 redefine 操作
        // ClassFileTransformer transformer = new StackTraceTransformer(className);
        // inst.addTransformer(transformer, true);
        try {
            Class<?> clazz = Class.forName(className);
            if (inst.isModifiableClass(clazz)) {
                String item = String.format("/%s.class", className.replace(".", "/"));
                System.out.println(item);
                InputStream in = LoadTimeAgent.class.getResourceAsStream(item);
                int available = in.available();
                byte[] bytes = new byte[available];
                in.read(bytes);
                ClassDefinition classDefinition = new ClassDefinition(clazz, bytes);
                inst.redefineClasses(classDefinition);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

### retransform

```java
package lsieun.agent;

import lsieun.instrument.*;
import lsieun.utils.*;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 第一步，打印信息：agentArgs, inst, classloader, thread
        PrintUtils.printAgentInfo(DynamicAgent.class, "Agent-Class", agentArgs, inst);

        // 第二步，指定要修改的类
        String className = "sample.HelloWorld";

        // 第三步，使用 inst：进行 re-transform 操作
        ClassFileTransformer transformer = new ASMTransformer(className);
        inst.addTransformer(transformer, true);
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

## Run

|                    | define | redefine | retransform |
|--------------------|--------|----------|-------------|
| Interface Add      | OK     | NO       | NO          |
| Field Add          | OK     | NO       | NO          |
| Method Add         | OK     | NO       | NO          |
| Method Remove      | OK     | NO       | NO          |
| Method Body Modify | OK     | OK       | OK          |

### Interface Add

在 `ASMTransformer` 当中，修改代码：

```text
ClassVisitor cv = new AddInterfaceVisitor(cw, "java/io/Serializable");
```

在 define 的情况下，正常运行；在 redefine 和 retransform 的情况下，则出现 `UnsupportedOperationException` 异常：

```text
java.lang.UnsupportedOperationException: class redefinition failed: attempted to change superclass or interfaces
```

### Field Add

在 `ASMTransformer` 当中，修改代码：

```text
ClassVisitor cv = new AddFiledVisitor(cw, Opcodes.ACC_PUBLIC, "objValue", "Ljava/lang/Object;");
```

在 define 的情况下，正常运行；在 redefine 和 retransform 的情况下，则出现 `UnsupportedOperationException` 异常：

```text
java.lang.UnsupportedOperationException: class redefinition failed: attempted to change the schema (add/remove fields)
```

### Method Add

在 `ASMTransformer` 当中，修改代码：

```text
ClassVisitor cv = new AddMethodVisitor(cw, Opcodes.ACC_PUBLIC, "mul", "(II)I", null, null) {
    @Override
    protected void generateMethodBody(MethodVisitor mv) {
        mv.visitCode();
        mv.visitVarInsn(Opcodes.ILOAD, 1);
        mv.visitVarInsn(Opcodes.ILOAD, 2);
        mv.visitInsn(Opcodes.IMUL);
        mv.visitInsn(Opcodes.IRETURN);
        mv.visitMaxs(2, 3);
        mv.visitEnd();
    }
};
```

在 define 的情况下，正常运行；在 redefine 和 retransform 的情况下，则出现 `UnsupportedOperationException` 异常：

```text
java.lang.UnsupportedOperationException: class redefinition failed: attempted to add a method
```

### Method Remove

在 `ASMTransformer` 当中，修改代码：

```text
ClassVisitor cv = new RemoveMethodVisitor(cw, "sub", "(II)I");
```

在 define 的情况下，正常运行；在 redefine 和 retransform 的情况下，则出现 `UnsupportedOperationException` 异常：

```text
java.lang.UnsupportedOperationException: class redefinition failed: attempted to delete a method
```

### Method Body Modify

在 `ASMTransformer` 当中，修改代码：

```text
ClassVisitor cv = new PrintMethodParameterVisitor(cw);
```

在 define 的情况下，正常运行；在 redefine 和 retransform 的情况下，也正常运行。

### Stack Trace

将 `ASMTransformer` 类替换成 `StackTraceTransformer` 类。

在 define 情况，从下面的输出结果可以看到是 `ClassLoader.defineClass()` 方法触发的：

```text
$ java -cp ./target/classes/ -javaagent:./target/TheAgent.jar sample.Program

java.lang.Exception: Exception From lsieun.instrument.StackTraceTransformer
        at lsieun.instrument.StackTraceTransformer.transform(StackTraceTransformer.java:23)
        at sun.instrument.TransformerManager.transform(TransformerManager.java:188)
        at sun.instrument.InstrumentationImpl.transform(InstrumentationImpl.java:428)
        at java.lang.ClassLoader.defineClass1(Native Method)
        at java.lang.ClassLoader.defineClass(ClassLoader.java:756)
        at java.security.SecureClassLoader.defineClass(SecureClassLoader.java:142)
        at java.net.URLClassLoader.defineClass(URLClassLoader.java:468)
        at java.net.URLClassLoader.access$100(URLClassLoader.java:74)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:369)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:363)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(URLClassLoader.java:362)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:355)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
        at sample.Program.main(Program.java:25)
```

在 redefine 情况，从下面的输出结果可以看到是 `InstrumentationImpl.redefineClasses()` 方法触发的：

```text
java.lang.Exception: Exception From lsieun.instrument.StackTraceTransformer
        at lsieun.instrument.StackTraceTransformer.transform(StackTraceTransformer.java:23)
        at sun.instrument.TransformerManager.transform(TransformerManager.java:188)
        at sun.instrument.InstrumentationImpl.transform(InstrumentationImpl.java:428)
        at sun.instrument.InstrumentationImpl.redefineClasses0(Native Method)
        at sun.instrument.InstrumentationImpl.redefineClasses(InstrumentationImpl.java:170)
        at lsieun.agent.DynamicAgent.agentmain(DynamicAgent.java:32)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallAgentmain(InstrumentationImpl.java:411)
```

在 retransform 情况，从下面的输出结果可以看到是 `InstrumentationImpl.retransformClasses()` 方法触发的：

```text
java.lang.Exception: Exception From lsieun.instrument.StackTraceTransformer
        at lsieun.instrument.StackTraceTransformer.transform(StackTraceTransformer.java:23)
        at sun.instrument.TransformerManager.transform(TransformerManager.java:188)
        at sun.instrument.InstrumentationImpl.transform(InstrumentationImpl.java:428)
        at sun.instrument.InstrumentationImpl.retransformClasses0(Native Method)
        at sun.instrument.InstrumentationImpl.retransformClasses(InstrumentationImpl.java:144)
        at lsieun.agent.DynamicAgent.agentmain(DynamicAgent.java:42)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.instrument.InstrumentationImpl.loadClassAndStartAgent(InstrumentationImpl.java:386)
        at sun.instrument.InstrumentationImpl.loadClassAndCallAgentmain(InstrumentationImpl.java:411)
```
