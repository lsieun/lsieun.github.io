---
title: "SimpleVerifier示例：冗余变量分析"
sequence: "409"
---

## 如何判断变量是否冗余

如果在IntelliJ IDEA当中编写如下的代码，它会提示`str2`和`str3`局部变量是多余的：

```java
public class HelloWorld {
    public void test() {
        String str1 = "Hello ASM";
        Object obj1 = new Object();
        // Local variable 'str2' is redundant
        String str2 = str1;
        Object obj2 = new Object();
        // Local variable 'str3' is redundant
        String str3 = str2;
        Object obj3 = new Object();
        int length = str3.length();
        System.out.println(length);
    }
}
```

### 整体思路

结合`Analyzer`和`SimpleVerifier`类，我们可以查看Frame的变化情况：

```text
test:()V
000:                         ldc "Hello ASM"    {HelloWorld, ., ., ., ., ., ., .} | {}
001:                                astore_1    {HelloWorld, ., ., ., ., ., ., .} | {String}
002:                              new Object    {HelloWorld, String, ., ., ., ., ., .} | {}
003:                                     dup    {HelloWorld, String, ., ., ., ., ., .} | {Object}
004:             invokespecial Object.<init>    {HelloWorld, String, ., ., ., ., ., .} | {Object, Object}
005:                                astore_2    {HelloWorld, String, ., ., ., ., ., .} | {Object}
006:                                 aload_1    {HelloWorld, String, Object, ., ., ., ., .} | {}
007:                                astore_3    {HelloWorld, String, Object, ., ., ., ., .} | {String}
008:                              new Object    {HelloWorld, String, Object, String, ., ., ., .} | {}
009:                                     dup    {HelloWorld, String, Object, String, ., ., ., .} | {Object}
010:             invokespecial Object.<init>    {HelloWorld, String, Object, String, ., ., ., .} | {Object, Object}
011:                                astore 4    {HelloWorld, String, Object, String, ., ., ., .} | {Object}
012:                                 aload_3    {HelloWorld, String, Object, String, Object, ., ., .} | {}
013:                                astore 5    {HelloWorld, String, Object, String, Object, ., ., .} | {String}
014:                              new Object    {HelloWorld, String, Object, String, Object, String, ., .} | {}
015:                                     dup    {HelloWorld, String, Object, String, Object, String, ., .} | {Object}
016:             invokespecial Object.<init>    {HelloWorld, String, Object, String, Object, String, ., .} | {Object, Object}
017:                                astore 6    {HelloWorld, String, Object, String, Object, String, ., .} | {Object}
018:                                 aload 5    {HelloWorld, String, Object, String, Object, String, Object, .} | {}
019:             invokevirtual String.length    {HelloWorld, String, Object, String, Object, String, Object, .} | {String}
020:                                istore 7    {HelloWorld, String, Object, String, Object, String, Object, .} | {I}
021:                    getstatic System.out    {HelloWorld, String, Object, String, Object, String, Object, I} | {}
022:                                 iload 7    {HelloWorld, String, Object, String, Object, String, Object, I} | {PrintStream}
023:       invokevirtual PrintStream.println    {HelloWorld, String, Object, String, Object, String, Object, I} | {PrintStream, I}
024:                                  return    {HelloWorld, String, Object, String, Object, String, Object, I} | {}
================================================================
```

我们的整体思路是这样的：

- 在每一个Frame当中，它有local variable和operand stack两部分组成。
- 程序中定义的“变量”是存储在local variable当中。
- 在理想的情况下，一个“变量”对应于local variable当中的一个位置；如果一个“变量”对应于local variable当中的两个或多个位置，那么我们就认为“变量”出现了冗余。

那么，针对某一个具体的frame，相应的实现思路上是这样的：

- 判断`local[0]`和`local[1]`是否相同，如果相同，那么表示`local[1]`是冗余的变量。
- 判断`local[0]`和`local[2]`是否相同，如果相同，那么表示`local[2]`是冗余的变量。
- ...
- 判断`local[0]`和`local[n]`是否相同，如果相同，那么表示`local[n]`是冗余的变量。
- 判断`local[1]`和`local[2]`是否相同，如果相同，那么表示`local[2]`是冗余的变量。
- 判断`local[1]`和`local[3]`是否相同，如果相同，那么表示`local[3]`是冗余的变量。
- ...

需要注意的一点就是，如果local variable当中存储“未初始化的值”（`BasicValue.UNINITIALIZED_VALUE`），那么我们就不进行处理了。

具体来说，“未初始化的值”（`BasicValue.UNINITIALIZED_VALUE`）有两种情况：

- 第一种情况，在方法刚进入的时候，local variable有些位置存储的就是“未初始化的值”（`BasicValue.UNINITIALIZED_VALUE`）。
- 第二种情况，在存储`long`和`double`类型的数据时，它占用两个位置，其中第二个位置就是“未初始化的值”（`BasicValue.UNINITIALIZED_VALUE`）。

### 为什么选择SimpleVerifier

在ASM当中，`Interpreter`类是一个抽象类，其中提供的子类有`BasicInterpreter`、`BasicVerifier`、`SimpleVerifier`和`SourceInterpreter`类。那么，我们到底应该选择哪一个呢？

```text
┌───┬───────────────────┬─────────────┬───────┐
│ 0 │    Interpreter    │    Value    │ Range │
├───┼───────────────────┼─────────────┼───────┤
│ 1 │ BasicInterpreter  │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 2 │   BasicVerifier   │ BasicValue  │   7   │
├───┼───────────────────┼─────────────┼───────┤
│ 3 │  SimpleVerifier   │ BasicValue  │   N   │
├───┼───────────────────┼─────────────┼───────┤
│ 4 │ SourceInterpreter │ SourceValue │   N   │
└───┴───────────────────┴─────────────┴───────┘
```

首先，不能选择`BasicInterpreter`和`BasicVerifier`类。因为它们使用7个值（`BasicValue`类定义的7个静态字段）来模拟Frame的变化，这7个值的“表达能力”很弱。如果一个对象是`String`类型，另一个对象是`Object`类型，这两个对象都会被表示成`BasicValue.REFERENCE_VALUE`，没有办法进行区分。

其次，不能选择`SourceInterpreter`类。因为它定义的`copyOperation`方法中会创建一个新的对象（`new SourceValue(value.getSize(), insn)`），不能识别为同一个对象。

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
    @Override
    public SourceValue copyOperation(final AbstractInsnNode insn, final SourceValue value) {
        return new SourceValue(value.getSize(), insn);
    }
}
```

为什么要关注这个`copyOperation`方法呢？因为`copyOperation`方法负责处理load和store相关的指令。

```java
public abstract class Interpreter<V extends Value> {
    /**
     * Interprets a bytecode instruction that moves a value on the stack or to or from local variables.
     * This method is called for the following opcodes:
     *
     * ILOAD, LLOAD, FLOAD, DLOAD, ALOAD,
     * ISTORE, LSTORE, FSTORE, DSTORE, ASTORE,
     * DUP, DUP_X1, DUP_X2, DUP2, DUP2_X1, DUP2_X2, SWAP
     *
     */
    public abstract V copyOperation(AbstractInsnNode insn, V value) throws AnalyzerException;
}
```

最后，选择`SimpleVerifier`是合适的。一方面，它能区分不同的类型（class）、区分不同的对象实例（object instance）；另一方面，在`copyOperation`方法中保证了对象的一致性，传入的是`value`，返回的仍然是`value`。更准确的来说，`SimpleVerifier`是继承了父类`BasicVerifier`类的`copyOperation`方法。

```java
public class BasicVerifier extends BasicInterpreter {
    @Override
    public BasicValue copyOperation(final AbstractInsnNode insn, final BasicValue value)
            throws AnalyzerException {
        //...
        return value;
    }
}
```

## 示例：冗余变量分析

### 预期目标

在下面的代码中，会提示`str2`和`str3`局部变量是多余的：

```java
public class HelloWorld {
    public void test() {
        String str1 = "Hello ASM";
        Object obj1 = new Object();
        // Local variable 'str2' is redundant
        String str2 = str1;
        Object obj2 = new Object();
        // Local variable 'str3' is redundant
        String str3 = str2;
        Object obj3 = new Object();
        int length = str3.length();
        System.out.println(length);
    }
}
```

我们的预期目标：识别出`str2`和`str3`是冗余变量。

### 编码实现

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.VarInsnNode;
import org.objectweb.asm.tree.analysis.*;

import java.util.Arrays;

public class RedundantVariableDiagnosis {
    public static int[] diagnose(String className, MethodNode mn) throws AnalyzerException {
        // 第一步，准备工作。使用SimpleVerifier进行分析，得到frames信息
        Analyzer<BasicValue> analyzer = new Analyzer<>(new SimpleVerifier());
        Frame<BasicValue>[] frames = analyzer.analyze(className, mn);

        // 第二步，利用frames信息，查看local variable当中哪些slot数据出现了冗余
        TIntArrayList localIndexList = new TIntArrayList();
        for (Frame<BasicValue> f : frames) {
            int locals = f.getLocals();
            for (int i = 0; i < locals; i++) {
                BasicValue val1 = f.getLocal(i);
                if (val1 == BasicValue.UNINITIALIZED_VALUE) {
                    continue;
                }
                for (int j = i + 1; j < locals; j++) {
                    BasicValue val2 = f.getLocal(j);
                    if (val2 == BasicValue.UNINITIALIZED_VALUE) {
                        continue;
                    }
                    if (val1 == val2) {
                        if (!localIndexList.contains(j)) {
                            localIndexList.add(j);
                        }
                    }
                }
            }
        }

        // 第三步，将slot的索引值（local index）转换成instruction的索引值（insn index）
        TIntArrayList insnIndexList = new TIntArrayList();
        InsnList instructions = mn.instructions;
        int size = instructions.size();
        for (int i = 0; i < size; i++) {
            AbstractInsnNode node = instructions.get(i);
            int opcode = node.getOpcode();
            if (opcode >= Opcodes.ISTORE && opcode <= Opcodes.ASTORE) {
                VarInsnNode varInsnNode = (VarInsnNode) node;
                if (localIndexList.contains(varInsnNode.var)) {
                    if (!insnIndexList.contains(i)) {
                        insnIndexList.add(i);
                    }
                }
            }
        }

        // 第四步，将insnIndexList转换成int[]形式
        int[] array = insnIndexList.toNativeArray();
        Arrays.sort(array);
        return array;
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
        int[] array = RedundantVariableDiagnosis.diagnose(cn.name, mn);
        System.out.println(Arrays.toString(array));
        BoxDrawingUtils.printInstructionLinks(mn.instructions, array);
    }
}
```

输出结果：

```text
[7, 13]
      000: ldc "Hello ASM"
      001: astore_1
      002: new Object
      003: dup
      004: invokespecial Object.<init>
      005: astore_2
      006: aload_1
┌──── 007: astore_3
│     008: new Object
│     009: dup
│     010: invokespecial Object.<init>
│     011: astore 4
│     012: aload_3
└──── 013: astore 5
      014: new Object
      015: dup
      016: invokespecial Object.<init>
      017: astore 6
      018: aload 5
      019: invokevirtual String.length
      020: istore 7
      021: getstatic System.out
      022: iload 7
      023: invokevirtual PrintStream.println
      024: return
```

## 测试用例

### primitive type - no

本文介绍的方法不适合对primitive type进行分析：

- 所有`int`类型的值都用`BasicValue.INT_VALUE`表示，不能对两个不同的值进行区分
- 所有`float`类型的值都用`BasicValue.FLOAT_VALUE`表示，不能对两个不同的值进行区分
- 所有`long`类型的值都用`BasicValue.LONG_VALUE`表示，不能对两个不同的值进行区分
- 所有`double`类型的值都用`BasicValue.DOUBLE_VALUE`表示，不能对两个不同的值进行区分

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a + b;
        int d = a - b;
        int e = c * d;
        System.out.println(e);
    }
}
```

输出结果（错误）：

```text
[3, 7, 11, 15]
      000: iconst_1
      001: istore_1
      002: iconst_2
┌──── 003: istore_2
│     004: iload_1
│     005: iload_2
│     006: iadd
├──── 007: istore_3
│     008: iload_1
│     009: iload_2
│     010: isub
├──── 011: istore 4
│     012: iload_3
│     013: iload 4
│     014: imul
└──── 015: istore 5
      016: getstatic System.out
      017: iload 5
      018: invokevirtual PrintStream.println
      019: return
```

### return-no

本文介绍的方法也不适用于`return`语句的判断。在下面的代码中，会提示`result`局部变量是多余的：

```java
public class HelloWorld {
    public Object test() {
        // Local variable 'result' is redundant
        Object result = new Object();
        return result;
    }
}
```

我觉得，可以使用`astore aload areturn`的指令组合来识别这种情况，不一定要使用Frame的分析做到。

## 总结

本文内容总结如下：

- 第一点，如何判断一个变量是否冗余呢？看看local variable当中是否有两个或多个相同的值。
- 第二点，代码示例，编码实现冗余变量分析。
