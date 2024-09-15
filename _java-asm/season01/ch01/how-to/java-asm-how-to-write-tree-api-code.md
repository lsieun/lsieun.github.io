---
title: "如何编写 ASM 代码（Tree API）"
sequence: "102"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在ASM当中，有一个`ASMifier`类，它可以打印出Core API对应的代码；
但是，ASM并没有提供打印Tree API对应代码的类，因此我们就写了一个类来实现该功能。

## PrintASMCodeTree类

我们可以从两个方面来理解`PrintASMCodeTree`类：

- 从功能上来说，`PrintASMCodeTree`类就是用来打印生成类的Tree API代码。
- 从实现上来说，`PrintASMCodeTree`类是通过调用`TreePrinter`类来实现的。

```java
public class PrintASMCodeTree {
    public static void main(String[] args) throws IOException {
        // (1) 设置参数
        String className = "sample.HelloWorld";
        int parsingOptions = ClassReader.SKIP_FRAMES | ClassReader.SKIP_DEBUG;

        // (2) 打印结果
        Printer printer = new TreePrinter();
        PrintWriter printWriter = new PrintWriter(System.out, true);
        TraceClassVisitor traceClassVisitor = new TraceClassVisitor(null, printer, printWriter);
        new ClassReader(className).accept(traceClassVisitor, parsingOptions);
    }
}
```

首先，我们来看一下`PrintASMCodeTree`类的功能。假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else {
            System.out.println("val is not 0");
        }
    }
}
```

接着，我们来看一下`TreePrinter`类，这个类是[项目](https://gitee.com/lsieun/learn-java-asm)当中提供的一个类，继承自`org.objectweb.asm.util.Printer`类。`TreePrinter`类，实现比较简单，功能也非常有限，还可能存在问题（bug）。因此，对于这个类，我们可以使用它，但也应该保持一份警惕。也就是说，使用这个类生成代码之后，我们应该检查一下生成的代码是否正确。

另外，还要注意区分下面五个类的作用：

- `ASMPrint`类：生成类的Core API代码或类的内容（功能二合一）
- `PrintASMCodeCore`类：生成类的Core API代码（由`ASMPrint`类拆分得到，功能单一）
- `PrintASMCodeTree`类：生成类的Tree API代码
- `PrintASMTextClass`类：查看类的内容（由`ASMPrint`类拆分得到，功能单一）
- `PrintASMTextLambda`类：查看Lambda表达式生成的匿名类的内容

这五个类的共同点就是都使用到了`org.objectweb.asm.util.Printer`类的子类。

## ControlFlowGraphRun类

除了打印ASM Tree API的代码，我们也提供一个`ControlFlowGraphRun`类，可以查看方法的控制流程图：

```java
public class ControlFlowGraphRun {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        ClassNode cn = new ClassNode();

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）查找方法
        String methodName = "test";
        MethodNode targetNode = null;
        for (MethodNode mn : cn.methods) {
            if (mn.name.equals(methodName)) {
                targetNode = mn;
                break;
            }
        }
        if (targetNode == null) {
            System.out.println("Can not find method: " + methodName);
            return;
        }

        //（4）进行图形化显示
        System.out.println("Origin:");
        display(cn.name, targetNode, ControlFlowGraphType.NONE);
        System.out.println("Control Flow Graph:");
        display(cn.name, targetNode, ControlFlowGraphType.STANDARD);

        //（5）打印复杂度
        int complexity = CyclomaticComplexity.getCyclomaticComplexity(cn.name, targetNode);
        String line = String.format("%s:%s complexity: %d", targetNode.name, targetNode.desc, complexity);
        System.out.println(line);
    }
}
```

对于上面的`HelloWorld`类，可以使用`javap`命令查看`test`方法包含的instructions内容：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: iload_1
       1: ifne          15
       4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       7: ldc           #3                  // String val is 0
       9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      12: goto          23
      15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
      18: ldc           #5                  // String val is not 0
      20: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}
```

运行`ControlFlowGraphRun`类之后，文字输出程序的复杂度：

```text
test:(I)V complexity: 2
```

同时，也会有文本图形显示，将instructions内容分成不同的子部分，并显示出子部分之间的跳转关系：

```text
┌───────────────────────────────────┐
│ iload_1                           │
│ ifne L0                           ├───┐
└────────────────┬──────────────────┘   │
                 │                      │
┌────────────────┴──────────────────┐   │
│ getstatic System.out              │   │
│ ldc "val is 0"                    │   │
│ invokevirtual PrintStream.println │   │
│ goto L1                           ├───┼──┐
└───────────────────────────────────┘   │  │
                                        │  │
┌───────────────────────────────────┐   │  │
│ L0                                ├───┘  │
│ getstatic System.out              │      │
│ ldc "val is not 0"                │      │
│ invokevirtual PrintStream.println │      │
└────────────────┬──────────────────┘      │
                 │                         │
┌────────────────┴──────────────────┐      │
│ L1                                ├──────┘
│ return                            │
└───────────────────────────────────┘
```


## 总结

本文内容总结如下：

- 第一点，通过运行`PrintASMCodeTree`类，可以生成类的Tree API代码。
- 第二点，通过运行`ControlFlowGraphRun`类，可以打印方法的复杂度，也可以显示控制流程图。
