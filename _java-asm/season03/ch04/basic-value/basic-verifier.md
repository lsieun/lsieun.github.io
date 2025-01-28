---
title: "BasicVerifier"
sequence: "406"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在本章内容当中，最核心的内容就是下面两行代码。这两行代码包含了`asm-analysis.jar`当中`Analyzer`、`Frame`、`Interpreter`和`Value`最重要的四个类：

```text
   ┌── Analyzer
   │        ┌── Value                                   ┌── Interpreter
   │        │                                           │
Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicVerifier());
Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
   │        │
   │        └── Value
   └── Frame
```

在本文当中，我们将介绍`BasicVerifier`类：

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

在上面这个表当中，我们关注以下三点：

- 第一点，类的继承关系。`BasicVerifier`类继承自`BasicInterpreter`类，而`BasicInterpreter`类继承自`Interpreter`抽象类。另外，`SimpleVerifier`类是当前`BasicVerifier`类的子类。
- 第二点，类的合作关系。`BasicVerifier`与`BasicValue`类是一起使用的。
- 第三点，类的表达能力。`BasicVerifier`类能够使用的`BasicValue`对象有7个，也就是`BasicValue`类定义的7个静态字段值。

值得注意的是，`BasicInterpreter`类和`BasicVerifier`类为什么会使用相同的`BasicValue`类定义的7个静态字段呢？因为`BasicVerifier`类沿用了`BasicInterpreter`类的`newValue()`方法；而`newValue()`就是生产`Value`对象的工厂。相应的，`SimpleVerifier`重新实现了`newValue()`方法，因此可以生成很多个`BasicValue`类的实例。

## BasicVerifier

在介绍`BasicVerifier`类具体组成部分之前，我们来提出两个问题：

- 第一个问题，类名的含义是什么呢？
- 第二个问题，这个类的作用大吗？

首先，回答第一个问题。`BasicVerifier`类名当中带有verify（检查）的含义。那么，检查什么内容呢？（What）检查的是指令（instruction）使用的是否正确。怎么检查呢？（How）指令（instruction）自身会带有类型信息（期望类型），让它与local variable和operand stack当中的数据类型（实际类型）是否兼容。那么，理解`BasicVerifier`类重点就在于，看看它是如何实现类型检查（verify）的。

- For instance it checks that the operands of an `IADD` instruction are `BasicValue.INT_VALUE` values (while `BasicInterpreter` just returns the result, i.e. `BasicValue.INT_VALUE`).
  - 在`BasicVerifier`类当中，`binaryOperation`方法处理`IADD`指令时，会检查两个operand是否是`BasicValue.INT_VALUE`类型，然而再调用父类（`BasicInterpreter`）的实现。
  - 在`BasicInterpreter`类当中，`binaryOperation`方法处理`IADD`指令时，会直接返回`BasicValue.INT_VALUE`类型。
- For instance this class can detect that the `ISTORE 1 ALOAD 1` sequence is invalid.
  - 在`BasicVerifier`类当中，`copyOperation`方法处理`ISTORE`指令时，会检查参数`value`是否为`BasicValue.INT_VALUE`类型。
  - 在`BasicVerifier`类当中，`copyOperation`方法处理`ALOAD`指令时，会检查参数`value`是否为引用类型（`isReference()`方法）。

其次，回答第二个问题。从实际应用的角度来说，`BasicVerifier`类的价值不大。为什么价值不大呢？因为它只能使用`BasicValue`所定义的7个静态字段值，对问题的表达能力非常有限，能够检查的也是简单的错误。那么，我们着重，学习和模仿`BasicVerifier`检查类型的处理思路。

### class info

第一个部分，`BasicVerifier`类继承自`BasicInterpreter`类。

```java
public class BasicVerifier extends BasicInterpreter {
}
```

### fields

第二个部分，`BasicVerifier`类定义的字段有哪些。

```java
public class BasicVerifier extends BasicInterpreter {
    // 没有定义字段
}
```

### constructors

第三个部分，`BasicVerifier`类定义的构造方法有哪些。

```java
public class BasicVerifier extends BasicInterpreter {
    public BasicVerifier() {
        super(ASM9);
        if (getClass() != BasicVerifier.class) {
            throw new IllegalStateException();
        }
    }

    protected BasicVerifier(int api) {
        super(api);
    }
}
```

### methods

第四个部分，`BasicVerifier`类定义的方法有哪些。

#### opcode相关的方法

在`Interpreter`类当中，定义了7个与opcode相关的抽象方法（abstract method）：

1. newOperation
2. copyOperation
3. unaryOperation
4. binaryOperation
5. ternaryOperation
6. naryOperation
7. returnOperation

在`BasicInterpreter`类当中，对这7个方法进行了实现。

在`BasicVerifier`类当中，对6个方法进行了重新实现，有1个方法（`newOperation`）沿用了`BasicInterpreter`类的实现。

在这6个重新实现的方法当中，它们的整体思路是一样的：将期望值（期望类型）和实际值（实际类型）进行比较。这里以`copyOperation`方法为例，其中`value`是实际值，`expected`是期望值，如果两者不匹配，则抛出`AnalyzerException`类型的异常。

```java
public class BasicVerifier extends BasicInterpreter {
    @Override
    public BasicValue copyOperation(final AbstractInsnNode insn, final BasicValue value) throws AnalyzerException {
        Value expected;
        switch (insn.getOpcode()) {
            case ILOAD:
            case ISTORE:
                expected = BasicValue.INT_VALUE;
                break;
            case FLOAD:
            case FSTORE:
                expected = BasicValue.FLOAT_VALUE;
                break;
            case LLOAD:
            case LSTORE:
                expected = BasicValue.LONG_VALUE;
                break;
            case DLOAD:
            case DSTORE:
                expected = BasicValue.DOUBLE_VALUE;
                break;
            case ALOAD:
                if (!value.isReference()) {
                    throw new AnalyzerException(insn, null, "an object reference", value);
                }
                return value;
            case ASTORE:
                if (!value.isReference() && !BasicValue.RETURNADDRESS_VALUE.equals(value)) {
                    throw new AnalyzerException(insn, null, "an object reference or a return address", value);
                }
                return value;
            default:
                return value;
        }
        if (!expected.equals(value)) {
            throw new AnalyzerException(insn, null, expected, value);
        }
        return value;
    }
}
```

#### 自定义的protected方法

在`BasicVerifier`类当中，它除了继承自`Interpreter`的方法之外，还定义了一些自己的`protected`方法。虽然这些`protected`方法比较简单，但是子类（例如，`SimpleVerifier`）可以对这些方法进行扩展。

```java
public class BasicVerifier extends BasicInterpreter {
    protected boolean isArrayValue(final BasicValue value) {
        return value.isReference();
    }
    protected BasicValue getElementValue(final BasicValue objectArrayValue) throws AnalyzerException {
        return BasicValue.REFERENCE_VALUE;
    }
    protected boolean isSubTypeOf(final BasicValue value, final BasicValue expected) {
        return value.equals(expected);
    }
}
```

数组类型：`BasicVerifier.isArrayValue(BasicValue value)`和`BasicVerifier.getElementValue(BasicValue objectArrayValue)`方法

- 遇到`arraylength`指令时，判断operand stack栈顶是不是一个数组。
- 遇到`aaload`指令时，根据当前的数组类型，获取其中的元素类型。

两个类型之间的兼容性：`BasicVerifier.isSubTypeOf(BasicValue value, BasicValue expected)`

- 遇到`invokevirtual`等指令时，实际返回的类型和方法的返回值类型之间是否兼容。

引用类型：`BasicValue.isReference()`

- 遇到`ifnull`或`areturn`这类指令的时候，它需要一个引用类型的值，不能是primitive type类型的值。

## 示例：检测不合理指令组合

假如我们想实现下面的`test`方法：

```java
package sample;

public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a + b;
    }
}
```

我们可以使用`BasicVerifier`来检验出`ISTORE 1 ALOAD 1`指令组合是不合理的。

```java
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        MethodNode mn = new MethodNode(ACC_PUBLIC, "test", "()V", null, null);

        InsnList il = mn.instructions;
        il.add(new InsnNode(ICONST_1));
        il.add(new VarInsnNode(ISTORE, 1));
        il.add(new InsnNode(ICONST_2));
        il.add(new VarInsnNode(ISTORE, 2));
        il.add(new VarInsnNode(ILOAD, 1)); // 将ILOAD替换成ALOAD，就会报错
        il.add(new VarInsnNode(ILOAD, 2));
        il.add(new InsnNode(IADD));
        il.add(new VarInsnNode(ISTORE, 3));
        il.add(new InsnNode(RETURN));

        mn.maxStack = 2;
        mn.maxLocals = 4;

        Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicVerifier());
        analyzer.analyze("sample/HelloWorld", mn);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，介绍`BasicVerifier`类，它是属于`Interpreter`的部分，它的特点是进行类型检查。
  - 进行类型检查的方式：将一个实际值和一个期望值进行比较，判断两者是否兼容（对应于`isSubTypeOf()`方法，或者相等，或者说父类和子类的关系）；如果兼容，则表示类型没有错误；如果不兼容，则表示类型出现错误。
- 第二点，代码示例，学习`BasicVerifier`检查类型的思路。
