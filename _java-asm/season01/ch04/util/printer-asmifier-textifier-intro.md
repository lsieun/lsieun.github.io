---
title: "Printer/ASMifier/Textifier 介绍"
sequence: "404"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Printer 类

### class info

第一个部分，`Printer` 类是一个 `abstract` 类，它有两个子类：`ASMifier` 类和 `Textifier` 类。

```java
public abstract class Printer {
}
```

### fields

第二个部分，`Printer` 类定义的字段有哪些。

```java
public abstract class Printer {
    protected final int api;

    // The builder used to build strings in the various visit methods.
    protected final StringBuilder stringBuilder;

    // The text to be printed.
    public final List<Object> text;
}
```

### constructors

第三个部分，`Printer` 类定义的构造方法有哪些。

```java
public abstract class Printer {
    protected Printer(final int api) {
        this.api = api;
        this.stringBuilder = new StringBuilder();
        this.text = new ArrayList<>();
    }
}
```

### methods

第四个部分，`Printer` 类定义的方法有哪些。

#### visitXxx 方法

`Printer` 类定义的 `visitXxx` 方法是与 `ClassVisitor` 和 `MethodVisitor` 类里定义的方法有很大的相似性。

```java
public abstract class Printer {
    // Classes，这部分方法可与 ClassVisitor 内定义的方法进行对比
    public abstract void visit(int version, int access, String name, String signature, String superName, String[] interfaces);
    public abstract Printer visitField(int access, String name, String descriptor, String signature, Object value);
    public abstract Printer visitMethod(int access, String name, String descriptor, String signature, String[] exceptions);
    public abstract void visitClassEnd();
    // ......


    // Methods，这部分方法可与 MethodVisitor 内定义的方法进行对比
    public abstract void visitCode();
    public abstract void visitInsn(int opcode);
    public abstract void visitIntInsn(int opcode, int operand);
    public abstract void visitVarInsn(int opcode, int var);
    public abstract void visitTypeInsn(int opcode, String type);
    public abstract void visitFieldInsn(int opcode, String owner, String name, String descriptor);
    public void visitMethodInsn(final int opcode, final String owner, final String name, final String descriptor, final boolean isInterface);
    public abstract void visitJumpInsn(int opcode, Label label);
    // ......
    public abstract void visitMaxs(int maxStack, int maxLocals);
    public abstract void visitMethodEnd();
}
```

#### print 方法

下面这个 `print(PrintWriter)` 方法会在 `TraceClassVisitor.visitEnd()` 方法中调用。

- `print(PrintWriter)` 方法的作用：打印出 `text` 字段的值，将采集的内容进行输出。
- `print(PrintWriter)` 方法的调用时机：在 `TraceClassVisitor.visitEnd()` 方法中。

```java
public abstract class Printer {
    public void print(final PrintWriter printWriter) {
        printList(printWriter, text);
    }

    static void printList(final PrintWriter printWriter, final List<?> list) {
        for (Object o : list) {
            if (o instanceof List) {
                printList(printWriter, (List<?>) o);
            } else {
                printWriter.print(o.toString());
            }
        }
    }
}
```

## ASMifier 类和 Textifier 类

对于 `ASMifier` 类和 `Textifier` 类来说，它们的父类是 `Printer` 类。

```java
public class ASMifier extends Printer {
}
```

```java
public class Textifier extends Printer {
}
```

在这里，我们不对 `ASMifier` 类和 `Textifier` 类的成员信息进行展开，因为它们的内容非常多。但是，这么多的内容都是为了一个共同的目的：通过对 `visitXxx()` 方法的调用，将 class 的内容转换成文字的表示形式。

除了 `ASMifier` 和 `Textifier` 这两个类，如果有什么好的想法，我们也可以写一个自定义的 `Printer` 类进行使用。

## 如何使用

对于 `ASMifier` 和 `Textifier` 这两个类来说，它们的使用方法是非常相似的。换句话说，知道了如何使用 `ASMifier` 类，也就知道了如何使用 `Textifier` 类；反过来说，知道了如何使用 `Textifier` 类，也就知道了如何使用 `ASMifier` 类。

### 从命令行使用

Linux 分隔符是“:”

```text
$ java -classpath asm.jar:asm-util.jar org.objectweb.asm.util.ASMifier java.lang.Runnable
```

Windows 分隔符是“;”

```text
$ java -classpath asm.jar;asm-util.jar org.objectweb.asm.util.ASMifier java.lang.Runnable
```

Cygwin 分隔符是“\;”

```text
$ java -classpath asm.jar\;asm-util.jar org.objectweb.asm.util.ASMifier java.lang.Runnable
```

### 从代码中使用

无论是 `ASMifier` 类里的 `main()` 方法，还是 `Textifier` 类里的 `main()` 方法，它们本质上都是调用了 `Printer` 类里的 `main()` 方法。在 `Printer` 类里的 `main()` 方法里，代码的功能也是通过 `TraceClassVisitor` 类来实现的。

在 Java ASM 9.0 版本当中，使用 `-debug` 选项：

```java
import org.objectweb.asm.util.ASMifier;

import java.io.IOException;

public class HelloWorldRun {
    public static void main(String[] args) throws IOException {
        String[] array = new String[] {
                "-debug",
                "sample.HelloWorld"
        };
        ASMifier.main(array);
    }
}
```

在 Java ASM 9.1 或 9.2 及之后版本当中，使用 `-nodebug` 选项：（这一点，要感谢 [4ra1n](https://4ra1n.love/) 同学指出错误并纠正）

```java
import org.objectweb.asm.util.ASMifier;

import java.io.IOException;

public class HelloWorldRun {
    public static void main(String[] args) throws IOException {
        String[] array = new String[] {
                "-nodebug",
                "sample.HelloWorld"
        };
        ASMifier.main(array);
    }
}
```

在 [Versions](https://asm.ow2.io/versions.html) 当中，提到：

```text
6 February 2021: ASM 9.1 (tag ASM_9_1)

－ Replace -debug flag in Printer with -nodebug (-debug continues to work)
```

但是，在 Java ASM 9.1 和 9.2 版本中，我测试了一下 `-debug` 选项，它是不能用的。

## 总结

本文对 `Printer`、`ASMifier` 和 `Textifier` 这三个类进行介绍，内容总结如下：

- 第一点，了解这三个类的主要目的是为了方便理解 `TraceClassVisitor` 类的工作原理。
- 第二点，如何从命令行使用 `ASMifier` 类和 `Textifier` 类。
