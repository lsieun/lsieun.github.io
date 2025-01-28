---
title: "SourceInterpreter示例：反编译-方法参数"
sequence: "411"
---

## 如何反编译方法参数

### 提出问题

我们在学习Java的过程中，多多少少都会用到[Java Decompiler](http://java-decompiler.github.io/)工具，它可以将具体的`.class`文件转换成相应的Java代码。

假如有一个`HelloWorld`类：

```text
public class HelloWorld {
    public void test(int a, int b) {
        int sum = Math.addExact(a, b);
        int diff = Math.subtractExact(a, b);
        int result = Math.multiplyExact(sum, diff);
        System.out.println(result);
    }
}
```

上面的`HelloWorld.java`经过编译之后会生成`HelloWorld.class`文件，然后可以查看其包含的instruction内容：

```text
$ javap -v sample.HelloWorld
  Compiled from "HelloWorld.java"
public class sample.HelloWorld
{
...
  public void test(int, int);
    descriptor: (II)V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=6, args_size=3
         0: iload_1
         1: iload_2
         2: invokestatic  #2                  // Method java/lang/Math.addExact:(II)I
         5: istore_3
         6: iload_1
         7: iload_2
         8: invokestatic  #3                  // Method java/lang/Math.subtractExact:(II)I
        11: istore        4
        13: iload_3
        14: iload         4
        16: invokestatic  #4                  // Method java/lang/Math.multiplyExact:(II)I
        19: istore        5
        21: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
        24: iload         5
        26: invokevirtual #6                  // Method java/io/PrintStream.println:(I)V
        29: return
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      30     0  this   Lsample/HelloWorld;
            0      30     1     a   I
            0      30     2     b   I
            6      24     3   sum   I
           13      17     4  diff   I
           21       9     5 result   I
}
```

那么，我们能不能利用Java ASM帮助我们做一些反编译的工作呢？

### 整体思路

我们的整体思路就是，结合`SourceInterpreter`类和`LocalVariableTable`来对invoke（方法调用）相关的指令进行反编译。

使用`SourceInterpreter`类输出Frame变化信息：

```text
test:(II)V
000:                                 iload_1    {[], [], [], [], [], []} | {}
001:                                 iload_2    {[], [], [], [], [], []} | {[iload_1]}
002:              invokestatic Math.addExact    {[], [], [], [], [], []} | {[iload_1], [iload_2]}
003:                                istore_3    {[], [], [], [], [], []} | {[invokestatic Math.addExact]}
004:                                 iload_1    {[], [], [], [istore_3], [], []} | {}
005:                                 iload_2    {[], [], [], [istore_3], [], []} | {[iload_1]}
006:         invokestatic Math.subtractExact    {[], [], [], [istore_3], [], []} | {[iload_1], [iload_2]}
007:                                istore 4    {[], [], [], [istore_3], [], []} | {[invokestatic Math.subtractExact]}
008:                                 iload_3    {[], [], [], [istore_3], [istore 4], []} | {}
009:                                 iload 4    {[], [], [], [istore_3], [istore 4], []} | {[iload_3]}
010:         invokestatic Math.multiplyExact    {[], [], [], [istore_3], [istore 4], []} | {[iload_3], [iload 4]}
011:                                istore 5    {[], [], [], [istore_3], [istore 4], []} | {[invokestatic Math.multiplyExact]}
012:                    getstatic System.out    {[], [], [], [istore_3], [istore 4], [istore 5]} | {}
013:                                 iload 5    {[], [], [], [istore_3], [istore 4], [istore 5]} | {[getstatic System.out]}
014:       invokevirtual PrintStream.println    {[], [], [], [istore_3], [istore 4], [istore 5]} | {[getstatic System.out], [iload 5]}
015:                                  return    {[], [], [], [istore_3], [istore 4], [istore 5]} | {}
================================================================
```

## 示例：方法参数反编译

### 预期目标

我们想对`HelloWorld.class`中的`test`方法内的invoke相关的instruction进行反编译。

```text
public class HelloWorld {
    public void test(int a, int b) {
        int sum = Math.addExact(a, b);
        int diff = Math.subtractExact(a, b);
        int result = Math.multiplyExact(sum, diff);
        System.out.println(result);
    }
}
```

预期目标：将方法调用的参数进行反编译。

例如，将下面的instructions反编译成`Math.addExact(a, b)`。

```text
0: iload_1
1: iload_2
2: invokestatic  #2                  // Method java/lang/Math.addExact:(II)I
```

### 编码实现

```java
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;

import java.util.ArrayList;
import java.util.List;

public class ReverseEngineerMethodArgumentsDiagnosis {
    private static final String UNKNOWN_VARIABLE_NAME = "unknown";

    public static void diagnose(String className, MethodNode mn) throws AnalyzerException {
        // 第一步，获取Frame信息
        Analyzer<SourceValue> analyzer = new Analyzer<>(new SourceInterpreter());
        Frame<SourceValue>[] frames = analyzer.analyze(className, mn);

        // 第二步，获取LocalVariableTable信息
        List<LocalVariableNode> localVariables = mn.localVariables;
        if (localVariables == null || localVariables.size() < 1) {
            System.out.println("LocalVariableTable is Empty");
            return;
        }

        // 第三步，获取instructions，并找到与invoke相关的指令
        InsnList instructions = mn.instructions;
        int[] methodInsnArray = findMethodInvokes(instructions);

        // 第四步，对invoke相关的指令进行反编译
        for (int methodInsn : methodInsnArray) {
            // (1) 获取方法的参数
            MethodInsnNode methodInsnNode = (MethodInsnNode) instructions.get(methodInsn);
            Type methodType = Type.getMethodType(methodInsnNode.desc);
            Type[] argumentTypes = methodType.getArgumentTypes();
            int argNum = argumentTypes.length;

            // (2) 从Frame当中获取指令，并将指令转换LocalVariableTable当中的变量名
            Frame<SourceValue> f = frames[methodInsn];
            int stackSize = f.getStackSize();
            List<String> argList = new ArrayList<>();
            for (int i = 0; i < argNum; i++) {
                int stackIndex = stackSize - argNum + i;
                SourceValue stackValue = f.getStack(stackIndex);
                AbstractInsnNode insn = stackValue.insns.iterator().next();
                String argName = getMethodVariableName(insn, localVariables);
                argList.add(argName);
            }

            // (3) 将反编译的结果打印出来
            String line = String.format("%s.%s(%s)", methodInsnNode.owner, methodInsnNode.name, argList);
            System.out.println(line);
        }
    }

    public static String getMethodVariableName(AbstractInsnNode insn, List<LocalVariableNode> localVariables) {
        if (insn instanceof VarInsnNode) {
            VarInsnNode varInsnNode = (VarInsnNode) insn;
            int localIndex = varInsnNode.var;

            for (LocalVariableNode node : localVariables) {
                if (node.index == localIndex) {
                    return node.name;
                }
            }

            return String.format("locals[%d]", localIndex);
        }
        return UNKNOWN_VARIABLE_NAME;
    }

    public static int[] findMethodInvokes(InsnList instructions) {
        int size = instructions.size();
        boolean[] methodArray = new boolean[size];
        for (int i = 0; i < size; i++) {
            AbstractInsnNode node = instructions.get(i);
            if (node instanceof MethodInsnNode) {
                methodArray[i] = true;
            }
        }

        int count = 0;
        for (boolean flag : methodArray) {
            if (flag) {
                count++;
            }
        }

        int[] array = new int[count];
        int j = 0;
        for (int i = 0; i < size; i++) {
            boolean flag = methodArray[i];
            if (flag) {
                array[j] = i;
                j++;
            }
        }
        return array;
    }
}
```

### 进行分析

在`HelloWorldAnalysisTree`类当中，要注意：不能使用`ClassReader.SKIP_DEBUG`，因为我们要使用到`MethodNode.localVariables`字段的信息。

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

        int parsingOptions = ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）进行分析
        String className = cn.name;
        List<MethodNode> methods = cn.methods;
        MethodNode mn = methods.get(1);
        ReverseEngineerMethodArgumentsDiagnosis.diagnose(className, mn);
    }
}
```

输出结果：

```text
java/lang/Math.addExact([a, b])
java/lang/Math.subtractExact([a, b])
java/lang/Math.multiplyExact([sum, diff])
java/io/PrintStream.println([result])
```

## 总结

本文内容总结如下：

- 第一点，整体的思路，是利用`SourceInterpreter`类和LocalVariableTable来实现的。
- 第二点，代码示例。如何编码实现对于方法的参数进行反编译。

