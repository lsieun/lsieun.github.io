---
title:  "示例：Cyclomatic Complexity"
sequence: "410"
---

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

{:refdef: style="text-align: center;"}
![Cyclomatic Complexity](/assets/images/java/asm/cyclomatic-complexity-example-01.png)
{: refdef}

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

{:refdef: style="text-align: center;"}
![Cyclomatic Complexity](/assets/images/java/asm/cyclomatic-complexity-example-02.png)
{: refdef}

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

{:refdef: style="text-align: center;"}
![Cyclomatic Complexity](/assets/images/java/asm/cyclomatic-complexity-example-03.png)
{: refdef}

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

{:refdef: style="text-align: center;"}
![Cyclomatic Complexity](/assets/images/java/asm/cyclomatic-complexity-example-04.png)
{: refdef}

下面的`HelloWorld`类的`test`方法的复杂度是5。

```java
public class HelloWorld {
    public void test(int i) {
        String result = i % 2 == 0 ? "a" : i % 3 == 0 ? "b" : i % 5 == 0 ? "c" : i % 7 == 0 ? "d" : "e";
        System.out.println(result);
    }
}
```

{:refdef: style="text-align: center;"}
![Cyclomatic Complexity](/assets/images/java/asm/cyclomatic-complexity-example-05.png)
{: refdef}

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

```java
import org.objectweb.asm.tree.analysis.Frame;
import org.objectweb.asm.tree.analysis.Value;

import java.util.HashSet;
import java.util.Set;

public class Node<V extends Value> extends Frame<V> {
    public Set<Node<V>> successors = new HashSet<>();

    public Node(int numLocals, int numStack) {
        super(numLocals, numStack);
    }

    public Node(Frame<? extends V> frame) {
        super(frame);
    }
}
```

```java
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

public class CyclomaticComplexity {
    public int getCyclomaticComplexity(String owner, MethodNode mn) throws AnalyzerException {
        Analyzer<BasicValue> analyzer = new Analyzer<BasicValue>(new BasicInterpreter()) {
            @Override
            protected Frame<BasicValue> newFrame(int numLocals, int numStack) {
                return new Node<>(numLocals, numStack);
            }

            @Override
            protected Frame<BasicValue> newFrame(Frame<? extends BasicValue> frame) {
                return new Node<>(frame);
            }

            @Override
            protected void newControlFlowEdge(int insnIndex, int successorIndex) {
                Node<BasicValue> s = (Node<BasicValue>) getFrames()[insnIndex];
                s.successors.add((Node<BasicValue>) getFrames()[successorIndex]);
            }
        };

        Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
        int edges = 0;
        int nodes = 0;
        for (Frame<BasicValue> frame : frames) {
            if (frame != null) {
                edges += ((Node<BasicValue>) frame).successors.size();
                nodes += 1;
            }
        }
        return edges - nodes + 2;
    }
}
```

### 进行分析

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

import java.util.List;

public class HelloWorldAnalysisTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);
        if (bytes == null) {
            throw new RuntimeException("bytes is null");
        }

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode();

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）进行分析
        List<MethodNode> methods = cn.methods;
        CyclomaticComplexity cc = new CyclomaticComplexity();
        for (MethodNode mn : methods) {
            int complexity = cc.getCyclomaticComplexity(cn.name, mn);
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

更多参考资料：

- [Static Code Analysis in Java](https://www.baeldung.com/java-static-code-analysis-tutorial)

