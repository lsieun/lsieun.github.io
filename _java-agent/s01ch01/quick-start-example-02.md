---
title: "手工打包（二）：Load-Time Agent 打印方法接收的参数"
sequence: "104"
---

[UP]({% link _java-agent/java-agent-01.md %})

## 预期目标

我们的预期目标：借助于 JDK 内置的 ASM 打印出方法接收的参数，使用 Load-Time Instrumentation 的方式实现。

![](/assets/images/java/agent/virtual-machine-of-load-time-instrumentation.png)

开发环境：

- JDK 版本：Java 8
- 编辑器：记事本（Windows）或 `vi` （Linux）

代码目录结构：[Code](/assets/zip/java-agent-manual-02.zip)

```text
java-agent-manual-02
└─── src
     ├─── lsieun
     │    ├─── agent
     │    │    └─── LoadTimeAgent.java
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

代码逻辑梳理：

```text
Manifest --> Agent Class --> Instrumentation --> ClassFileTransformer --> ASM
```

做一些准备工作（`prepare02.sh`）：

```text
DIR=java-agent-manual-02
mkdir ${DIR} && cd ${DIR}

mkdir -p src/sample
touch src/sample/{HelloWorld.java,Program.java}

mkdir -p src/lsieun/{agent,asm,instrument,utils}
mkdir -p src/lsieun/asm/{adapter,cst,visitor}
touch src/lsieun/agent/LoadTimeAgent.java
touch src/lsieun/instrument/ASMTransformer.java
touch src/lsieun/asm/adapter/MethodInfoAdapter.java
touch src/lsieun/asm/cst/Const.java
touch src/lsieun/asm/visitor/MethodInfoVisitor.java
touch src/lsieun/utils/ParameterUtils.java
touch src/manifest.txt
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

在 `ParameterUtils.java` 文件当中，主要是定义了各种类型的 `print` 方法：

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

在 `Const.java` 文件当中，主要是定义了 `ASM_VERSION` 常量，它标识了使用的 ASM 的版本：

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

在 `manifest.txt` 文件中，记录 Agent Class 的信息：

```text
Premain-Class: lsieun.agent.LoadTimeAgent

```

注意：在 `manifest.txt` 文件的结尾处有**一个空行**。(make sure the last line in the file is **a blank line**)

那么，如果不添加一个空行，会有什么结果呢？虽然可以成功生成 `.jar` 文件，但是不会将 `manifest.txt` 里的信息（`Premain-Class: lsieun.agent.LoadTimeAgent`）转换到 `META-INF/MANIFEST.MF` 里。

```text
$ jar -cvfm TheAgent.jar manifest.txt lsieun/
...
# 在没有添加空行的情况下，会出现如下错误
$ java -javaagent:TheAgent.jar sample.Program
Failed to find Premain-Class manifest attribute in TheAgent.jar
Error occurred during initialization of VM
agent library failed to init: instrument
```

### LoadTimeAgent.java

```java
package lsieun.agent;

import lsieun.instrument.ASMTransformer;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Premain-Class: " + LoadTimeAgent.class.getName());
        ClassFileTransformer transformer = new ASMTransformer();
        inst.addTransformer(transformer);
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

### 生成 Jar 包

编译：

```text
# 切换目录
$ cd java-agent-manual-02/

# 添加输出目录
$ mkdir out

# 找到所有 .java 文件
$ find ./src/ -name "*.java" > sources.txt
$ cat sources.txt
./src/lsieun/agent/LoadTimeAgent.java
./src/lsieun/asm/adapter/MethodInfoAdapter.java
./src/lsieun/asm/cst/Const.java
./src/lsieun/asm/visitor/MethodInfoVisitor.java
./src/lsieun/instrument/ASMTransformer.java
./src/lsieun/utils/ParameterUtils.java
./src/sample/HelloWorld.java
./src/sample/Program.java
```

以下列出错误编译和正确编译两种示例：

```text
# 错误的编译
$ javac -d out/ @sources.txt

# 正确的编译
$ javac -XDignore.symbol.file -d out/ @sources.txt
```

注意：在编译的时候，要添加 `-XDignore.symbol.file` 选项；否则，会编译出错。

那么，如果不使用这个选项，为什么会出错呢？是因为在上面的代码当中用到了 `jdk.internal.org.objectweb.asm` 里的类，如果不使用这个选项，就会提示找不到相应的类。

[StackOverflow](https://stackoverflow.com/questions/4065401/using-internal-sun-classes-with-javac):
When `javac` is compiling code it doesn't link against `rt.jar` by default.
Instead it uses special symbol file `lib/ct.sym` with class stubs.
Surprisingly this file contains many but not all of internal `sun` classes.
And the answer is: `javac -XDignore.symbol.file`.
That's what `javac` uses for compiling `rt.jar`.

<fieldset>
<p>
<a href="https://www.oracle.com/java/technologies/faq-sun-packages.html" target="_blank">Oracle: Why Developers Should Not Write Programs That Call 'sun' Packages</a>
</p>
<ul>
<li>
<b>The <code>java.*</code>, <code>javax.*</code> and <code>org.*</code> packages documented in the Java Platform Standard Edition API Specification make up the official, supported, public interface.</b>
If a Java program directly calls only API in these packages, it will operate on all Java-compatible platforms, regardless of the underlying OS platform.
</li>
<li>
<b>The <code>sun.*</code> packages are not part of the supported, public interface.</b>
A Java program that directly calls into <code>sun.*</code> packages is not guaranteed to work on all Java-compatible platforms.
In fact, such a program is not guaranteed to work even in future versions on the same platform.
</li>
<p>
In general, writing java programs that rely on <code>sun.*</code> is risky: those classes are not portable, and are not supported.
</p>
</ul>
</fieldset>



编译完成之后，我们需要将分散的内容整合成一个 Jar 包文件：

```text
# 复制 manifest.txt 文件
$ cp src/manifest.txt out/

# 切换目录
$ cd out/
$ ls
lsieun/  manifest.txt  sample/

# 进行打包（第一种方式）
            ┌─── f: TheAgent.jar
         ┌──┴──┐
$ jar -cvfm TheAgent.jar manifest.txt lsieun/
          └─────────┬────────┘
                    └─── m: manifest.txt
# 进行打包（第二种方式）
                   ┌─── f: TheAgent.jar
          ┌────────┴────────┐
$ jar -cvmf manifest.txt TheAgent.jar lsieun/
         └───┬──┘
             └─── m: manifest.txt
```

打包过程中的输出信息：

```text
$ jar -cvfm TheAgent.jar manifest.txt lsieun/
已添加清单
正在添加: lsieun/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/agent/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/agent/LoadTimeAgent.class(输入 = 502) (输出 = 310)(压缩了 38%)
正在添加: lsieun/asm/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/asm/adapter/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/asm/adapter/MethodInfoAdapter.class(输入 = 2363) (输出 = 1229)(压缩了 47%)
正在添加: lsieun/asm/cst/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/asm/cst/Const.class(输入 = 298) (输出 = 242)(压缩了 18%)
正在添加: lsieun/asm/visitor/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/asm/visitor/MethodInfoVisitor.class(输入 = 1177) (输出 = 552)(压缩了 53%)
正在添加: lsieun/instrument/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/instrument/ASMTransformer.class(输入 = 1728) (输出 = 921)(压缩了 46%)
正在添加: lsieun/utils/(输入 = 0) (输出 = 0)(存储了 0%)
正在添加: lsieun/utils/ParameterUtils.class(输入 = 2510) (输出 = 1046)(压缩了 58%)
```

## 运行

在使用 `java` 命令时，我们可以通过使用 `-javaagent` 选项来使用 Java Agent Jar：

```text
$ java -javaagent:TheAgent.jar sample.Program
```

输出结果：

```text
$ java -javaagent:TheAgent.jar sample.Program
candidate className: sample/Program
5096@LenovoWin7
|000| 5096@LenovoWin7 remains 600 seconds
candidate className: sample/HelloWorld
Method Enter: sample/HelloWorld.add:(II)I
    4
    3
a + b = 7
...
```

那么，`TheAgent.jar` 到底做了一件什么事情呢？

在一般情况下，我们先编写 `HelloWorld.java` 文件，然后编译生成 `HelloWorld.class` 文件，最后加载到 JVM 当中运行。

当 Instrumentation 发生的时候，它是将原有的 `HelloWorld.class` 的内容进行修改（bytecode transformation），生成一个新的 `HelloWorld.class`，最后将这个新的 `HelloWorld.class` 加载到 JVM 当中运行。

```text
┌────────────────────┐   compile   ┌────────────────────┐ load original bytecode     ┌────────────────────┐
│  HelloWorld.java   ├─────────────┤  HelloWorld.class  ├────────────────────────────┤        JVM         │
└────────────────────┘             └─────────┬──────────┘                            │                    │
                                             │                                       │                    │
                                             │ bytecode transformation               │                    │
                                             │                                       │                    │
                                   ┌─────────┴──────────┐ load transformed bytecode  │                    │
                                   │  HelloWorld.class  ├────────────────────────────┤                    │
                                   └────────────────────┘                            └────────────────────┘
                                   Instrumentation/Java Agent
```

## 总结

本文内容总结如下：

- 第一点，本文的主要目的是希望大家对 Java Agent 有一个整体的印象，因此不需要理解技术细节（特别是 [ASM]({% link _posts/2021-06-01-java-asm-index.md %})相关内容）。
- 第二点，Agent Jar 当中有三个重要组成部分：manifest、Agent Class 和 ClassFileTransformer。
- 第三点，当使用 `javac` 命令编译时，如果在程序当中使用到了 `jdk.*` 或 `sun.*` 当中的类，要添加 `-XDignore.symbol.file` 选项。
- 第四点，当使用 `java` 命令加载 Agent Jar 时（Load-Time Instrumentation），需要添加 `-javaagent` 选项。
