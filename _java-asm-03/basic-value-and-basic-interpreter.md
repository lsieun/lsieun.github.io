---
title:  "BasicValue-BasicInterpreter"
sequence: "404"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})



| 父类型 | `Interpreter`      | `Value`      |
|-------|--------------------|--------------|
| 子类型 | `BasicInterpreter` | `BasicValue` |

## BasicValue

### class info

第一个部分，`BasicValue`类实现了`Value`接口。

```java
public class BasicValue implements Value {
}
```

### fields

第二个部分，`BasicValue`类定义的字段有哪些。

| 领域 | ClassFile | ASM | Frame(local variable+operand stack) |
|-----|-----------|-----|-------------------------------------|
| 类型 | Internal Name/Descriptor | Type | Value |
| 示例 | `Ljava/lang/String;` | `Type t = Type.getObjectType("java/lang/String");` | `BasicValue val = BasicValue.INT_VALUE;` |

我们通过三点来理解`BasicValue`和`Type`之间的关系：

- 第一点，`BasicValue`是属于Frame当中的概念，是local variable和operand stack当中存储的数据类型。
- 第二点，`Type`是属于ASM当中的概念，它是编写ASM代码过程中用到的类型。
- 第三点，`BasicValue`类就是对`Type`类的封装。

```java
public class BasicValue implements Value {
    private final Type type;

    public Type getType() {
        return type;
    }
}
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


## 总结

本文内容总结如下：

- 第一点，`BasicValue`类实现了`Value`接口，它本质是在`Type`类型基础的进一步封装。在`BasicValue`类当中，定义了7个静态字段。
- 第二点，`BasicInterpreter`类继承自`Interpreter`类，它就是利用`BasicValue`类当中定义的7个静态字段进行运算，得到的结果是这7个字段当中的任意一个值，或者是`null`值。
- 第三点，代码示例，在这里举了一个移除dead code的例子。

