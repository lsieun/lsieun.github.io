---
title: "手工打包（三）：Dynamic Agent 打印方法接收的参数"
sequence: "105"
---

[UP]({% link _java-agent/java-agent-01.md %})

## 预期目标

我们的预期目标：借助于 JDK 内置的 ASM 打印出方法接收的参数，使用 Dynamic Instrumentation 的方式实现。

![](/assets/images/java/agent/virtual-machine-of-dynamic-instrumentation.png)


开发环境：

- JDK 版本：Java 8
- 编辑器：记事本（Windows）或 `vi` （Linux）

代码目录结构：[Code](/assets/zip/java-agent-manual-03.zip)

```text
java-agent-manual-03
└─── src
     ├─── attach
     │    └─── VMAttach.java
     ├─── lsieun
     │    ├─── agent
     │    │    └─── DynamicAgent.java
     │    ├─── asm
     │    │    ├─── adapter
     │    │    │    └─── MethodInfoAdapter.java
     │    │    ├─── cst
     │    │    │    └─── Const.java
     │    │    └─── visitor
     │    │         └─── MethodInfoVisitor.java
     │    ├─── instrument
     │    │    └─── ASMTransformer.java
     │    └─── utils
     │         └─── ParameterUtils.java
     ├─── manifest.txt
     └─── sample
          ├─── HelloWorld.java
          └─── Program.java
```

做一些准备工作（`prepare03.sh`）：

```text
DIR=java-agent-manual-03
mkdir ${DIR} && cd ${DIR}

mkdir -p src/sample
touch src/sample/{HelloWorld.java,Program.java}

mkdir -p src/lsieun/{agent,asm,instrument,utils}
mkdir -p src/lsieun/asm/{adapter,cst,visitor}
touch src/lsieun/agent/DynamicAgent.java
touch src/lsieun/instrument/ASMTransformer.java
touch src/lsieun/asm/adapter/MethodInfoAdapter.java
touch src/lsieun/asm/cst/Const.java
touch src/lsieun/asm/visitor/MethodInfoVisitor.java
touch src/lsieun/utils/ParameterUtils.java
touch src/manifest.txt

mkdir -p src/attach
touch src/attach/VMAttach.java
```

## Application

### HelloWorld.java

```java
package sample;

public class HelloWorld {
    public static int add(int a, int b) {
        return a + b;
    }

    public static int sub(int a, int b) {
        return a - b;
    }
}
```

### Program.java

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class Program {
    public static void main(String[] args) throws Exception {
        // (1) print process id
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);

        // (2) count down
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

## ASM 相关

在这个部分，我们要借助于 JDK 内置的 ASM 类库（`jdk.internal.org.objectweb.asm`），来实现打印方法参数的功能。

### ParameterUtils.java

```java
package lsieun.utils;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

public class ParameterUtils {
    private static final ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(
            () -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    );

    public static void printValueOnStack(boolean value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(byte value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(char value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(short value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(int value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(float value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(long value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(double value) {
        System.out.println("    " + value);
    }

    public static void printValueOnStack(Object value) {
        if (value == null) {
            System.out.println("    " + value);
        }
        else if (value instanceof String) {
            System.out.println("    " + value);
        }
        else if (value instanceof Date) {
            System.out.println("    " + formatter.get().format(value));
        }
        else if (value instanceof char[]) {
            System.out.println("    " + Arrays.toString((char[]) value));
        }
        else if (value instanceof Object[]) {
            System.out.println("    " + Arrays.toString((Object[]) value));
        }
        else {
            System.out.println("    " + value.getClass() + ": " + value.toString());
        }
    }

    public static void printText(String str) {
        System.out.println(str);
    }

    public static void printStackTrace() {
        Exception ex = new Exception();
        ex.printStackTrace(System.out);
    }
}
```

### Const.java

```java
package lsieun.asm.cst;

import jdk.internal.org.objectweb.asm.Opcodes;

public class Const {
    public static final int ASM_VERSION = Opcodes.ASM5;
}
```

### MethodInfoAdapter.java

```java
package lsieun.asm.adapter;

import jdk.internal.org.objectweb.asm.MethodVisitor;
import jdk.internal.org.objectweb.asm.Opcodes;
import jdk.internal.org.objectweb.asm.Type;
import lsieun.asm.cst.Const;

public class MethodInfoAdapter extends MethodVisitor {
    private final String owner;
    private final int methodAccess;
    private final String methodName;
    private final String methodDesc;

    public MethodInfoAdapter(MethodVisitor methodVisitor, String owner,
                             int methodAccess, String methodName, String methodDesc) {
        super(Const.ASM_VERSION, methodVisitor);
        this.owner = owner;
        this.methodAccess = methodAccess;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
    }

    @Override
    public void visitCode() {
        if (mv != null) {
            String line = String.format("Method Enter: %s.%s:%s", owner, methodName, methodDesc);
            printMessage(line);

            int slotIndex = (methodAccess & Opcodes.ACC_STATIC) != 0 ? 0 : 1;
            Type methodType = Type.getMethodType(methodDesc);
            Type[] argumentTypes = methodType.getArgumentTypes();
            for (Type t : argumentTypes) {
                int sort = t.getSort();
                int size = t.getSize();
                int opcode = t.getOpcode(Opcodes.ILOAD);
                super.visitVarInsn(opcode, slotIndex);

                if (sort >= Type.BOOLEAN && sort <= Type.DOUBLE) {
                    String desc = t.getDescriptor();
                    printValueOnStack("(" + desc + ")V");
                }
                else {
                    printValueOnStack("(Ljava/lang/Object;)V");
                }
                slotIndex += size;
            }
        }

        super.visitCode();
    }

    private void printMessage(String str) {
        super.visitLdcInsn(str);
        super.visitMethodInsn(Opcodes.INVOKESTATIC, "lsieun/utils/ParameterUtils", "printText", "(Ljava/lang/String;)V", false);
    }

    private void printValueOnStack(String descriptor) {
        super.visitMethodInsn(Opcodes.INVOKESTATIC, "lsieun/utils/ParameterUtils", "printValueOnStack", descriptor, false);
    }

    private void printStackTrace() {
        super.visitMethodInsn(Opcodes.INVOKESTATIC, "lsieun/utils/ParameterUtils", "printStackTrace", "()V", false);
    }
}
```

### MethodInfoVisitor.java

```java
package lsieun.asm.visitor;

import jdk.internal.org.objectweb.asm.ClassVisitor;
import jdk.internal.org.objectweb.asm.MethodVisitor;
import lsieun.asm.adapter.MethodInfoAdapter;
import lsieun.asm.cst.Const;

public class MethodInfoVisitor extends ClassVisitor {
    private String owner;

    public MethodInfoVisitor(ClassVisitor classVisitor) {
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
        if (mv != null && !name.equals("<init>") && !name.equals("<clinit>")) {
            mv = new MethodInfoAdapter(mv, owner, access, name, descriptor);
        }
        return mv;
    }
}
```

## Agent Jar

### manifest.txt

```text
Agent-Class: lsieun.agent.DynamicAgent
Can-Retransform-Classes: true

```

注意：在 `manifest.txt` 文件的结尾处有**一个空行**。(make sure the last line in the file is **a blank line**)

### DynamicAgent.java

```java
package lsieun.agent;

import lsieun.instrument.ASMTransformer;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        ClassFileTransformer transformer = new ASMTransformer();
        try {
            inst.addTransformer(transformer, true);
            Class<?> targetClass = Class.forName("sample.HelloWorld");
            inst.retransformClasses(targetClass);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        finally {
            inst.removeTransformer(transformer);
        }
    }
}
```

### ASMTransformer.java

```java
package lsieun.instrument;

import jdk.internal.org.objectweb.asm.ClassReader;
import jdk.internal.org.objectweb.asm.ClassVisitor;
import jdk.internal.org.objectweb.asm.ClassWriter;
import lsieun.asm.visitor.MethodInfoVisitor;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class ASMTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader,
                            String className,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {
        if (className == null) return null;
        if (className.startsWith("java")) return null;
        if (className.startsWith("javax")) return null;
        if (className.startsWith("jdk")) return null;
        if (className.startsWith("sun")) return null;
        if (className.startsWith("org")) return null;
        if (className.startsWith("com")) return null;
        if (className.startsWith("lsieun")) return null;

        System.out.println("candidate className: " + className);

        if (className.equals("sample/HelloWorld")) {
            ClassReader cr = new ClassReader(classfileBuffer);
            ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
            ClassVisitor cv = new MethodInfoVisitor(cw);

            int parsingOptions = 0;
            cr.accept(cv, parsingOptions);

            return cw.toByteArray();
        }

        return null;
    }
}
```



## JVM Attach

### VMAttach.java

在下面的代码中，我们要用到 `com.sun.tools.attach` 里定义的类，因此编译的时候需要用到 `tools.jar` 文件。

```java
package attach;

import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;

import java.util.List;

public class VMAttach {
    public static void main(String[] args) throws Exception {
        String agent = "TheAgent.jar";
        System.out.println("Agent Path: " + agent);
        List<VirtualMachineDescriptor> vmds = VirtualMachine.list();
        for (VirtualMachineDescriptor vmd : vmds) {
            if (vmd.displayName().equals("sample.Program")) {
                VirtualMachine vm = VirtualMachine.attach(vmd.id());
                System.out.println("Load Agent");
                vm.loadAgent(agent);
                System.out.println("Detach");
                vm.detach();
            }
        }
    }
}
```

## 编译和运行

### 编译

编译 Application：

```text
# 切换目录
$ cd java-agent-manual-03/

# 输出目录
$ mkdir out

# 编译
$ javac src/sample/*.java -d out/
```

编译和生成 Agent Jar：

```text
# 切换目录
$ cd java-agent-manual-03/

# 找到所有 .java 文件
$ find ./src/lsieun/ -name "*.java" > sources.txt
$ cat sources.txt
./src/lsieun/agent/DynamicAgent.java
./src/lsieun/asm/adapter/MethodInfoAdapter.java
./src/lsieun/asm/cst/Const.java
./src/lsieun/asm/visitor/MethodInfoVisitor.java
./src/lsieun/instrument/ASMTransformer.java
./src/lsieun/utils/ParameterUtils.java

# 错误的编译
$ javac -d out/ @sources.txt

# 正确的编译
$ javac -XDignore.symbol.file -d out/ @sources.txt

# 复制 manifest.txt 文件
$ cp src/manifest.txt out/

# 切换目录
$ cd out/
$ ls
lsieun/  manifest.txt  sample/

# 进行打包
$ jar -cvfm TheAgent.jar manifest.txt lsieun/
```

编译 VM Attach：

```text
# 切换目录
$ cd java-agent-manual-03/

# 编译 VMAttach.java（Windows)
$ javac -cp "%JAVA_HOME%/lib/tools.jar";. -d out/ src/attach/VMAttach.java

# 编译 VMAttach.java（Linux)
$ javac -cp "${JAVA_HOME}/lib/tools.jar":. -d out/ src/attach/VMAttach.java

# 编译 VMAttach.java（MINGW64)
$ javac -cp "${JAVA_HOME}/lib/tools.jar"\;. -d out/ src/attach/VMAttach.java
```

### 运行

运行：

```text
# 切换目录
$ cd java-agent-manual-03/
$ cd out/

# 编译 VMAttach.java（Windows)
$ java -cp "%JAVA_HOME%/lib/tools.jar";. attach.VMAttach

# 编译 VMAttach.java（Linux)
$ java -cp "${JAVA_HOME}/lib/tools.jar":. attach.VMAttach

# 编译 VMAttach.java（MINGW64)
$ java -cp "${JAVA_HOME}/lib/tools.jar"\;. attach.VMAttach
```

## 总结

本文内容总结如下：

- 第一点，本文的主要目的是对 Java Agent 有一个整体的印象，因此不需要理解技术细节。
- 第二点，Java Agent 的 Jar 包当中有三个重要组成部分：manifest、Agent Class 和 ClassFileTransformer。
- 第三点，当使用 `javac` 命令编译时，如果在程序当中使用到了 `jdk.*` 或 `sun.*` 当中的类，要添加 `-XDignore.symbol.file` 选项。
- 第四点，当运行 Dynamic Instrumentation 时，需要在 `CLASSPATH` 当中引用 `JAVA_HOME/lib/tools.jar`。
