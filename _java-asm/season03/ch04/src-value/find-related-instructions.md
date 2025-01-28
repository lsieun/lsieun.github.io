---
title: "SourceInterpreter示例：查找相关的指令"
sequence: "412"
---


在StackOverflow上有这样一个问题：[Find all instructions belonging to a specific method-call](https://stackoverflow.com/questions/60969392/java-asm-bytecode-find-all-instructions-belonging-to-a-specific-method-call)。在解决方法当中，就用到了`SourceInterpreter`和`SourceValue`类。在本文当中，我们将这个问题和解决思路简单地进行介绍。

## 实现思路

### 回顾SourceInterpreter

首先，我们来回顾一下`SourceInterpreter`的作用：记录指令（instruction）与Frame当中值（`SourceValue`）的关联关系。

```java
public class HelloWorld {
    public void test(int a, int b) {
        int c = a + b;
        System.out.println(c);
    }
}
```

那么，借助于`SourceInterpreter`类查看`test`方法内某一条instuction将某一个`SourceValue`加载（入栈）到Frame上：

```text
test:(II)V
000:                                 iload_1    {[], [], [], []} | {}
001:                                 iload_2    {[], [], [], []} | {[iload_1]}
002:                                    iadd    {[], [], [], []} | {[iload_1], [iload_2]}
003:                                istore_3    {[], [], [], []} | {[iadd]}
004:                    getstatic System.out    {[], [], [], [istore_3]} | {}
005:                                 iload_3    {[], [], [], [istore_3]} | {[getstatic System.out]}
006:       invokevirtual PrintStream.println    {[], [], [], [istore_3]} | {[getstatic System.out], [iload_3]}
007:                                  return    {[], [], [], [istore_3]} | {}
================================================================
```

由此，我们可以模仿一下，进一步记录某一条instuction将某一个`SourceValue`从Frame上消耗掉（出栈）：

```text
test:(II)V
000:                                 iload_1    {[], [], [], []} | {}
001:                                 iload_2    {[], [], [], []} | {[iadd]}
002:                                    iadd    {[], [], [], []} | {[iadd], [iadd]}
003:                                istore_3    {[], [], [], []} | {[istore_3]}
004:                    getstatic System.out    {[], [], [], []} | {}
005:                                 iload_3    {[], [], [], []} | {[invokevirtual PrintStream.println]}
006:       invokevirtual PrintStream.println    {[], [], [], []} | {[invokevirtual PrintStream.println], [invokevirtual PrintStream.println]}
007:                                  return    {[], [], [], []} | {}
================================================================
```

![My Image](/assets/images/manga/naruto/reciprocal-round-robin-jutsu.jpg)

那么，我们怎么实现这样一个功能呢？用一个`DestinationInterpreter`类来实现。

### DestinationInterpreter

首先，我们编写一个`DestinationInterpreter`类。对于这个类，我们从两点来把握：

- 第一点，抽象功能。要实现什么的功能呢？记录operand stack上某一个元素是被哪一个指令（instruction）消耗掉（出栈）的。这个功能正好与`SourceInterpreter`类的功能相反。
- 第二点，具体实现。如何进行编码实现呢？`DestinationInterpreter`类，是模仿着`SourceInterpreter`类实现的。

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.AnalyzerException;
import org.objectweb.asm.tree.analysis.Interpreter;
import org.objectweb.asm.tree.analysis.SourceValue;

import java.util.HashSet;
import java.util.List;

public class DestinationInterpreter extends Interpreter<SourceValue> implements Opcodes {
    public DestinationInterpreter() {
        super(ASM9);
        if (getClass() != DestinationInterpreter.class) {
            throw new IllegalStateException();
        }
    }

    protected DestinationInterpreter(final int api) {
        super(api);
    }

    @Override
    public SourceValue newValue(Type type) {
        if (type == Type.VOID_TYPE) {
            return null;
        }
        return new SourceValue(type == null ? 1 : type.getSize(), new HashSet<>());
    }

    @Override
    public SourceValue newOperation(AbstractInsnNode insn) {
        int size;
        switch (insn.getOpcode()) {
            case LCONST_0:
            case LCONST_1:
            case DCONST_0:
            case DCONST_1:
                size = 2;
                break;
            case LDC:
                Object value = ((LdcInsnNode) insn).cst;
                size = value instanceof Long || value instanceof Double ? 2 : 1;
                break;
            case GETSTATIC:
                size = Type.getType(((FieldInsnNode) insn).desc).getSize();
                break;
            default:
                size = 1;
                break;
        }
        return new SourceValue(size, new HashSet<>());
    }

    @Override
    public SourceValue copyOperation(AbstractInsnNode insn, SourceValue value) throws AnalyzerException {
        int opcode = insn.getOpcode();
        if (opcode >= ISTORE && opcode <= ASTORE) {
            value.insns.add(insn);
        }

        return new SourceValue(value.getSize(), new HashSet<>());
    }

    @Override
    public SourceValue unaryOperation(AbstractInsnNode insn, SourceValue value) throws AnalyzerException {
        value.insns.add(insn);

        int size;
        switch (insn.getOpcode()) {
            case LNEG:
            case DNEG:
            case I2L:
            case I2D:
            case L2D:
            case F2L:
            case F2D:
            case D2L:
                size = 2;
                break;
            case GETFIELD:
                size = Type.getType(((FieldInsnNode) insn).desc).getSize();
                break;
            default:
                size = 1;
                break;
        }
        return new SourceValue(size, new HashSet<>());
    }

    @Override
    public SourceValue binaryOperation(AbstractInsnNode insn, SourceValue value1, SourceValue value2) throws AnalyzerException {
        value1.insns.add(insn);
        value2.insns.add(insn);

        int size;
        switch (insn.getOpcode()) {
            case LALOAD:
            case DALOAD:
            case LADD:
            case DADD:
            case LSUB:
            case DSUB:
            case LMUL:
            case DMUL:
            case LDIV:
            case DDIV:
            case LREM:
            case DREM:
            case LSHL:
            case LSHR:
            case LUSHR:
            case LAND:
            case LOR:
            case LXOR:
                size = 2;
                break;
            default:
                size = 1;
                break;
        }
        return new SourceValue(size, new HashSet<>());
    }

    @Override
    public SourceValue ternaryOperation(AbstractInsnNode insn, SourceValue value1, SourceValue value2, SourceValue value3) throws AnalyzerException {
        value1.insns.add(insn);
        value2.insns.add(insn);
        value3.insns.add(insn);

        return new SourceValue(1, new HashSet<>());
    }

    @Override
    public SourceValue naryOperation(AbstractInsnNode insn, List<? extends SourceValue> values) throws AnalyzerException {
        if (values != null) {
            for (SourceValue v : values) {
                v.insns.add(insn);
            }
        }

        int size;
        int opcode = insn.getOpcode();
        if (opcode == MULTIANEWARRAY) {
            size = 1;
        }
        else if (opcode == INVOKEDYNAMIC) {
            size = Type.getReturnType(((InvokeDynamicInsnNode) insn).desc).getSize();
        }
        else {
            size = Type.getReturnType(((MethodInsnNode) insn).desc).getSize();
        }
        return new SourceValue(size, new HashSet<>());
    }

    @Override
    public void returnOperation(AbstractInsnNode insn, SourceValue value, SourceValue expected) throws AnalyzerException {
        // Nothing to do.
    }

    @Override
    public SourceValue merge(final SourceValue value1, final SourceValue value2) {
        return new SourceValue(Math.min(value1.size, value2.size), new HashSet<>());
    }
}
```

## 示例：查找相关的指令

### 预期目标

假如有一个`HelloWorld`类：

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = 3;
        int d = 4;
        int sum = add(a, b);
        int diff = sub(c, d);
        int result = mul(sum, diff);
        System.out.println(result);
    }

    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }

    public int mul(int a, int b) {
        return a * b;
    }
}
```

我们对`test`方法进行分析，想实现的预期目标：如果想删除对某一个方法的调用，有哪些指令会变得无效呢？

例如，想删除`add(a, b)`方法调用，直接使用`int sum = 10;`，那么`a`和`b`两个变量就不需要了：

```java
public class HelloWorld {
    public void test() {
        int c = 3;
        int d = 4;
        int sum = 10;
        int diff = sub(c, d);
        int result = mul(sum, diff);
        System.out.println(result);
    }

    // ...
}
```

### 编码实现

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.VarInsnNode;
import org.objectweb.asm.tree.analysis.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RelatedInstructionDiagnosis {
    public static int[] diagnose(String className, MethodNode mn, int insnIndex) throws AnalyzerException {
        // 第一步，判断insnIndex范围是否合理
        InsnList instructions = mn.instructions;
        int size = instructions.size();
        if (insnIndex < 0 || insnIndex >= size) {
            String message = String.format("the 'insnIndex' argument should in range [0, %d]", size - 1);
            throw new IllegalArgumentException(message);
        }

        // 第二步，获取两个Frame
        Frame<SourceValue>[] sourceFrames = getSourceFrames(className, mn);
        Frame<SourceValue>[] destinationFrames = getDestinationFrames(className, mn);

        // 第三步，循环处理，所有结果记录到这个intArrayList变量中
        TIntArrayList intArrayList = new TIntArrayList();
        // 循环tmpInsnList
        List<AbstractInsnNode> tmpInsnList = new ArrayList<>();
        AbstractInsnNode insnNode = instructions.get(insnIndex);
        tmpInsnList.add(insnNode);
        for (int i = 0; i < tmpInsnList.size(); i++) {
            AbstractInsnNode currentNode = tmpInsnList.get(i);
            int opcode = currentNode.getOpcode();

            int index = instructions.indexOf(currentNode);
            intArrayList.add(index);

            // 第一种情况，处理load相关的opcode情况
            Frame<SourceValue> srcFrame = sourceFrames[index];
            if (opcode >= Opcodes.ILOAD && opcode <= Opcodes.ALOAD) {
                VarInsnNode varInsnNode = (VarInsnNode) currentNode;
                int localIndex = varInsnNode.var;
                SourceValue value = srcFrame.getLocal(localIndex);
                for (AbstractInsnNode insn : value.insns) {
                    if (!tmpInsnList.contains(insn)) {
                        tmpInsnList.add(insn);
                    }
                }
            }

            // 第二种情况，从dstFrame到srcFrame查找
            Frame<SourceValue> dstFrame = destinationFrames[index];
            int stackSize = dstFrame.getStackSize();
            for (int j = 0; j < stackSize; j++) {
                SourceValue value = dstFrame.getStack(j);
                if (value.insns.contains(currentNode)) {
                    for (AbstractInsnNode insn : srcFrame.getStack(j).insns) {
                        if (!tmpInsnList.contains(insn)) {
                            tmpInsnList.add(insn);
                        }
                    }
                }
            }
        }

        // 第四步，将intArrayList变量转换成int[]，并进行排序
        int[] array = intArrayList.toNativeArray();
        Arrays.sort(array);
        return array;
    }


    private static Frame<SourceValue>[] getSourceFrames(String className, MethodNode mn) throws AnalyzerException {
        Analyzer<SourceValue> analyzer = new Analyzer<>(new SourceInterpreter());
        return analyzer.analyze(className, mn);
    }

    private static Frame<SourceValue>[] getDestinationFrames(String className, MethodNode mn) throws AnalyzerException {
        Analyzer<SourceValue> analyzer = new Analyzer<>(new DestinationInterpreter());
        return analyzer.analyze(className, mn);
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
        List<MethodNode> methods = cn.methods;
        MethodNode mn = methods.get(1);
        int[] array = RelatedInstructionDiagnosis.diagnose(cn.name, mn, 11);
        System.out.println(Arrays.toString(array));
        BoxDrawingUtils.printInstructionLinks(mn.instructions, array);
    }
}
```

输出结果：

```text
[0, 1, 2, 3, 8, 9, 10, 11]
┌──── 000: iconst_1
├──── 001: istore_1
├──── 002: iconst_2
├──── 003: istore_2
│     004: iconst_3
│     005: istore_3
│     006: iconst_4
│     007: istore 4
├──── 008: aload_0
├──── 009: iload_1
├──── 010: iload_2
└──── 011: invokevirtual HelloWorld.add
      012: istore 5
      013: aload_0
      014: iload_3
      015: iload 4
      016: invokevirtual HelloWorld.sub
      017: istore 6
      018: aload_0
      019: iload 5
      020: iload 6
      021: invokevirtual HelloWorld.mul
      022: istore 7
      023: getstatic System.out
      024: iload 7
      025: invokevirtual PrintStream.println
      026: return
```

## 测试用例

### switch-yes

```java
public class HelloWorld {
    public void test(int val) {
        double doubleValue = Math.random();
        switch (val) {
            case 10:
                System.out.println("val = 10");
                break;
            case 20:
                System.out.println("val = 20");
                break;
            case 30:
                System.out.println("val = 30");
                break;
            case 40:
                System.out.println("val = 40");
                break;
            default:
                System.out.println("val is unknown");
        }
        System.out.println(doubleValue); // 分析这条语句
    }
}
```

输出结果：

```text
[0, 1, 29, 30, 31]
┌──── 000: invokestatic Math.random
├──── 001: dstore_2
│     002: iload_1
│     003: lookupswitch {
│              10: L0
│              20: L1
│              30: L2
│              40: L3
│              default: L4
│          }
│     004: L0
│     005: getstatic System.out
│     006: ldc "val = 10"
│     007: invokevirtual PrintStream.println
│     008: goto L5
│     009: L1
│     010: getstatic System.out
│     011: ldc "val = 20"
│     012: invokevirtual PrintStream.println
│     013: goto L5
│     014: L2
│     015: getstatic System.out
│     016: ldc "val = 30"
│     017: invokevirtual PrintStream.println
│     018: goto L5
│     019: L3
│     020: getstatic System.out
│     021: ldc "val = 40"
│     022: invokevirtual PrintStream.println
│     023: goto L5
│     024: L4
│     025: getstatic System.out
│     026: ldc "val is unknown"
│     027: invokevirtual PrintStream.println
│     028: L5
├──── 029: getstatic System.out
├──── 030: dload_2
└──── 031: invokevirtual PrintStream.println
      032: return
```

### switch-no

在当前的解决思路中，还不能很好的处理创建对象（`new`）的情况。

```java
public class HelloWorld {
    public void test(int val) {
        Random rand = new Random(); // 注意，这里创建了Random对象
        double doubleValue = rand.nextDouble();
        switch (val) {
            case 10:
                System.out.println("val = 10");
                break;
            case 20:
                System.out.println("val = 20");
                break;
            case 30:
                System.out.println("val = 30");
                break;
            case 40:
                System.out.println("val = 40");
                break;
            default:
                System.out.println("val is unknown");
        }
        System.out.println(doubleValue); // 分析这条语句
    }
}
```

输出结果：

```text
[0, 3, 4, 5, 6, 34, 35, 36]
┌──── 000: new Random                              // new + dup + invokespecial三个指令一起来创建对象
│     001: dup                                     // 当前的方法只分析出了new，而没有分析出dup和invokespecial
│     002: invokespecial Random.<init>
├──── 003: astore_2
├──── 004: aload_2
├──── 005: invokevirtual Random.nextDouble
├──── 006: dstore_3
│     007: iload_1
│     008: lookupswitch {
│              10: L0
│              20: L1
│              30: L2
│              40: L3
│              default: L4
│          }
│     009: L0
│     010: getstatic System.out
│     011: ldc "val = 10"
│     012: invokevirtual PrintStream.println
│     013: goto L5
│     014: L1
│     015: getstatic System.out
│     016: ldc "val = 20"
│     017: invokevirtual PrintStream.println
│     018: goto L5
│     019: L2
│     020: getstatic System.out
│     021: ldc "val = 30"
│     022: invokevirtual PrintStream.println
│     023: goto L5
│     024: L3
│     025: getstatic System.out
│     026: ldc "val = 40"
│     027: invokevirtual PrintStream.println
│     028: goto L5
│     029: L4
│     030: getstatic System.out
│     031: ldc "val is unknown"
│     032: invokevirtual PrintStream.println
│     033: L5
├──── 034: getstatic System.out
├──── 035: dload_3
└──── 036: invokevirtual PrintStream.println
      037: return
```

## 总结

本文内容总结如下：

- 第一点，模拟`SourceInterpreter`类来编写一个`DestinationInterpreter`类，这两个类的作用是相反的。
- 第二点，结合`SourceInterpreter`和`DestinationInterpreter`类，用来查找相关的指令。
