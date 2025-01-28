---
title: "示例：Cyclomatic Complexity"
sequence: "416"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## Cyclomatic Complexity

**Code complexity** is important, yet difficult metric to measure.

One of the most relevant **complexity measurement** is the **Cyclomatic Complexity**(**CC**).

### 直观视角

**CC** value can be calculated by measuring the number of independent execution paths of a program.

下面的`HelloWorld`类的`test`方法的复杂度是1。

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

其control flow graph如下：

```text
┌───────────────────────────────────┐
│ getstatic System.out              │
│ ldc "Hello World"                 │
│ invokevirtual PrintStream.println │
│ return                            │
└───────────────────────────────────┘
```

下面的`HelloWorld`类的`test`方法的复杂度是2。

```java
public class HelloWorld {
    public void test(boolean flag) {
        if (flag) {
            System.out.println("flag is true");
        }
        else {
            System.out.println("flag is false");
        }
    }
}
```

其control flow graph如下：

```text
┌───────────────────────────────────┐
│ iload_1                           │
│ ifeq L0                           ├───┐
└─────────────────┬─────────────────┘   │
                  │                     │
┌─────────────────┴─────────────────┐   │
│ getstatic System.out              │   │
│ ldc "flag is true"                │   │
│ invokevirtual PrintStream.println │   │
│ goto L1                           ├───┼──┐
└───────────────────────────────────┘   │  │
                                        │  │
┌───────────────────────────────────┐   │  │
│ L0                                ├───┘  │
│ getstatic System.out              │      │
│ ldc "flag is false"               │      │
│ invokevirtual PrintStream.println │      │
└─────────────────┬─────────────────┘      │
                  │                        │
┌─────────────────┴─────────────────┐      │
│ L1                                ├──────┘
│ return                            │
└───────────────────────────────────┘
```

下面的`HelloWorld`类的`test`方法的复杂度是3。

```java
public class HelloWorld {
    public void test(boolean flag, boolean flag2) {
        if (flag && flag2) {
            System.out.println("both flags are true");
        }
        else {
            System.out.println("one flag must be false");
        }
    }
}
```

其control flow graph如下：

```text
┌───────────────────────────────────┐
│ iload_1                           │
│ ifeq L0                           ├───┐
└─────────────────┬─────────────────┘   │
                  │                     │
┌─────────────────┴─────────────────┐   │
│ iload_2                           │   │
│ ifeq L0                           ├───┼──┐
└─────────────────┬─────────────────┘   │  │
                  │                     │  │
┌─────────────────┴─────────────────┐   │  │
│ getstatic System.out              │   │  │
│ ldc "both flags are true"         │   │  │
│ invokevirtual PrintStream.println │   │  │
│ goto L1                           ├───┼──┼──┐
└───────────────────────────────────┘   │  │  │
                                        │  │  │
┌───────────────────────────────────┐   │  │  │
│ L0                                ├───┴──┘  │
│ getstatic System.out              │         │
│ ldc "one flag must be false"      │         │
│ invokevirtual PrintStream.println │         │
└─────────────────┬─────────────────┘         │
                  │                           │
┌─────────────────┴─────────────────┐         │
│ L1                                ├─────────┘
│ return                            │
└───────────────────────────────────┘
```

下面的`HelloWorld`类的`test`方法的复杂度是4。

```java
public class HelloWorld {
    public void test(int value) {
        String result;
        switch (value) {
            case 10:
                result = "val = 1";
                break;
            case 20:
                result = "val = 2";
                break;
            case 30:
                result = "val = 3";
                break;
            default:
                result = "val is unknown";
        }
        System.out.println(result);
    }
}
```

其control flow graph如下：

```text
┌───────────────────────────────────┐
│ iload_1                           │
│ lookupswitch {                    │
│     10: L0                        │
│     20: L1                        │
│     30: L2                        │
│     default: L3                   │
│ }                                 ├───┐
└───────────────────────────────────┘   │
                                        │
┌───────────────────────────────────┐   │
│ L0                                ├───┤
│ ldc "val = 1"                     │   │
│ astore_2                          │   │
│ goto L4                           ├───┼──┐
└───────────────────────────────────┘   │  │
                                        │  │
┌───────────────────────────────────┐   │  │
│ L1                                ├───┤  │
│ ldc "val = 2"                     │   │  │
│ astore_2                          │   │  │
│ goto L4                           ├───┼──┼──┐
└───────────────────────────────────┘   │  │  │
                                        │  │  │
┌───────────────────────────────────┐   │  │  │
│ L2                                ├───┤  │  │
│ ldc "val = 3"                     │   │  │  │
│ astore_2                          │   │  │  │
│ goto L4                           ├───┼──┼──┼──┐
└───────────────────────────────────┘   │  │  │  │
                                        │  │  │  │
┌───────────────────────────────────┐   │  │  │  │
│ L3                                ├───┘  │  │  │
│ ldc "val is unknown"              │      │  │  │
│ astore_2                          │      │  │  │
└─────────────────┬─────────────────┘      │  │  │
                  │                        │  │  │
┌─────────────────┴─────────────────┐      │  │  │
│ L4                                ├──────┴──┴──┘
│ getstatic System.out              │
│ aload_2                           │
│ invokevirtual PrintStream.println │
│ return                            │
└───────────────────────────────────┘
```

下面的`HelloWorld`类的`test`方法的复杂度是5。

```java
public class HelloWorld {
    public void test(int i) {
        String result = i % 2 == 0 ? "a" : i % 3 == 0 ? "b" : i % 5 == 0 ? "c" : i % 7 == 0 ? "d" : "e";
        System.out.println(result);
    }
}
```

其control flow graph如下：

```text
┌───────────────────────────────────┐
│ iload_1                           │
│ iconst_2                          │
│ irem                              │
│ ifne L0                           ├───┐
└─────────────────┬─────────────────┘   │
                  │                     │
┌─────────────────┴─────────────────┐   │
│ ldc "a"                           │   │
│ goto L1                           ├───┼──┐
└───────────────────────────────────┘   │  │
                                        │  │
┌───────────────────────────────────┐   │  │
│ L0                                ├───┘  │
│ iload_1                           │      │
│ iconst_3                          │      │
│ irem                              │      │
│ ifne L2                           ├──────┼──┐
└─────────────────┬─────────────────┘      │  │
                  │                        │  │
┌─────────────────┴─────────────────┐      │  │
│ ldc "b"                           │      │  │
│ goto L1                           ├──────┼──┼──┐
└───────────────────────────────────┘      │  │  │
                                           │  │  │
┌───────────────────────────────────┐      │  │  │
│ L2                                ├──────┼──┘  │
│ iload_1                           │      │     │
│ iconst_5                          │      │     │
│ irem                              │      │     │
│ ifne L3                           ├──────┼─────┼──┐
└─────────────────┬─────────────────┘      │     │  │
                  │                        │     │  │
┌─────────────────┴─────────────────┐      │     │  │
│ ldc "c"                           │      │     │  │
│ goto L1                           ├──────┼─────┼──┼──┐
└───────────────────────────────────┘      │     │  │  │
                                           │     │  │  │
┌───────────────────────────────────┐      │     │  │  │
│ L3                                ├──────┼─────┼──┘  │
│ iload_1                           │      │     │     │
│ bipush 7                          │      │     │     │
│ irem                              │      │     │     │
│ ifne L4                           ├──────┼─────┼─────┼──┐
└─────────────────┬─────────────────┘      │     │     │  │
                  │                        │     │     │  │
┌─────────────────┴─────────────────┐      │     │     │  │
│ ldc "d"                           │      │     │     │  │
│ goto L1                           ├──────┼─────┼─────┼──┼──┐
└───────────────────────────────────┘      │     │     │  │  │
                                           │     │     │  │  │
┌───────────────────────────────────┐      │     │     │  │  │
│ L4                                ├──────┼─────┼─────┼──┘  │
│ ldc "e"                           │      │     │     │     │
└─────────────────┬─────────────────┘      │     │     │     │
                  │                        │     │     │     │
┌─────────────────┴─────────────────┐      │     │     │     │
│ L1                                ├──────┴─────┴─────┴─────┘
│ astore_2                          │
│ getstatic System.out              │
│ aload_2                           │
│ invokevirtual PrintStream.println │
│ return                            │
└───────────────────────────────────┘
```

### 数学视角

The complexity `M` is then defined as

```text
M = E - N + 2P
```

where

- `E` = the number of edges of the graph.
- `N` = the number of nodes of the graph.
- `P` = the number of connected components.

For a single program, `P` is always equal to `1`. So a simpler formula for a single subroutine is

```text
M = E - N + 2
```

### 复杂度分级

The complexity level affects the testability of the code, **the higher the CC, the higher the difficulty to implement pertinent tests**.
In fact, the cyclomatic complexity value shows exactly the number of test cases needed to achieve a 100% branches coverage score.

Some common values used by static analysis tools are shown below:

- `1-4`: low complexity – easy to test
- `5-7`: moderate complexity – tolerable
- `8-10`: high complexity – refactoring should be considered to ease testing
- `11` + very high complexity – very difficult to test

Generally speaking, a code with a value higher than 11 in terms of CC, is considered very complex, and difficult to test and maintain.

## 示例：计算圈复杂度

### 预期目标

假如有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else if (val == 1) {
            System.out.println("val is 1");
        }
        else {
            System.out.println("val is unknown");
        }
    }
}
```

我们的预期目标：确定`test`方法的复杂度。

### 编码实现

在下面的`CyclomaticComplexityFrame`类当中，关键点是定义了一个`successors`字段，用来记录当前Frame与其它Frame之间的关联关系。

```java
import org.objectweb.asm.tree.analysis.Frame;
import org.objectweb.asm.tree.analysis.Value;

import java.util.HashSet;
import java.util.Set;

public class CyclomaticComplexityFrame<V extends Value> extends Frame<V> {
    public Set<CyclomaticComplexityFrame<V>> successors = new HashSet<>();

    public CyclomaticComplexityFrame(int numLocals, int numStack) {
        super(numLocals, numStack);
    }

    public CyclomaticComplexityFrame(Frame<? extends V> frame) {
        super(frame);
    }
}
```

在下面的`CyclomaticComplexityAnalyzer`类当中，从两点来把握：

- 第一点，两个`newFrame`方法是用来替换掉默认的`Frame`类，而使用上面定义的`CyclomaticComplexityFrame`类。
- 第二点，修改`newControlFlowEdge`方法，记录Frame之间的关联关系。

```java
import org.objectweb.asm.tree.analysis.*;

public class CyclomaticComplexityAnalyzer<V extends Value> extends Analyzer<V> {
    public CyclomaticComplexityAnalyzer(Interpreter<V> interpreter) {
        super(interpreter);
    }

    @Override
    protected Frame<V> newFrame(int numLocals, int numStack) {
        return new CyclomaticComplexityFrame<>(numLocals, numStack);
    }

    @Override
    protected Frame<V> newFrame(Frame<? extends V> frame) {
        return new CyclomaticComplexityFrame<>(frame);
    }

    @Override
    protected void newControlFlowEdge(int insnIndex, int successorIndex) {
        CyclomaticComplexityFrame<V> frame = (CyclomaticComplexityFrame<V>) getFrames()[insnIndex];
        frame.successors.add((CyclomaticComplexityFrame<V>) getFrames()[successorIndex]);
    }
}
```

在下面的`CyclomaticComplexity`类当中，应用`M = E - N + 2`公式：

```java
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

public class CyclomaticComplexity {
    public static int getCyclomaticComplexity(String owner, MethodNode mn) throws AnalyzerException {
        // 第一步，获取Frame信息
        Analyzer<BasicValue> analyzer = new CyclomaticComplexityAnalyzer<>(new BasicInterpreter());
        Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);

        // 第二步，计算复杂度
        int edges = 0;
        int nodes = 0;
        for (Frame<BasicValue> frame : frames) {
            if (frame != null) {
                edges += ((CyclomaticComplexityFrame<BasicValue>) frame).successors.size();
                nodes += 1;
            }
        }
        return edges - nodes + 2;
    }
}
```

### 进行分析

```java
public class HelloWorldAnalysisTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）进行分析
        String className = cn.name;
        List<MethodNode> methods = cn.methods;
        for (MethodNode mn : methods) {
            int complexity = CyclomaticComplexity.getCyclomaticComplexity(className, mn);
            String line = String.format("%s:%s%n    complexity: %d", mn.name, mn.desc, complexity);
            System.out.println(line);
        }
    }
}
```

### 验证结果

```text
<init>:()V
    complexity: 1
test:(I)V
    complexity: 3
```

另外，要说明一点，Cyclomatic Complexity计算的是`return`的复杂度。

下面的`HelloWorld`类的`test`方法的复杂度是2。

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else if (val == 1) {
            throw new RuntimeException("val is 1"); // 注意，这里抛出异常
        }
        else {
            System.out.println("val is unknown");
        }
    }
}
```

下面的`HelloWorld`类的`test`方法的复杂度是1。

```java
public class HelloWorld {
    public void test(int val) {
        if (val == 0) {
            System.out.println("val is 0");
        }
        else if (val == 1) {
            throw new RuntimeException("val is 1"); // 注意，这里抛出异常
        }
        else {
            throw new RuntimeException("val is unknown"); // 注意，这里抛出异常
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，介绍Cyclomatic Complexity的概念，如何用数学公式表达，以及复杂度分级。
- 第二点，代码示例，如何使用Java ASM实现Cyclomatic Complexity计算。

