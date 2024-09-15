---
title: "BasicInterpreter示例：移除Dead Code"
sequence: "405"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 如何移除Dead Code

This `BasicInterpreter` is not very useful in itself,
but it can be used as an "empty" `Interpreter` implementation in order to construct an `Analyzer`.
This analyzer can then be used to detect unreachable code in a method.

```text
   ┌── Analyzer
   │        ┌── Value                                   ┌── Interpreter
   │        │                                           │
Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
   │        │
   │        └── Value
   └── Frame
```

Indeed, even by following both branches in jumps instructions,
it is not possible to reach code that cannot be reached from the first instruction.
The consequence is that, after an analysis, and whatever the `Interpreter` implementation,
the computed frames – returned by the `Analyzer.getFrames` method - are `null` for instructions that cannot be reached.

那么，为什么可以移除dead code呢？

- 其实，`BasicInterpreter`类本身并没有太多的作用，因为所有的引用类型都使用`BasicValue.REFERENCE_VALUE`来表示，类型非常单一，没有太多的操作空间。
- 相反的，`Analyzer`类才是起到主要作用的类，`Frame<V>[] frames = (Frame<V>[]) new Frame<?>[insnListSize];`。那么，在默认情况下，`frames`里所有元素都是`null`值。如果某一条instruction可以执行到，那么就会设置对应的`frames`当中的值，就不再为`null`了。反过来说，如果`frames`当中的某一个元素为`null`，那么也就表示对应的instruction就是dead code。

使用`BasicInterpreter`类时，指令（Instruction）和Frame之间的关系：

```text
test:(I)V
000:                                 goto L0    {R, I} | {}
001:                                  athrow    {} | {}
002:                                      L0    {R, I} | {}
003:                    getstatic System.out    {R, I} | {}
004:                                 iload_1    {R, I} | {R}
005:                                 goto L1    {R, I} | {R, I}
006:                                     nop    {} | {}
007:                                     nop    {} | {}
008:                                  athrow    {} | {}
009:                                      L1    {R, I} | {R, I}
010:                                 ifne L2    {R, I} | {R, I}
011:                          ldc "val is 0"    {R, I} | {R}
012:                                 goto L3    {R, I} | {R, R}
013:                                      L2    {R, I} | {R}
014:                      ldc "val is not 0"    {R, I} | {R}
015:                                      L3    {R, I} | {R, R}
016:       invokevirtual PrintStream.println    {R, I} | {R, R}
017:                                  return    {R, I} | {}
018:                                     nop    {} | {}
019:                                     nop    {} | {}
020:                                  athrow    {} | {}
================================================================
```

## 代码示例

### 预期目标

在之前的Tree Based Class Transformation示例当中，有一个示例是“优化跳转”，经过优化之后，有一些instruction就成为dead code。

我们的预期目标就是移除那些成为dead code的instruction。

### 编码实现

```java
import lsieun.asm.tree.transformer.MethodTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.LabelNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

public class RemoveDeadCodeNode extends ClassNode {
    public RemoveDeadCodeNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        MethodTransformer mt = new MethodRemoveDeadCodeTransformer(name, null);
        for (MethodNode mn : methods) {
            mt.transform(mn);
        }

        // 其次，调用父类的方法实现
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class MethodRemoveDeadCodeTransformer extends MethodTransformer {
        private final String owner;

        public MethodRemoveDeadCodeTransformer(String owner, MethodTransformer mt) {
            super(mt);
            this.owner = owner;
        }

        @Override
        public void transform(MethodNode mn) {
            // 首先，处理自己的代码逻辑
            Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
            try {
                analyzer.analyze(owner, mn);
                Frame<BasicValue>[] frames = analyzer.getFrames();
                AbstractInsnNode[] insnNodes = mn.instructions.toArray();
                for (int i = 0; i < frames.length; i++) {
                    if (frames[i] == null && !(insnNodes[i] instanceof LabelNode)) {
                        mn.instructions.remove(insnNodes[i]);
                    }
                }
            }
            catch (AnalyzerException ex) {
                ex.printStackTrace();
            }

            // 其次，调用父类的方法实现
            super.transform(mn);
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new RemoveDeadCodeNode(api, cw);

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: goto          3
       3: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
       6: iload_1
       7: goto          10
      10: ifne          18
      13: ldc           #18                 // String val is 0
      15: goto          20
      18: ldc           #20                 // String val is not 0
      20: invokevirtual #26                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}
```

## 解决方式二：抛弃Frame信息

There are more efficient ways, but they require writing more code.

```text
            ┌─── data flow analysis
            │
Analyzer ───┤
            │
            └─── control flow analysis
```

### ControlFlowAnalyzer

这个`ControlFlowAnalyzer`是模仿`org.objectweb.asm.tree.analysis.Analyzer`写的，但是不带有泛型信息，也不带有`Frame`相关的信息，只是将control flow analysis功能抽取出来。

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.AnalyzerException;

import java.util.ArrayList;
import java.util.List;

public class ControlFlowAnalyzer implements Opcodes {

    private InsnList insnList;
    private int insnListSize;
    private List<TryCatchBlockNode>[] handlers;

    /**
     * 记录需要处理的instructions.
     *
     * NOTE: 这三个字段为一组，应该一起处理，最好是放到同一个方法里来处理。
     * 因此，我就加了三个新方法。
     * {@link #initInstructionsToProcess()}、{@link #addInstructionsToProcess(int)}和
     * {@link #removeInstructionsToProcess()}
     *
     * @see #initInstructionsToProcess()
     * @see #addInstructionsToProcess(int)
     * @see #removeInstructionsToProcess()
     */
    private boolean[] inInstructionsToProcess;
    private int[] instructionsToProcess;
    private int numInstructionsToProcess;

    public ControlFlowAnalyzer() {
    }

    public List<TryCatchBlockNode> getHandlers(final int insnIndex) {
        return handlers[insnIndex];
    }


    @SuppressWarnings("unchecked")
    // NOTE: analyze方法的返回值类型变成了void类型。
    public void analyze(final String owner, final MethodNode method) throws AnalyzerException {
        if ((method.access & (ACC_ABSTRACT | ACC_NATIVE)) != 0) {
            return;
        }
        insnList = method.instructions;
        insnListSize = insnList.size();
        handlers = (List<TryCatchBlockNode>[]) new List<?>[insnListSize];

        initInstructionsToProcess();

        // For each exception handler, and each instruction within its range, record in 'handlers' the
        // fact that execution can flow from this instruction to the exception handler.
        for (int i = 0; i < method.tryCatchBlocks.size(); ++i) {
            TryCatchBlockNode tryCatchBlock = method.tryCatchBlocks.get(i);
            int startIndex = insnList.indexOf(tryCatchBlock.start);
            int endIndex = insnList.indexOf(tryCatchBlock.end);
            for (int j = startIndex; j < endIndex; ++j) {
                List<TryCatchBlockNode> insnHandlers = handlers[j];
                if (insnHandlers == null) {
                    insnHandlers = new ArrayList<>();
                    handlers[j] = insnHandlers;
                }
                insnHandlers.add(tryCatchBlock);
            }
        }


        // Initializes the data structures for the control flow analysis.
        // NOTE: 调用addInstructionsToProcess方法，传入参数0，启动整个循环过程。
        addInstructionsToProcess(0);
        init(owner, method);

        // Control flow analysis.
        while (numInstructionsToProcess > 0) {
            // Get and remove one instruction from the list of instructions to process.
            int insnIndex = removeInstructionsToProcess();

            // Simulate the execution of this instruction.
            AbstractInsnNode insnNode = method.instructions.get(insnIndex);
            int insnOpcode = insnNode.getOpcode();
            int insnType = insnNode.getType();

            if (insnType == AbstractInsnNode.LABEL
                    || insnType == AbstractInsnNode.LINE
                    || insnType == AbstractInsnNode.FRAME) {
                newControlFlowEdge(insnIndex, insnIndex + 1);
            }
            else {
                if (insnNode instanceof JumpInsnNode) {
                    JumpInsnNode jumpInsn = (JumpInsnNode) insnNode;
                    if (insnOpcode != GOTO && insnOpcode != JSR) {
                        newControlFlowEdge(insnIndex, insnIndex + 1);
                    }
                    int jumpInsnIndex = insnList.indexOf(jumpInsn.label);
                    newControlFlowEdge(insnIndex, jumpInsnIndex);
                }
                else if (insnNode instanceof LookupSwitchInsnNode) {
                    LookupSwitchInsnNode lookupSwitchInsn = (LookupSwitchInsnNode) insnNode;
                    int targetInsnIndex = insnList.indexOf(lookupSwitchInsn.dflt);
                    newControlFlowEdge(insnIndex, targetInsnIndex);
                    for (int i = 0; i < lookupSwitchInsn.labels.size(); ++i) {
                        LabelNode label = lookupSwitchInsn.labels.get(i);
                        targetInsnIndex = insnList.indexOf(label);
                        newControlFlowEdge(insnIndex, targetInsnIndex);
                    }
                }
                else if (insnNode instanceof TableSwitchInsnNode) {
                    TableSwitchInsnNode tableSwitchInsn = (TableSwitchInsnNode) insnNode;
                    int targetInsnIndex = insnList.indexOf(tableSwitchInsn.dflt);
                    newControlFlowEdge(insnIndex, targetInsnIndex);
                    for (int i = 0; i < tableSwitchInsn.labels.size(); ++i) {
                        LabelNode label = tableSwitchInsn.labels.get(i);
                        targetInsnIndex = insnList.indexOf(label);
                        newControlFlowEdge(insnIndex, targetInsnIndex);
                    }
                }
                else if (insnOpcode != ATHROW && (insnOpcode < IRETURN || insnOpcode > RETURN)) {
                    newControlFlowEdge(insnIndex, insnIndex + 1);
                }
            }

            List<TryCatchBlockNode> insnHandlers = handlers[insnIndex];
            if (insnHandlers != null) {
                for (TryCatchBlockNode tryCatchBlock : insnHandlers) {
                    newControlFlowExceptionEdge(insnIndex, tryCatchBlock);
                }
            }

        }
    }


    protected void init(final String owner, final MethodNode method) throws AnalyzerException {
        // Nothing to do.
    }

    // NOTE: 这是一个新添加的方法
    private void initInstructionsToProcess() {
        inInstructionsToProcess = new boolean[insnListSize];
        instructionsToProcess = new int[insnListSize];
        numInstructionsToProcess = 0;
    }

    // NOTE: 这是一个新添加的方法
    private int removeInstructionsToProcess() {
        int insnIndex = this.instructionsToProcess[--numInstructionsToProcess];
        inInstructionsToProcess[insnIndex] = false;
        return insnIndex;
    }

    // NOTE: 这是一个新添加的方法
    private void addInstructionsToProcess(final int insnIndex) {
        if (!inInstructionsToProcess[insnIndex]) {
            inInstructionsToProcess[insnIndex] = true;
            instructionsToProcess[numInstructionsToProcess++] = insnIndex;
        }
    }

    protected void newControlFlowEdge(final int insnIndex, final int successorIndex) {
        // Nothing to do.
        addInstructionsToProcess(successorIndex);
    }

    protected void newControlFlowExceptionEdge(final int insnIndex, final TryCatchBlockNode tryCatchBlock) {
        newControlFlowExceptionEdge(insnIndex, insnList.indexOf(tryCatchBlock.handler));
    }

    protected void newControlFlowExceptionEdge(final int insnIndex, final int successorIndex) {
        // Nothing to do.
        addInstructionsToProcess(successorIndex);
    }
}
```

### 编码实现

```java
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.AnalyzerException;

public class DeadCodeDiagnosis {
    public static int[] diagnose(String className, MethodNode mn) throws AnalyzerException {
        InsnList instructions = mn.instructions;
        int size = instructions.size();

        boolean[] flags = new boolean[size];
        ControlFlowAnalyzer analyzer = new ControlFlowAnalyzer() {
            @Override
            protected void newControlFlowEdge(int insnIndex, int successorIndex) {
                // 首先，处理自己的代码逻辑
                flags[insnIndex] = true;
                flags[successorIndex] = true;

                // 其次，调用父类的实现
                super.newControlFlowEdge(insnIndex, successorIndex);
            }
        };
        analyzer.analyze(className, mn);


        TIntArrayList intArrayList = new TIntArrayList();
        for (int i = 0; i < size; i++) {
            boolean flag = flags[i];
            if (!flag) {
                intArrayList.add(i);
            }
        }

        return intArrayList.toNativeArray();
    }
}
```

对于`DeadCodeDiagnosis`类，我们从三点来把握：

- 第一点，实现逻辑。通过重写`ControlFlowAnalyzer`类的`newControlFlowEdge`方法实现，将能够访问到了指令索引（instruction index）存放到一个`boolean[] flags`当中。
- 第二点，类名的命名规则。
    - 如果当前类是自己写的，那么类名的命名规则为`XxxDiagnosis`，其中定义的主要方法叫`diagnose`方法（诊断）。
    - 如果当前类继承自`Analyzer`类，或者说模仿`Analyzer`类，那么类命名规则为`XxxAnalyzer`类，其主要的方法为`analyze`方法（分析）。
- 第三点，`TIntArrayList`类的使用。
    - 类的作用：它的操作类似于`List<int>`类型，里面的每一个元素都是`int`类型，比使用`List<Integer>`更高效。
    - 类的来源：`TIntArrayList`类来源于trove4j类库。Trove is a high-performance library which provides primitive collections for Java.
    - 类的优势：The greatest benefit of using `TIntArrayList` is performance and memory consumption gains. No additional boxing/unboxing is needed as it stores the data inside of an `int[]` array.
    - 类的引用：在实际项目当中，可以在`pom.xml`文件中添加maven依赖

```xml
<dependency>
    <groupId>org.jetbrains.intellij.deps</groupId>
    <artifactId>trove4j</artifactId>
    <version>1.0.20200330</version>
</dependency>
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
        List<MethodNode> methods = cn.methods;
        MethodNode mn = methods.get(1);
        int[] array = DeadCodeDiagnosis.diagnose(cn.name, mn);
        System.out.println(Arrays.toString(array));
        BoxDrawingUtils.printInstructionLinks(mn.instructions, array);
    }
}
```

输出结果：

```text
[1, 6, 7, 8, 18, 19, 20]
      000: goto L0
┌──── 001: athrow
│     002: L0
│     003: getstatic System.out
│     004: iload_1
│     005: goto L1
├──── 006: nop
├──── 007: nop
├──── 008: athrow
│     009: L1
│     010: ifne L2
│     011: ldc "val is 0"
│     012: goto L3
│     013: L2
│     014: ldc "val is not 0"
│     015: L3
│     016: invokevirtual PrintStream.println
│     017: return
├──── 018: nop
├──── 019: nop
└──── 020: athrow
```

## 逻辑上的dead code

上面介绍的两种解决问题是没有办法处理代码逻辑上的dead code的：

```java
public class HelloWorld {
    public void test(int val) {
        if (val > 0) {
            if (val < -1) {
                // 这里是不可能执行的
                System.out.println(val);
            }
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，移除dead code的识别标志：如果某一条指令（instruction）是dead code，那么它对应的frame是`null`。
- 第二点，如果不借助于frame信息，那么我们可以使用`Analyzer`类的control flow analysis部分进行实现。
- 第三点，当前介绍的两种解决方法有局限性，不能处理代码逻辑上的dead code。
