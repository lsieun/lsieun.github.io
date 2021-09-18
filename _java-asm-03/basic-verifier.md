---
title:  "BasicValue-BasicVerifier"
sequence: "406"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

The `BasicVerifier` class extends the `BasicInterpreter` class.
It uses the same seven sets but, unlike `BasicInterpreter`, checks that instructions are used correctly.

- For instance it checks that the operands of an `IADD` instruction are `INTEGER_VALUE` values (while `BasicInterpreter` just returns the result, i.e. `INTEGER_VALUE`).
  - 在`BasicVerifier`类当中，`binaryOperation`方法处理`IADD`指令时，会检查两个operand是否是`BasicValue.INT_VALUE`类型，然而再调用父类（`BasicInterpreter`）的实现。
  - 在`BasicInterpreter`类当中，`binaryOperation`方法处理`IADD`指令时，会直接返回`BasicValue.INT_VALUE`类型。
- For instance this class can detect that the `ISTORE 1 ALOAD 1` sequence is invalid.
  - 在`BasicVerifier`类当中，`copyOperation`方法处理`ISTORE`指令时，会检查参数`value`是否为`BasicValue.INT_VALUE`类型。
  - 在`BasicVerifier`类当中，`copyOperation`方法处理`ALOAD`指令时，会检查参数`value`是否为引用类型（`isReference()`方法）。

从实际应用的角度来说，`BasicVerifier`类的价值不大。我们的重点是，学习和模仿`BasicVerifier`检查类型的处理思路。

## BasicVerifier

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

在`BasicVerifier`类当中，对多个方法进行了重写，但是多个方法的整体思路是一样的：将期望值和实际值进行比较。我们这里以`copyOperation`方法为例，其中`value`是实际值，`expected`是期望值，如果两者不匹配，则抛出`AnalyzerException`类型的异常。

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

- 第一点，介绍`BasicVerifier`类各个部分的信息。
- 第二点，代码示例，学习`BasicVerifier`检查类型的思路。
