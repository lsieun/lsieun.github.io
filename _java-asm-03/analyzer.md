---
title:  "Analyzer"
sequence: "403"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## Analyzer类

### class info

第一个部分，`Analyzer`类实现了`Opcodes`接口。

```java
public class Analyzer<V extends Value> implements Opcodes {
}
```

### fields

第二个部分，`Analyzer`类定义的字段有哪些。

| 领域 | ClassFile | ASM | JVM Frame(local variable + operand stack) |
|-----|-----------|-----|-----|
| 元素 | `Code = code[] + exception_table` | `MethodNode = InsnList + TryCatchBlockNode` | Interpreter + Frame |

这字段分成三组：

- 第一组，`insnList`表示指令集合，`insnListSize`表示指令集的大小，`handlers`表示异常处理的机制，这三个字段都是属于“方法”的内容。
- 第二组，`interpreter`、`frames`和泛型`V`则是用来模拟“local variable和operand stack”的内容。
- 第三组，`inInstructionsToProcess`、`instructionsToProcess`和`numInstructionsToProcess`三个字段都是“数据容器”，用来记录过程中的内部状态。

粗略地理解：第一组字段，可以理解为“数据输入”，第二组字段，可以理解为“中间状态”，第三组字段，可以理解为“输出结果”。

```java
public class Analyzer<V extends Value> implements Opcodes {
    // 第一组，指令和异常处理，是属于“方法”的内容。
    private InsnList insnList;
    private int insnListSize;
    private List<TryCatchBlockNode>[] handlers;

    // 第二组，Interpreter和Frame，是属于“local variable和operand stack”的内容。
    private final Interpreter<V> interpreter;
    private Frame<V>[] frames;

    // 第三组，在运行过程中，记录临时状态的变化量
    private boolean[] inInstructionsToProcess;
    private int[] instructionsToProcess;
    private int numInstructionsToProcess;
}
```

### constructors

第三个部分，`Analyzer`类定义的构造方法有哪些。

```java
public class Analyzer<V extends Value> implements Opcodes {
    public Analyzer(Interpreter<V> interpreter) {
        this.interpreter = interpreter;
    }
}
```

### methods

第四个部分，`Analyzer`类定义的方法有哪些。

```java
public class Analyzer<V extends Value> implements Opcodes {
    public Frame<V>[] analyze(final String owner, final MethodNode method) throws AnalyzerException {
        // 如果方法是abstract或native方法，则直接返回
        if ((method.access & (ACC_ABSTRACT | ACC_NATIVE)) != 0) {
            frames = (Frame<V>[]) new Frame<?>[0];
            return frames;
        }
        
        // 为各个字段进行赋值
        insnList = method.instructions;
        insnListSize = insnList.size();
        handlers = (List<TryCatchBlockNode>[]) new List<?>[insnListSize];
        frames = (Frame<V>[]) new Frame<?>[insnListSize];
        inInstructionsToProcess = new boolean[insnListSize];
        instructionsToProcess = new int[insnListSize];
        numInstructionsToProcess = 0;
        // ...
        
        // 计算方法的初始Frame
        Frame<V> currentFrame = computeInitialFrame(owner, method);
        merge(0, currentFrame, null);
        init(owner, method);

        // 通过循环对每一条指令进行处理
        while (numInstructionsToProcess > 0) {
            // 计算每一条指令对应的Frame的状态
            // ...
        }

        return frames;
    }
}
```

## MockAnalyzer类

在刚开始接触`Analyzer`类的时候，不太容易理解。因此，在[项目](https://gitee.com/lsieun/learn-java-asm)当中，我们提供了`MockAnalyzer`类，它是对`Analyzer`类的简化。

### class info

第一个部分，`MockAnalyzer`类实现了`Opcodes`类。

```java
public class MockAnalyzer<V extends Value> implements Opcodes {
}
```

### fields

第二个部分，`MockAnalyzer`类定义的字段有哪些。在这个类当中，我们定义了原来的`interpreter`字段，因为其它的字段都可以转换成局部变量。

```java
public class MockAnalyzer<V extends Value> implements Opcodes {
    private final Interpreter<V> interpreter;
}
```

### constructors

第三个部分，`MockAnalyzer`类定义的构造方法有哪些。

```java
public class MockAnalyzer<V extends Value> implements Opcodes {
    public MockAnalyzer(Interpreter<V> interpreter) {
        this.interpreter = interpreter;
    }
}
```

### methods

第四个部分，`MockAnalyzer`类定义的方法有哪些。

```java
public class MockAnalyzer<V extends Value> implements Opcodes {
    public Frame<V>[] analyze(String owner, MethodNode method) throws AnalyzerException {
        // 第一步，如果是abstract或native方法，则直接返回。
        if ((method.access & (ACC_ABSTRACT | ACC_NATIVE)) != 0) {
            return (Frame<V>[]) new Frame<?>[0];
        }

        // 第二步，定义局部变量
        // （1）数据输入：获取指令集
        InsnList insnList = method.instructions;
        int size = insnList.size();

        // （2）中间状态：记录需要哪一个指令需要处理
        boolean[] instructionsToProcess = new boolean[size];

        // （3）数据输出：最终的返回结果
        Frame<V>[] frames = (Frame<V>[]) new Frame<?>[size];

        // 第三步，开始计算
        // （1）开始计算：根据方法的参数，计算方法的初始Frame
        Frame<V> currentFrame = computeInitialFrame(owner, method);
        merge(frames, 0, currentFrame, instructionsToProcess);

        // （2）开始计算：根据方法的每一条指令，计算相应的Frame
        while (getCount(instructionsToProcess) > 0) {
            // 获取需要处理的指令索引（insnIndex）和旧的Frame（oldFrame）
            int insnIndex = getFirst(instructionsToProcess);
            Frame<V> oldFrame = frames[insnIndex];
            instructionsToProcess[insnIndex] = false;

            // 模拟每一条指令的执行
            try {
                AbstractInsnNode insnNode = method.instructions.get(insnIndex);
                int insnOpcode = insnNode.getOpcode();
                int insnType = insnNode.getType();

                // 这三者并不是真正的指令，分别表示Label、LineNumberTable和Frame
                if (insnType == AbstractInsnNode.LABEL
                        || insnType == AbstractInsnNode.LINE
                        || insnType == AbstractInsnNode.FRAME) {
                    merge(frames, insnIndex + 1, oldFrame, instructionsToProcess);
                }
                else {
                    // 这里是真正的指令
                    currentFrame.init(oldFrame).execute(insnNode, interpreter);

                    if (insnNode instanceof JumpInsnNode) {
                        JumpInsnNode jumpInsn = (JumpInsnNode) insnNode;
                        // if之后的语句
                        if (insnOpcode != GOTO) {
                            merge(frames, insnIndex + 1, currentFrame, instructionsToProcess);
                        }

                        // if和goto跳转之后的位置
                        int jumpInsnIndex = insnList.indexOf(jumpInsn.label);
                        merge(frames, jumpInsnIndex, currentFrame, instructionsToProcess);
                    }
                    else if (insnNode instanceof LookupSwitchInsnNode) {
                        LookupSwitchInsnNode lookupSwitchInsn = (LookupSwitchInsnNode) insnNode;

                        // lookupswitch的default情况
                        int targetInsnIndex = insnList.indexOf(lookupSwitchInsn.dflt);
                        merge(frames, targetInsnIndex, currentFrame, instructionsToProcess);

                        // lookupswitch的各种case情况
                        for (int i = 0; i < lookupSwitchInsn.labels.size(); ++i) {
                            LabelNode label = lookupSwitchInsn.labels.get(i);
                            targetInsnIndex = insnList.indexOf(label);
                            merge(frames, targetInsnIndex, currentFrame, instructionsToProcess);
                        }
                    }
                    else if (insnNode instanceof TableSwitchInsnNode) {
                        TableSwitchInsnNode tableSwitchInsn = (TableSwitchInsnNode) insnNode;

                        // tableswitch的default情况
                        int targetInsnIndex = insnList.indexOf(tableSwitchInsn.dflt);
                        merge(frames, targetInsnIndex, currentFrame, instructionsToProcess);

                        // tableswitch的各种case情况
                        for (int i = 0; i < tableSwitchInsn.labels.size(); ++i) {
                            LabelNode label = tableSwitchInsn.labels.get(i);
                            targetInsnIndex = insnList.indexOf(label);
                            merge(frames, targetInsnIndex, currentFrame, instructionsToProcess);
                        }
                    }
                    else if (insnOpcode != ATHROW && (insnOpcode < IRETURN || insnOpcode > RETURN)) {
                        merge(frames, insnIndex + 1, currentFrame, instructionsToProcess);
                    }
                }
            }
            catch (AnalyzerException e) {
                throw new AnalyzerException(e.node, "Error at instruction " + insnIndex + ": " + e.getMessage(), e);
            }
        }

        return frames;
    }

    private int getCount(boolean[] array) {
        int count = 0;
        for (boolean flag : array) {
            if (flag) {
                count++;
            }
        }
        return count;
    }

    private int getFirst(boolean[] array) {
        int length = array.length;
        for (int i = 0; i < length; i++) {
            boolean flag = array[i];
            if (flag) {
                return i;
            }
        }
        return -1;
    }

    private Frame<V> computeInitialFrame(final String owner, final MethodNode method) {
        Frame<V> frame = new Frame<>(method.maxLocals, method.maxStack);
        int currentLocal = 0;

        // 第一步，判断是否需要存储this变量
        boolean isInstanceMethod = (method.access & ACC_STATIC) == 0;
        if (isInstanceMethod) {
            Type ownerType = Type.getObjectType(owner);
            V value = interpreter.newParameterValue(isInstanceMethod, currentLocal, ownerType);
            frame.setLocal(currentLocal, value);
            currentLocal++;
        }

        // 第二步，将方法的参数存入到local variable内
        Type[] argumentTypes = Type.getArgumentTypes(method.desc);
        for (Type argumentType : argumentTypes) {
            V value = interpreter.newParameterValue(isInstanceMethod, currentLocal, argumentType);
            frame.setLocal(currentLocal, value);
            currentLocal++;
            if (argumentType.getSize() == 2) {
                frame.setLocal(currentLocal, interpreter.newEmptyValue(currentLocal));
                currentLocal++;
            }
        }

        // 第三步，将local variable的剩余位置填补上空值
        while (currentLocal < method.maxLocals) {
            frame.setLocal(currentLocal, interpreter.newEmptyValue(currentLocal));
            currentLocal++;
        }

        // 第四步，设置返回值类型
        frame.setReturn(interpreter.newReturnTypeValue(Type.getReturnType(method.desc)));
        return frame;
    }

    /**
     * Merge old frame with new frame.
     *
     * @param frames 所有的frame信息。
     * @param insnIndex 当前指令的索引。
     * @param newFrame 新的frame
     * @param instructionsToProcess 记录哪一条指令需要处理
     * @throws AnalyzerException 分析错误，抛出此异常
     */
    private void merge(Frame<V>[] frames, int insnIndex, Frame<V> newFrame, boolean[] instructionsToProcess) throws AnalyzerException {
        boolean changed;
        Frame<V> oldFrame = frames[insnIndex];
        if (oldFrame == null) {
            frames[insnIndex] = new Frame<>(newFrame);
            changed = true;
        }
        else {
            changed = oldFrame.merge(newFrame, interpreter);
        }

        if (changed && !instructionsToProcess[insnIndex]) {
            instructionsToProcess[insnIndex] = true;
        }
    }
}
```

```java
public class MockAnalyzer<V extends Value> implements Opcodes {
}
```

```java
public class HelloWorld {
    public void test(int a, int b) {
        Object obj;
        int c = a + b;

        if (c > 10) {
            obj = Integer.valueOf(20);
        }
        else {
            obj = Float.valueOf(5);
        }
    }
}
```
