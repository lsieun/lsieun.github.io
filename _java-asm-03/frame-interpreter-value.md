---
title:  "Frame/Interpreter/Value"
sequence: "402"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

在本文当中，我们介绍`Frame`、`Interpreter`和`Value`三个类。

## Frame类

从源码的角度来讲，`Frame`是一个泛型类，它的定义如下：

```java
public class Frame<V extends Value> {
    //...
}
```

为了方便理解，我们可以暂时忽略掉它的泛型信息。也就是说，我们将泛型`V`直接替换成`Value`类型。这里的思路就是将`Frame`类和`Value`类分开，分而治之，逐步理解。

### class info

第一个部分，`Frame`类继承自`Object`类。

```java
public class Frame {
}
```

### fields

第二个部分，`Frame`类定义的字段有哪些。其中，

- `returnValue`和`values`字段分别对应于方法的“返回值”和“方法参数”。
  - 其实，`values`字段，除了包含“方法参数”，它更确切的可以理解为local variable和operand stack拼接之后的结果。
- `numLocals`字段表示local variable的大小，而`numStack`字段当前operand stack上有多少个元素。

```java
public class Frame {
    private Value returnValue;
    private Value[] values;

    private int numLocals;
    private int numStack;
}
```

### constructors

第三个部分，`Frame`类定义的构造方法有哪些。

在`Frame`当中，一共定义了两个构造方法。先来看第一个构造方法，用来创建一个全新的`Frame`对象：

- 方法参数：`int numLocals`和`int numStack`分别表示local variable和operand stack的大小。
- 方法体：
  - 初始化`values`数组的大小。
  - 记录`numLocals`字段的值。
  - 另外，注意没有给`numStack`赋值，其初始值则为`0`，表示在刚进入方法的时候，operand stack上没有任何元素。

```java
public class Frame {
    public Frame(int numLocals, int numStack) {
        this.values = new Value[numLocals + numStack];
        this.numLocals = numLocals;
        // 注意，这里并没有对numStack字段进行赋值。
    }
}
```

第二个构造方法，是对已有的frame进行复制：

- 方法参数：接收一个`Frame`类型的参数
- 方法体：
  - 调用`this(int,int)`构造方法，来初始化`values`字段和`numLocals`字段。
  - 调用`init(Frame)`方法，为`values`数组中元素赋值，并为`numStack`字段赋值。

```java
public class Frame {
    public Frame(Frame frame) {
        this(frame.numLocals, frame.values.length - frame.numLocals);
        init(frame);
    }

    public Frame init(Frame frame) {
        returnValue = frame.returnValue;
        System.arraycopy(frame.values, 0, values, 0, values.length);
        numStack = frame.numStack;
        return this;
    }
}
```

### methods

第四个部分，`Frame`类定义的方法有哪些。

#### locals

下面这些方法是与local variable相关的方法：

- `getLocals()`方法：获取local variable的大小
- `getLocal(int)`方法：获取local variable当中某一个元素的值。
- `setLocal(int, Value)`方法：给local variable当中的某一个元素进行赋值。

```java
public class Frame {
    public int getLocals() {
        return numLocals;
    }

    public Value getLocal(int index) {
        if (index >= numLocals) {
            throw new IndexOutOfBoundsException("Trying to get an inexistant local variable " + index);
        }
        return values[index];
    }

    public void setLocal(int index, Value value) {
        if (index >= numLocals) {
            throw new IndexOutOfBoundsException("Trying to set an inexistant local variable " + index);
        }
        values[index] = value;
    }
}
```

#### stack

下面这些方法是与operand stack相关的方法：

- `getMaxStackSize()`方法：获取operand stack的总大小。
- `getStackSize()`方法：获取operand stack的当前大小。
- `clearStack()`方法：将operand stack的当前大小设置为`0`值。
- `getStack(int)`方法：获取operand stack的某一个元素。
- `setStack(int, Value)`方法：设置operand stack的某一个元素。
- `pop()`方法：将operand stack最上面的元素进行出栈。
- `push(Value)`方法：将某一个元素压进operand stack当中。

```java
public class Frame {
    public int getMaxStackSize() {
        return values.length - numLocals;
    }

    public int getStackSize() {
        return numStack;
    }

    public void clearStack() {
        numStack = 0;
    }

    public Value getStack(int index) {
        return values[numLocals + index];
    }

    public void setStack(int index, Value value) {
        values[numLocals + index] = value;
    }

    public Value pop() {
        if (numStack == 0) {
            throw new IndexOutOfBoundsException("Cannot pop operand off an empty stack.");
        }
        return values[numLocals + (--numStack)];
    }

    public void push(Value value) {
        if (numLocals + numStack >= values.length) {
            throw new IndexOutOfBoundsException("Insufficient maximum stack size.");
        }
        values[numLocals + (numStack++)] = value;
    }
}
```

#### execute

下面的`execute(AbstractInsnNode, Interpreter)`方法，是模拟某一条instruction对local variable和operand stack的影响。针对某一个具体的instruction，它具体有什么样的操作，可以参考[Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)。

同时，我们也要注意到`execute`方法也会用到`Interpreter`类，那么`Interpreter`类起到一个什么样的作用呢？`Interpreter`类，就是使用当前的指令（`insn`）和相关参数（`value1`、`value2`、`value3`、`value4`）计算出一个新的值。

```java
public class Frame {
    public void execute(AbstractInsnNode insn, Interpreter interpreter) throws AnalyzerException {
        Value value1;
        Value value2;
        Value value3;
        Value value4;
        int var;

        switch (insn.getOpcode()) {
            case Opcodes.NOP:
                break;
            case Opcodes.ACONST_NULL:
            case Opcodes.ICONST_M1:
            case Opcodes.ICONST_0:
            case Opcodes.ICONST_1:
            case Opcodes.ICONST_2:
            case Opcodes.ICONST_3:
            case Opcodes.ICONST_4:
            case Opcodes.ICONST_5:
            case Opcodes.LCONST_0:
            case Opcodes.LCONST_1:
            case Opcodes.FCONST_0:
            case Opcodes.FCONST_1:
            case Opcodes.FCONST_2:
            case Opcodes.DCONST_0:
            case Opcodes.DCONST_1:
            case Opcodes.BIPUSH:
            case Opcodes.SIPUSH:
            case Opcodes.LDC:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.ILOAD:
            case Opcodes.LLOAD:
            case Opcodes.FLOAD:
            case Opcodes.DLOAD:
            case Opcodes.ALOAD:
                push(interpreter.copyOperation(insn, getLocal(((VarInsnNode) insn).var)));
                break;
            case Opcodes.ISTORE:
            case Opcodes.LSTORE:
            case Opcodes.FSTORE:
            case Opcodes.DSTORE:
            case Opcodes.ASTORE:
                value1 = interpreter.copyOperation(insn, pop());
                var = ((VarInsnNode) insn).var;
                setLocal(var, value1);
                if (value1.getSize() == 2) {
                    setLocal(var + 1, interpreter.newEmptyValue(var + 1));
                }
                if (var > 0) {
                    Value local = getLocal(var - 1);
                    if (local != null && local.getSize() == 2) {
                        setLocal(var - 1, interpreter.newEmptyValue(var - 1));
                    }
                }
                break;
            case Opcodes.IASTORE:
            case Opcodes.LASTORE:
            case Opcodes.FASTORE:
            case Opcodes.DASTORE:
            case Opcodes.AASTORE:
            case Opcodes.BASTORE:
            case Opcodes.CASTORE:
            case Opcodes.SASTORE:
                value3 = pop();
                value2 = pop();
                value1 = pop();
                interpreter.ternaryOperation(insn, value1, value2, value3);
                break;
            case Opcodes.POP:
                if (pop().getSize() == 2) {
                    throw new AnalyzerException(insn, "Illegal use of POP");
                }
                break;
            case Opcodes.POP2:
                if (pop().getSize() == 1 && pop().getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of POP2");
                }
                break;
            case Opcodes.DUP:
                value1 = pop();
                if (value1.getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of DUP");
                }
                push(value1);
                push(interpreter.copyOperation(insn, value1));
                break;
            case Opcodes.DUP_X1:
                value1 = pop();
                value2 = pop();
                if (value1.getSize() != 1 || value2.getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of DUP_X1");
                }
                push(interpreter.copyOperation(insn, value1));
                push(value2);
                push(value1);
                break;
            case Opcodes.DUP_X2:
                value1 = pop();
                if (value1.getSize() == 1 && executeDupX2(insn, value1, interpreter)) {
                    break;
                }
                throw new AnalyzerException(insn, "Illegal use of DUP_X2");
            case Opcodes.DUP2:
                value1 = pop();
                if (value1.getSize() == 1) {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        push(value2);
                        push(value1);
                        push(interpreter.copyOperation(insn, value2));
                        push(interpreter.copyOperation(insn, value1));
                        break;
                    }
                } else {
                    push(value1);
                    push(interpreter.copyOperation(insn, value1));
                    break;
                }
                throw new AnalyzerException(insn, "Illegal use of DUP2");
            case Opcodes.DUP2_X1:
                value1 = pop();
                if (value1.getSize() == 1) {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        value3 = pop();
                        if (value3.getSize() == 1) {
                            push(interpreter.copyOperation(insn, value2));
                            push(interpreter.copyOperation(insn, value1));
                            push(value3);
                            push(value2);
                            push(value1);
                            break;
                        }
                    }
                } else {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        push(interpreter.copyOperation(insn, value1));
                        push(value2);
                        push(value1);
                        break;
                    }
                }
                throw new AnalyzerException(insn, "Illegal use of DUP2_X1");
            case Opcodes.DUP2_X2:
                value1 = pop();
                if (value1.getSize() == 1) {
                    value2 = pop();
                    if (value2.getSize() == 1) {
                        value3 = pop();
                        if (value3.getSize() == 1) {
                            value4 = pop();
                            if (value4.getSize() == 1) {
                                push(interpreter.copyOperation(insn, value2));
                                push(interpreter.copyOperation(insn, value1));
                                push(value4);
                                push(value3);
                                push(value2);
                                push(value1);
                                break;
                            }
                        } else {
                            push(interpreter.copyOperation(insn, value2));
                            push(interpreter.copyOperation(insn, value1));
                            push(value3);
                            push(value2);
                            push(value1);
                            break;
                        }
                    }
                } else if (executeDupX2(insn, value1, interpreter)) {
                    break;
                }
                throw new AnalyzerException(insn, "Illegal use of DUP2_X2");
            case Opcodes.SWAP:
                value2 = pop();
                value1 = pop();
                if (value1.getSize() != 1 || value2.getSize() != 1) {
                    throw new AnalyzerException(insn, "Illegal use of SWAP");
                }
                push(interpreter.copyOperation(insn, value2));
                push(interpreter.copyOperation(insn, value1));
                break;
            case Opcodes.IALOAD:
            case Opcodes.LALOAD:
            case Opcodes.FALOAD:
            case Opcodes.DALOAD:
            case Opcodes.AALOAD:
            case Opcodes.BALOAD:
            case Opcodes.CALOAD:
            case Opcodes.SALOAD:
            case Opcodes.IADD:
            case Opcodes.LADD:
            case Opcodes.FADD:
            case Opcodes.DADD:
            case Opcodes.ISUB:
            case Opcodes.LSUB:
            case Opcodes.FSUB:
            case Opcodes.DSUB:
            case Opcodes.IMUL:
            case Opcodes.LMUL:
            case Opcodes.FMUL:
            case Opcodes.DMUL:
            case Opcodes.IDIV:
            case Opcodes.LDIV:
            case Opcodes.FDIV:
            case Opcodes.DDIV:
            case Opcodes.IREM:
            case Opcodes.LREM:
            case Opcodes.FREM:
            case Opcodes.DREM:
            case Opcodes.ISHL:
            case Opcodes.LSHL:
            case Opcodes.ISHR:
            case Opcodes.LSHR:
            case Opcodes.IUSHR:
            case Opcodes.LUSHR:
            case Opcodes.IAND:
            case Opcodes.LAND:
            case Opcodes.IOR:
            case Opcodes.LOR:
            case Opcodes.IXOR:
            case Opcodes.LXOR:
            case Opcodes.LCMP:
            case Opcodes.FCMPL:
            case Opcodes.FCMPG:
            case Opcodes.DCMPL:
            case Opcodes.DCMPG:
                value2 = pop();
                value1 = pop();
                push(interpreter.binaryOperation(insn, value1, value2));
                break;
            case Opcodes.INEG:
            case Opcodes.LNEG:
            case Opcodes.FNEG:
            case Opcodes.DNEG:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.IINC:
                var = ((IincInsnNode) insn).var;
                setLocal(var, interpreter.unaryOperation(insn, getLocal(var)));
                break;
            case Opcodes.I2L:
            case Opcodes.I2F:
            case Opcodes.I2D:
            case Opcodes.L2I:
            case Opcodes.L2F:
            case Opcodes.L2D:
            case Opcodes.F2I:
            case Opcodes.F2L:
            case Opcodes.F2D:
            case Opcodes.D2I:
            case Opcodes.D2L:
            case Opcodes.D2F:
            case Opcodes.I2B:
            case Opcodes.I2C:
            case Opcodes.I2S:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.IFEQ:
            case Opcodes.IFNE:
            case Opcodes.IFLT:
            case Opcodes.IFGE:
            case Opcodes.IFGT:
            case Opcodes.IFLE:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.IF_ICMPEQ:
            case Opcodes.IF_ICMPNE:
            case Opcodes.IF_ICMPLT:
            case Opcodes.IF_ICMPGE:
            case Opcodes.IF_ICMPGT:
            case Opcodes.IF_ICMPLE:
            case Opcodes.IF_ACMPEQ:
            case Opcodes.IF_ACMPNE:
            case Opcodes.PUTFIELD:
                value2 = pop();
                value1 = pop();
                interpreter.binaryOperation(insn, value1, value2);
                break;
            case Opcodes.GOTO:
                break;
            case Opcodes.JSR:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.RET:
                break;
            case Opcodes.TABLESWITCH:
            case Opcodes.LOOKUPSWITCH:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.IRETURN:
            case Opcodes.LRETURN:
            case Opcodes.FRETURN:
            case Opcodes.DRETURN:
            case Opcodes.ARETURN:
                value1 = pop();
                interpreter.unaryOperation(insn, value1);
                interpreter.returnOperation(insn, value1, returnValue);
                break;
            case Opcodes.RETURN:
                if (returnValue != null) {
                    throw new AnalyzerException(insn, "Incompatible return type");
                }
                break;
            case Opcodes.GETSTATIC:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.PUTSTATIC:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.GETFIELD:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.INVOKEVIRTUAL:
            case Opcodes.INVOKESPECIAL:
            case Opcodes.INVOKESTATIC:
            case Opcodes.INVOKEINTERFACE:
                executeInvokeInsn(insn, ((MethodInsnNode) insn).desc, interpreter);
                break;
            case Opcodes.INVOKEDYNAMIC:
                executeInvokeInsn(insn, ((InvokeDynamicInsnNode) insn).desc, interpreter);
                break;
            case Opcodes.NEW:
                push(interpreter.newOperation(insn));
                break;
            case Opcodes.NEWARRAY:
            case Opcodes.ANEWARRAY:
            case Opcodes.ARRAYLENGTH:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.ATHROW:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.CHECKCAST:
            case Opcodes.INSTANCEOF:
                push(interpreter.unaryOperation(insn, pop()));
                break;
            case Opcodes.MONITORENTER:
            case Opcodes.MONITOREXIT:
                interpreter.unaryOperation(insn, pop());
                break;
            case Opcodes.MULTIANEWARRAY:
                List<Value> valueList = new ArrayList<>();
                for (int i = ((MultiANewArrayInsnNode) insn).dims; i > 0; --i) {
                    valueList.add(0, pop());
                }
                push(interpreter.naryOperation(insn, valueList));
                break;
            case Opcodes.IFNULL:
            case Opcodes.IFNONNULL:
                interpreter.unaryOperation(insn, pop());
                break;
            default:
                throw new AnalyzerException(insn, "Illegal opcode " + insn.getOpcode());
        }
    }
}
```

## Interpreter类

与`Frame`类似，`Interpreter`也是一个泛型类，我们也可以将泛型`V`替换成`Value`值，以简化思考。

### class info

第一个部分，`Interpreter`类是一个抽象类，它继承自`Object`类。

```java
public abstract class Interpreter {
}
```

### fields

第二个部分，`Interpreter`类定义的字段有哪些。

```java
public abstract class Interpreter {
    protected final int api;
}
```

### constructors

第三个部分，`Interpreter`类定义的构造方法有哪些。

```java
public abstract class Interpreter {
    protected Interpreter(int api) {
        this.api = api;
    }
}
```

### methods

第四个部分，`Interpreter`类定义的方法有哪些。

#### newValue

如果我们仔细观察下面几个方法，会发现它们的本质是同一个方法，即`Value newValue(Type)`方法：该方法是将ASM当中的类型向Frame当中的类型进行映射。

| 领域 | ClassFile | ASM | Frame(local variable+operand stack) |
|-----|-----------|-----|-------------------------------------|
| 类型 | Internal Name/Descriptor | Type | Value |
| 示例 | `Ljava/lang/String;` | `Type t = Type.getObjectType("java/lang/String");` | `BasicValue val = BasicValue.INT_VALUE;` |

那么，我们要将`Type`类型转换成`Value`类型呢？因为我们使用ASM编写代码，遇到的类型就是`Type`类型，接下来要做的就是模拟instruction执行过程中对local variable和operand stack的影响，因此需要将`Type`类型转换成`Value`类型。

举个例子，现在你持有中国的货币，接下来你想投资美国的市场，那么需要先将中国的货币兑换成美国的货币，然后才能去投资。

具体来说，这几个方法的用途：

- `newParameterValue()`方法：在方法头中，对“方法接收的参数类型”进行转换。
- `newReturnTypeValue()`方法：在方法头中，对“方法的返回值类型”进行转换。
- `newExceptionValue()`方法：在方法体中，执行的时候，可能会出现异常，这里就是对“异常的类型”进行转换。
- `newEmptyValue()`方法：将local variable当中某个位置设置成空值。
- 在`BasicInterpreter`类当中的`newOperation()`方法：
  - `ACONST_NULL`指令：`newValue(NULL_TYPE);`
  - `LDC`指令：`newValue(Type.getObjectType("java/lang/String"))`
  - `GETSTATIC`指令：`newValue(Type.getType(((FieldInsnNode) insn).desc))`
  - `NEW`指令：`newValue(Type.getObjectType(((TypeInsnNode) insn).desc))`
- ...（省略）

在local variable当中，为什么会有空值的出现呢？有两种情况：

- 第一种情况，假如local variable的总大小是10，而方法的接收参数只占前3个位置，那么剩下的7个位置的初始值就是空值。
- 第二种情况，在local variable当中，`long`和`double`类型占用2个位置，在进行模拟的时候，第1个位置就记录了`long`和`double`类型，第2个位置就用空值来表示。

```java
public abstract class Interpreter {
    public abstract Value newValue(Type type);

    public Value newParameterValue(boolean isInstanceMethod, int local, Type type) {
        return newValue(type);
    }

    public Value newReturnTypeValue(Type type) {
        return newValue(type);
    }

    public Value newExceptionValue(
            TryCatchBlockNode tryCatchBlockNode,
            Frame handlerFrame,
            Type exceptionType) {
        return newValue(exceptionType);
    }
    
    public Value newEmptyValue(int local) {
        return newValue(null);
    }
}
```

#### opcode

下面几个方法，就是结合指令（`AbstractInsnNode`类型）和多个元素值（`Value`类型）来计算出一个新的元素值（`Value`类型）。

注意：在这里，我们用操作数（operand）和元素（element）表示不同的概念。

- `AbstractInsnNode`类型，是指instruction，包含opcode和operand；这里的operand，体现为具体`AbstractInsnNode`类型的字段值。
- 元素值（`Value`类型），是指local variable和operand stack上某一个元素（element）的值。

```text
instruction = opcode + operand
```

具体来说，这几个方法的作用：

- `newOperation()`方法：处理opcode和0个元素值（`Value`类型）之间的关系，这是一步从`0`到`1`的操作。
- `copyOperation()`方法：处理opcode和1个元素值（`Value`类型）之间的关系，这是一步从`1`到`1`的操作。copy是“复制”，一个`int`类型的值，复制一份之后，仍然是`int`类型的值。
- `unaryOperation()`方法：处理opcode和1个元素值（`Value`类型）之间的关系，这是一步从`1`到`1`的操作。一个`int`类型的值，经过`i2f`指令运算，就会变成`float`类型的值。
- `binaryOperation()`方法：处理opcode和2个元素值（`Value`类型）之间的关系，这是一步从`2`到`1`的操作。
- `ternaryOperation()`方法：处理opcode和3个元素值（`Value`类型）之间的关系，这是一步从`3`到`1`的操作。
- `naryOperation()`方法：处理opcode和n个元素值（`Value`类型）之间的关系，这是一步从`n`到`1`的操作。
- `returnOperation()`方法：处理return的期望类型和实际类型之间的关系，这是一步从`2`到`0`的操作。

为什么有这些方法呢？因为opcode有200个左右，如果一个类里面定义200个方法，记忆起来就不太方便了。那么，如果按照“消耗”的元素值（`Value`类型）的数量多少，分成7个不同的方法，这就大大简化了方法的整体数量。

```java
public abstract class Interpreter {
    public abstract Value newOperation(AbstractInsnNode insn) throws AnalyzerException;

    public abstract Value copyOperation(AbstractInsnNode insn, Value value) throws AnalyzerException;

    public abstract Value unaryOperation(AbstractInsnNode insn, Value value) throws AnalyzerException;

    public abstract Value binaryOperation(AbstractInsnNode insn, Value value1, Value value2) throws AnalyzerException;

    public abstract Value ternaryOperation(AbstractInsnNode insn, Value value1, Value value2, Value value3) throws AnalyzerException;

    public abstract Value naryOperation(AbstractInsnNode insn, List<Value> values) throws AnalyzerException;

    public abstract void returnOperation(AbstractInsnNode insn, Value value, Value expected) throws AnalyzerException;
}
```

#### merge

这里是`merge`方法，它的作用是将两个`Value`值合并为一个新的`Value`值。

```java
public abstract class Interpreter {
    public abstract Value merge(Value value1, Value value2);
}
```

那么，为什么需要将两个`Value`值合并为一个新的`Value`值呢？我们举个例子：

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

我们可以查看instruction对应的local variable和operand stack的变化：

```text
test:(II)V
                               // {this, int, int} | {}
0000: iload_1                  // {this, int, int} | {int}
0001: iload_2                  // {this, int, int} | {int, int}
0002: iadd                     // {this, int, int} | {int}
0003: istore          4        // {this, int, int, top, int} | {}
0005: iload           4        // {this, int, int, top, int} | {int}
0007: bipush          10       // {this, int, int, top, int} | {int, int}
0009: if_icmple       12       // {this, int, int, top, int} | {}
0012: bipush          20       // {this, int, int, top, int} | {int}
0014: invokestatic    #2       // {this, int, int, top, int} | {Integer}
0017: astore_3                 // {this, int, int, Integer, int} | {}
0018: goto            9        // {} | {}
                               // {this, int, int, top, int} | {}
0021: ldc             #3       // {this, int, int, top, int} | {float}
0023: invokestatic    #4       // {this, int, int, top, int} | {Float}
0026: astore_3                 // {this, int, int, Float, int} | {}
                               // {this, int, int, Object, int} | {}
0027: return                   // {} | {}
```

在local variable当中，在`(offset=17, local=3)`的位置是`Integer`类型，在`(offset=26, local=3)`的位置是`Float`类型，它们merge之后是`Object`类型。

## Value类

现在我们来看`Value`，它是一个接口，定义了一个`getSize()`方法。

```java
public interface Value {
    int getSize();
}
```

那么，`Frame`、`Interpreter`和`Value`三者之间的关系：

- `Frame`类，会使用到`Value`和`Interpreter`类。
- `Interpreter`类，会使用到`Value`类。

## 总结

本文内容总结如下：

- 第一点，`Frame`类的主要作用是记录local variable和operand stack的状态，其中操作的数据是`Value`类型。
  - `Frame`类包含两部分：不变的部分和变化的部分。
  - `Frame`类的核心功能，体现在`execute`方法上，不管`Value`类型具体呈现什么样的值，该方法的逻辑是不变的，这就是不变的部分。
  - `Frame`类的变化部分，体现在`Value`类型上，它可以呈现不同类型的值，从而丰富`Frame`的功能。
- 第二点，`Value`是一个接口，它是`Frame`当中存储的数据；它可以有许多具体的子类，或者创建更多的子类对象。
- 第三点，`Interpreter`类的作用就像一个`Value`加工厂，它可以将多个`Value`类型合并成一个新的`Value`类型。正是`Interpreter`类的存在，它可以实现`Value`类型转换的多样性。
