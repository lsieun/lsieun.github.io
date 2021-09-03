---
title:  "Control Flow Analysis"
sequence: "409"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## Cyclomatic Complexity

**Cyclomatic complexity** is a software metric used to indicate the complexity of a program.

For instance, if the source code contained no control flow statements, the complexity would be 1, since there would be only a single path through the code.
If the code had one single-condition IF statement, there would be two paths through the code:
one where the IF statement evaluates to TRUE and another one where it evaluates to FALSE, so the complexity would be 2.
Two nested single-condition IFs, or one IF with two conditions, would produce a complexity of 3.

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

## 示例一：计算圈复杂度

### 预期目标

下面的`HelloWorld`类的`test`方法的复杂度是1。

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
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

## 示例二：程序控制流图可视化

```text
https://horstmann.com/sjsu/graphics/
```

