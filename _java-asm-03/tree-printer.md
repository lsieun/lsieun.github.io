---
title:  "如何编写ASM代码"
sequence: "105"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## TreePrinterRun类

从功能上来说，`TreePrinterRun`类就是用来打印生成类的Tree API代码。

```java
public class TreePrinterRun {
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

从实现上来说，`TreePrinterRun`类会调用`TreePrinter`类（项目当中提供的一个类），而`TreePrinter`类又继承自`org.objectweb.asm.util.Printer`类（ASM提供的一个类）。

另外，`TreePrinter`类是项目当中提供的一个类，实现比较简单，功能也非常有限，还可能存在问题（bug）。因此，对于这个类，我们可以使用它，但也应该保持一份警惕。也就是说，使用这个类生成代码之后，我们应该检查一下生成的代码是否正确。

另外，还要注意区分这三个类的作用：

- `ASMPrint`类：生成类的Core API代码
- `TreePrinterRun`类：生成类的Tree API代码
- `LambdaRun`类：查看Lambda表达式生成的匿名类的内容

这三个类的共同点就是都使用到了`org.objectweb.asm.util.Printer`类的子类。

## 使用示例

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

我们可以运行`TreePrinterRun`类来生成相应的Tree API代码。
