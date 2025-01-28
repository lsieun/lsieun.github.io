---
title: "BasicValue-BasicInterpreter"
sequence: "404"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在本章内容当中，最核心的内容就是下面两行代码。这两行代码包含了`asm-analysis.jar`当中`Analyzer`、`Frame`、`Interpreter`和`Value`最重要的四个类：

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

在本文当中，我们将介绍`BasicInterpreter`和`BasicValue`类：

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

## BasicValue

### class info

第一个部分，`BasicValue`类实现了`Value`接口。

```java
public class BasicValue implements Value {
}
```

### fields

第二个部分，`BasicValue`类定义的字段有哪些。

```java
public class BasicValue implements Value {
    private final Type type;

    public Type getType() {
        return type;
    }
}
```

通过以下三点来理解`BasicValue`和`Type`之间的关系：

- 第一点，`BasicValue`是`asm-analysis.jar`当中定义的类，是local variable和operand stack当中存储的数据类型。
- 第二点，`Type`是`asm.jar`当中定义的类，它是对具体的`.class`文件当中的Internal Name和Descriptor的一种ASM表示方式。
- 第三点，`BasicValue`类就是对`Type`类的封装。

| 领域 | ClassFile | ASM | Frame(local variable+operand stack) |
|-----|-----------|-----|-------------------------------------|
| 类型 | Internal Name/Descriptor | Type | Value |
| 示例 | `Ljava/lang/String;` | `Type t = Type.getObjectType("java/lang/String");` | `BasicValue val = BasicValue.INT_VALUE;` |


```text
  ┌─────────────────────────────┐     |        ┌──────────────────────────────────────────────┐
  │          asm.jar            │     |        │            asm-analysis.jar                  │
  │  ClassReader   Type         │     |        │                                              │
  │  ClassVisitor  ClassWriter  │     |        │  Value Interpreter Frame Analyzer            │
  └─────────────────────────────┘     |        └──────────────────────────────────────────────┘
---------------------------------------------------------------------------------------------------
                                      |    ┌──────────────────────────────────────────────────────┐
                                      |    │     operand stack                                    │
    ┌────────────────────────┐        |    │    ┌──────────────┐              JVM                 │
    │     Internal Name      │        |    │    ├──────────────┤           Stack Frame            │
    │       Descriptor       │        |    │    ├──────────────┤                                  │
    │                        │        |    │    ├──────────────┤                                  │
    │        .class          │        |    │    ├──────────────┤                                  │
    │       ClassFile        │        |    │    ├──────────────┤         local variable           │
    │                        │        |    │    ├──────────────┤     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐     │
    └────────────────────────┘        |    │    └──────────────┘     └──┘ └──┘ └──┘ └──┘ └──┘     │
                                      |    │                           0    1    2    3    4      │
                                      |    └──────────────────────────────────────────────────────┘
```


### constructors

第三个部分，`BasicValue`类定义的构造方法有哪些。

```java
public class BasicValue implements Value {
    public BasicValue(Type type) {
        this.type = type;
    }
}
```

### methods

第四个部分，`BasicValue`类定义的方法有哪些。

```java
public class BasicValue implements Value {
    @Override
    public int getSize() {
        return type == Type.LONG_TYPE || type == Type.DOUBLE_TYPE ? 2 : 1;
    }

    public boolean isReference() {
        return type != null && (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY);
    }

    @Override
    public String toString() {
        if (this == UNINITIALIZED_VALUE) {
            return ".";
        } else if (this == RETURNADDRESS_VALUE) {
            return "A";
        } else if (this == REFERENCE_VALUE) {
            return "R";
        } else {
            return type.getDescriptor();
        }
    }
}
```

### static fields

在`BasicValue`类当中，定义了7个静态字段：

- `UNINITIALIZED_VALUE` means "all possible values".
- `INT_VALUE` means "all int, short, byte, boolean or char values".
- `FLOAT_VALUE` means "all float values".
- `LONG_VALUE` means "all long values".
- `DOUBLE_VALUE` means "all double values".
- `REFERENCE_VALUE` means "all object and array values".
- `RETURNADDRESS_VALUE` is used for subroutines.

```java
public class BasicValue implements Value {
    public static final BasicValue UNINITIALIZED_VALUE = new BasicValue(null);
    
    public static final BasicValue INT_VALUE = new BasicValue(Type.INT_TYPE);
    public static final BasicValue FLOAT_VALUE = new BasicValue(Type.FLOAT_TYPE);
    public static final BasicValue LONG_VALUE = new BasicValue(Type.LONG_TYPE);
    public static final BasicValue DOUBLE_VALUE = new BasicValue(Type.DOUBLE_TYPE);

    public static final BasicValue REFERENCE_VALUE = new BasicValue(Type.getObjectType("java/lang/Object"));
    public static final BasicValue RETURNADDRESS_VALUE = new BasicValue(Type.VOID_TYPE);
}
```

在这里，我们要注意：虽然`BasicValue`类定义了这7个静态字段，但是并不是表示说`BasicValue`只能有这7个字段的值，它还可以创建许许多的对象实例。为什么我们要说这样一件事情呢？因为在刚开始，我们会经常用到这7个静态字段的值，很容易误导我们，让我们觉得只有这7个静态字段的值。实际上，只有`BasicInterpreter`和`BasicVerifier`两个类完全限定于使用这7个静态字段，而`SimpleVerifier`就会创建许许多的`BasicValue`对象。

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

用一个比喻来加深印象。`BasicInterpreter`和`BasicVerifier`两个类就像两个小孩儿，他们只会7个单词，说的所有的话都是由这7个单词组成；而`SimpleVerifier`就像是一个词汇量丰富的初中学生，可以描述事物的具体细节。

## BasicInterpreter

The `BasicInterpreter` class is one of the predefined subclass of the `Interpreter` abstract class.
It simulates the effect of bytecode instructions by using seven sets of values, defined in the `BasicValue` class.

### class info

第一个部分，`BasicInterpreter`类继承自`Interpreter<BasicValue>`类。

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
}
```

### fields

第二个部分，`BasicInterpreter`类定义的字段有哪些。

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
    public static final Type NULL_TYPE = Type.getObjectType("null");
}
```

### constructors

第三个部分，`BasicInterpreter`类定义的构造方法有哪些。

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
    public BasicInterpreter() {
        super(ASM9);
        if (getClass() != BasicInterpreter.class) {
            throw new IllegalStateException();
        }
    }

    protected BasicInterpreter(int api) {
        super(api);
    }
}
```

### methods

第四个部分，`BasicInterpreter`类定义的方法有哪些。下面这几个方法都是对`Interpreter`定义的方法进行重写。

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
    @Override
    public BasicValue newValue(Type type) {
        // 返回BasicValue定义的7个静态字段之一
    }

    @Override
    public BasicValue newOperation(AbstractInsnNode insn) throws AnalyzerException {
        // 返回BasicValue定义的7个静态字段之一
    }

    @Override
    public BasicValue copyOperation(AbstractInsnNode insn, BasicValue value) throws AnalyzerException {
        return value;
    }

    public BasicValue unaryOperation(AbstractInsnNode insn, BasicValue value) throws AnalyzerException {
        // 返回BasicValue定义的7个静态字段之一
    }

    public BasicValue binaryOperation(AbstractInsnNode insn, BasicValue value1, BasicValue value2) throws AnalyzerException {
        // 返回BasicValue定义的7个静态字段之一
    }

    @Override
    public BasicValue ternaryOperation(AbstractInsnNode insn, BasicValue value1, BasicValue value2, BasicValue value3) throws AnalyzerException {
        return null;
    }

    @Override
    public BasicValue naryOperation(AbstractInsnNode insn, List<? extends BasicValue> values) throws AnalyzerException {
        // 返回BasicValue定义的7个静态字段之一
    }

    @Override
    public void returnOperation(AbstractInsnNode insn, BasicValue value, BasicValue expected) throws AnalyzerException {
        // Nothing to do.
    }

    @Override
    public BasicValue merge(BasicValue value1, BasicValue value2) {
        if (!value1.equals(value2)) {
            return BasicValue.UNINITIALIZED_VALUE;
        }
        return value1;
    }
}
```

## 示例：打印Frame的状态

Get type info for each variable and stack slot for each method instruction

```text
Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
Frame<BasicValue>[] frames = analyzer.analyze(className, mn);

for (Frame<BasicValue> f : frames) {
    for (int i = 0; i < f.getLocals(); ++i) {
        BasicValue local = f.getLocal(i);
        // ... local.getType()
    }

    for (int j = 0; j < f.getStackSize(); ++j) {
        BasicValue stack = f.getStack(j);
        // ...
    }
}
```

打印每条instruction对应的Frame状态：

```java
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.Analyzer;
import org.objectweb.asm.tree.analysis.BasicInterpreter;
import org.objectweb.asm.tree.analysis.BasicValue;
import org.objectweb.asm.tree.analysis.Frame;

import java.util.ArrayList;
import java.util.List;

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
        MethodNode mn = methods.get(1);

        Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
        Frame<BasicValue>[] frames = analyzer.analyze(className, mn);

        for (Frame<BasicValue> f : frames) {
            List<BasicValue> localList = new ArrayList<>();
            for (int i = 0; i < f.getLocals(); ++i) {
                BasicValue local = f.getLocal(i);
                localList.add(local);
            }

            List<BasicValue> stackList = new ArrayList<>();
            for (int j = 0; j < f.getStackSize(); ++j) {
                BasicValue stack = f.getStack(j);
                stackList.add(stack);
            }

            String line = FrameUtils.toLine(localList, stackList);
            System.out.println(line);
        }
    }
}
```

## 细节：top、null和void的处理

在`BasicInterpreter`类当中，对于top值、null值和void进行了处理，但是其中有一些让人容易混淆的地方。

### 三者分别指什么

- `top`：在JVM文档的[4.7.4. The StackMapTable Attribute](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.4)定义的一个类型，它表示当前local variable当中的某一个位置处于未初始化的状态。
- `null`或`aconst_null`：在Java语言当中，表现为`null`值；在`.class`文件中，表现为`aconst_null`，是[JVM文档](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aconst_null)定义的一个指令，将一个`null`加载到operand stack上。
- `void`：方法的返回值是`void`类型。
  - 如果方法的返回值类型不是`void`类型，假如说是一个`int`类型，那么它会将返回的`int`值加载到operand stack上。
  - 如果返回值类型是`void`类型，那么则不需要加载任何值到operand stack上。

### 概念领域的转换

刚刚介绍的`top`、`null`和`void`都是在`.class`文件所存在的内容，接下来它进行转换成ASM当中的`Type`类型，再接着转换成ASM当中的`Value`类型，之后就可以结合`Frame`类来模拟local variable和operand stack的变化了。

```text
.class --> ASM Type --> ASM Value
```

三个概念领域的关系可以表示成下图：

```text
  ┌─────────────────────────────┐     |        ┌──────────────────────────────────────────────┐
  │          asm.jar            │     |        │            asm-analysis.jar                  │
  │  ClassReader   Type         │     |        │                                              │
  │  ClassVisitor  ClassWriter  │     |        │  Value Interpreter Frame Analyzer            │
  └─────────────────────────────┘     |        └──────────────────────────────────────────────┘
---------------------------------------------------------------------------------------------------
                                      |    ┌──────────────────────────────────────────────────────┐
                                      |    │     operand stack                                    │
    ┌────────────────────────┐        |    │    ┌──────────────┐              JVM                 │
    │     Internal Name      │        |    │    ├──────────────┤           Stack Frame            │
    │       Descriptor       │        |    │    ├──────────────┤                                  │
    │                        │        |    │    ├──────────────┤                                  │
    │ top, aconst_null, void │        |    │    ├──────────────┤                                  │
    │                        │        |    │    ├──────────────┤         local variable           │
    │        .class          │        |    │    ├──────────────┤     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐     │
    │       ClassFile        │        |    │    └──────────────┘     └──┘ └──┘ └──┘ └──┘ └──┘     │
    └────────────────────────┘        |    │                           0    1    2    3    4      │
                                      |    └──────────────────────────────────────────────────────┘
```

### 转换过程

在下表当中，就是`top`、`null`和`void`三者相对应的转换值：

```text
┌─────────────┬────────────────────────────┬────────────────────────────────┐
│   .class    │          ASM Type          │      ASM Value in Frame        │
├─────────────┼────────────────────────────┼────────────────────────────────┤
│     top     │            null            │ BasicValue.UNINITIALIZED_VALUE │
├─────────────┼────────────────────────────┼────────────────────────────────┤
│ aconst_null │ BasicInterpreter.NULL_TYPE │   BasicValue.REFERENCE_VALUE   │
├─────────────┼────────────────────────────┼────────────────────────────────┤
│    void     │       Type.VOID_TYPE       │              null              │
└─────────────┴────────────────────────────┴────────────────────────────────┘
```

在上表当中，容易混淆的地方就是：第一列有`aconst_null`，第二列有`null`，第三列有`null`，但是这三者不在同一行，且所隶属的“领域”是不同的。

首先，是`top`的查找过程:

- `Analyzer.analyze()`方法 --> `Analyzer.computeInitialFrame()`方法
- `Interpreter.newEmptyValue()`方法
- `BasicInterpreter.newValue()`方法

```java
public abstract class Interpreter<V extends Value> {
    public V newEmptyValue(int local) {
        return newValue(null);
    }
}
```

其次，是`null`或`aconst_null`的查找过程:

- `Analyzer.analyze()`方法
- `Frame.execute()`方法的`ACONST_NULL`指令
- `BasicInterpreter.newOperation()`方法当中的`ACONST_NULL`指令 --> `BasicInterpreter.newValue()`方法

最后，是`void`的查找过程:

- `Analyzer.analyze()`方法
- `Frame.execute()`方法调用方法的指令 --> `Frame.executeInvokeInsn()`方法
- `BasicInterpreter.naryOperation()`方法 --> `BasicInterpreter.newValue()`方法

如果遇到`void`类型的时候，它不应该向Frame当中添加任何值，因此其相应的`BasicValue`值为`null`。

在`BasicInterpreter`类当中，定义了一个`NULL_TYPE`字段：

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
    public static final Type NULL_TYPE = Type.getObjectType("null");
}
```

这个`NULL_TYPE`字段在`newOperation`方法中处理`aconst_null`指令时用到。

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
    @Override
    public BasicValue newOperation(final AbstractInsnNode insn) throws AnalyzerException {
        switch (insn.getOpcode()) {
            case ACONST_NULL:
                return newValue(NULL_TYPE);      // aconst_null --> NULL_TYPE
            // ...
            case GETSTATIC:
                return newValue(Type.getType(((FieldInsnNode) insn).desc));
            case NEW:
                return newValue(Type.getObjectType(((TypeInsnNode) insn).desc));
            default:
                throw new AssertionError();
        }
    }

    @Override
    public BasicValue newValue(final Type type) {
        if (type == null) {
            return BasicValue.UNINITIALIZED_VALUE; // top --> null --> UNINITIALIZED_VALUE
        }
        switch (type.getSort()) {
            case Type.VOID:
                return null; // void --> Type.VOID_TYPE --> null
            case Type.BOOLEAN:
            case Type.CHAR:
            case Type.BYTE:
            case Type.SHORT:
            case Type.INT:
                return BasicValue.INT_VALUE;
            case Type.FLOAT:
                return BasicValue.FLOAT_VALUE;
            case Type.LONG:
                return BasicValue.LONG_VALUE;
            case Type.DOUBLE:
                return BasicValue.DOUBLE_VALUE;
            case Type.ARRAY:
            case Type.OBJECT:
                return BasicValue.REFERENCE_VALUE;
            default:
                throw new AssertionError();
        }
    }

    @Override
    public BasicValue naryOperation(AbstractInsnNode insn, final List<? extends BasicValue> values)
            throws AnalyzerException {
        int opcode = insn.getOpcode();
        if (opcode == MULTIANEWARRAY) {
            return newValue(Type.getType(((MultiANewArrayInsnNode) insn).desc));
        } else if (opcode == INVOKEDYNAMIC) {
            return newValue(Type.getReturnType(((InvokeDynamicInsnNode) insn).desc));
        } else {
            return newValue(Type.getReturnType(((MethodInsnNode) insn).desc));
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，`BasicValue`类实现了`Value`接口，它本质是在`Type`类型基础的进一步封装。在`BasicValue`类当中，定义了7个静态字段。
- 第二点，`BasicInterpreter`类继承自`Interpreter`类，它就是利用`BasicValue`类当中定义的7个静态字段进行运算，得到的结果是这7个字段当中的任意一个值，或者是`null`值。
- 第三点，代码示例，打印出Frame(local variable和operand stack)当中的元素。
- 第四点，从细节上来说，对top、null和void进行区分。
