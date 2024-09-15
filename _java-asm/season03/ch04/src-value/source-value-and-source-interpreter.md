---
title: "SourceInterpreter"
sequence: "410"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在本章内容当中，最核心的内容就是下面两行代码。这两行代码包含了`asm-analysis.jar`当中`Analyzer`、`Frame`、`Interpreter`和`Value`最重要的四个类：

```text
   ┌── Analyzer
   │        ┌── Value                                   ┌── Interpreter
   │        │                                           │
Analyzer<SourceValue> analyzer = new Analyzer<>(new SourceInterpreter());
Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
   │        │
   │        └── Value
   └── Frame
```

在本文当中，我们将介绍`SourceInterpreter`和`SourceValue`类：

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

- 第一点，类的继承关系。`SourceInterpreter`类继承自`Interpreter`抽象类。
- 第二点，类的合作关系。`SourceInterpreter`与`SourceValue`类是一起使用的。
- 第三点，类的表达能力。`SourceInterpreter`类能够使用的`SourceValue`对象有很多个。


## SourceValue

### class info

第一个部分，`SourceValue`类实现了`Value`接口。

```java
public class SourceValue implements Value {
}
```

### fields

第二个部分，`SourceValue`类定义的字段有哪些。

```java
public class SourceValue implements Value {
    public int size;

    public Set<AbstractInsnNode> insns;
}
```

### constructors

第三个部分，`SourceValue`类定义的构造方法有哪些。这三个构造方法，有不同的应用场景：

- `SourceValue(int)`构造方法，**在指令（Instruction）开始执行之前**，设置local variable的初始值，例如`this`、方法接收的参数，这些不需要指令（Instruction）参数。
- `SourceValue(int, AbstractInsnNode)`构造方法，**在指令（Instruction）开始执行之后**，记录一条指令（`AbstractInsnNode`）和对应的local variable、operand stack上的值（`SourceValue`）之间的关系。
- `SourceValue(int, Set<AbstractInsnNode>)`构造方法，在**`SourceValue`值进行合并（merge）的时候**，记录多条指令（`Set<AbstractInsnNode>`）和对应的local variable、operand stack上的值（`SourceValue`）之间的关系。

```java
public class SourceValue implements Value {
    public SourceValue(int size) {
        this(size, new SmallSet<AbstractInsnNode>());
    }

    public SourceValue(int size, AbstractInsnNode insnNode) {
        this.size = size;
        this.insns = new SmallSet<>(insnNode);
    }

    public SourceValue(int size, Set<AbstractInsnNode> insnSet) {
        this.size = size;
        this.insns = insnSet;
    }
}
```

### methods

第四个部分，`SourceValue`类定义的方法有哪些。

```java
public class SourceValue implements Value {
    @Override
    public int getSize() {
        return size;
    }
}
```

## SourceInterpreter

`SourceInterpreter`的主要作用是记录指令（instruction）与Frame当中值（`SourceValue`）的关联关系。

### class info

第一个部分，`SourceInterpreter`类实现了`Interpreter`抽象类。

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
}
```

### fields

第二个部分，`SourceInterpreter`类定义的字段有哪些。

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
    // 没有定义字段
}
```

### constructors

第三个部分，`SourceInterpreter`类定义的构造方法有哪些。

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
    public SourceInterpreter() {
        super(ASM9);
        if (getClass() != SourceInterpreter.class) {
            throw new IllegalStateException();
        }
    }

    protected SourceInterpreter(int api) {
        super(api);
    }
}
```

### methods

第四个部分，`SourceInterpreter`类定义的方法有哪些。

#### newValue方法

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
    @Override
    public SourceValue newValue(Type type) {
        if (type == Type.VOID_TYPE) {
            return null;
        }
        // 这里是SourceValue定义的第1个构造方法，不需要指令参与
        return new SourceValue(type == null ? 1 : type.getSize());
    }
}
```

#### opcode相关方法

下面7个方法中的6个，遵循一个共同特点：“创建SourceValue对象”。

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
    @Override
    public SourceValue newOperation(AbstractInsnNode insn) {
        int size = 1; // 或者 size = 2
        // 这里是SourceValue定义的第2个构造方法，需要1个指令参与
        return new SourceValue(size, insn);
    }

    @Override
    public SourceValue copyOperation(AbstractInsnNode insn, SourceValue value) {
        // 这里是SourceValue定义的第2个构造方法，需要1个指令参与
        return new SourceValue(value.getSize(), insn);
    }

    @Override
    public SourceValue unaryOperation(AbstractInsnNode insn,
                                      SourceValue value) {
        int size = 1; // 或者 size = 2
        // 这里是SourceValue定义的第2个构造方法，需要1个指令参与
        return new SourceValue(size, insn);
    }

    @Override
    public SourceValue binaryOperation(AbstractInsnNode insn,
                                       SourceValue value1,
                                       SourceValue value2) {
        int size = 1; // 或者 size = 2
        // 这里是SourceValue定义的第2个构造方法，需要1个指令参与
        return new SourceValue(size, insn);
    }

    @Override
    public SourceValue ternaryOperation(AbstractInsnNode insn,
                                        SourceValue value1,
                                        SourceValue value2,
                                        SourceValue value3) {
        // 这里是SourceValue定义的第2个构造方法，需要1个指令参与
        return new SourceValue(1, insn);
    }

    @Override
    public SourceValue naryOperation(AbstractInsnNode insn,
                                     List<? extends SourceValue> values) {
        int size = 1; // 或者 size = 2
        // 这里是SourceValue定义的第2个构造方法，需要1个指令参与
        return new SourceValue(size, insn);
    }

    @Override
    public void returnOperation(AbstractInsnNode insn,
                                SourceValue value,
                                SourceValue expected) {
        // Nothing to do.
    }
}
```

#### merge方法

```java
public class SourceInterpreter extends Interpreter<SourceValue> implements Opcodes {
    @Override
    public SourceValue merge(SourceValue value1, SourceValue value2) {
        // 第一种情况，SmallSet类型
        if (value1.insns instanceof SmallSet && value2.insns instanceof SmallSet) {
            Set<AbstractInsnNode> setUnion = value1.insns + value2.insns;
            if (setUnion == value1.insns && value1.size == value2.size) {
                // value1包含了value2
                return value1;
            } else {
                // 这里是SourceValue定义的第3个构造方法，需要多个指令参与
                // value1不能包含value2，那就生成一个新的SourceValue对象
                return new SourceValue(Math.min(value1.size, value2.size), setUnion);
            }
        }

        // 第二种情况，其它类型，value1不能包含value2，那就生成一个新的SourceValue对象
        if (value1.size != value2.size || !containsAll(value1.insns, value2.insns)) {
            HashSet<AbstractInsnNode> setUnion = new HashSet<>();
            setUnion.addAll(value1.insns);
            setUnion.addAll(value2.insns);
            // 这里是SourceValue定义的第3个构造方法，需要多个指令参与
            return new SourceValue(Math.min(value1.size, value2.size), setUnion);
        }
        
        // 第三种情况，其它类型，value1包含了value2
        return value1;
    }
}
```

## 测试代码

### simple

```java
public class HelloWorld {
    public void test() {
        int a = 1;
        int b = 2;
        int c = a + b;
        System.out.println(c);
    }
}
```

对应的Frame变化如下：

```text
test:()V
000:    iconst_1                                {[], [], [], []} | {}
001:    istore_1                                {[], [], [], []} | {[iconst_1]}
002:    iconst_2                                {[], [istore_1], [], []} | {}
003:    istore_2                                {[], [istore_1], [], []} | {[iconst_2]}
004:    iload_1                                 {[], [istore_1], [istore_2], []} | {}
005:    iload_2                                 {[], [istore_1], [istore_2], []} | {[iload_1]}
006:    iadd                                    {[], [istore_1], [istore_2], []} | {[iload_1], [iload_2]}
007:    istore_3                                {[], [istore_1], [istore_2], []} | {[iadd]}
008:    getstatic System.out                    {[], [istore_1], [istore_2], [istore_3]} | {}
009:    iload_3                                 {[], [istore_1], [istore_2], [istore_3]} | {[getstatic System.out]}
010:    invokevirtual PrintStream.println       {[], [istore_1], [istore_2], [istore_3]} | {[getstatic System.out], [iload_3]}
011:    return                                  {[], [istore_1], [istore_2], [istore_3]} | {}
================================================================
```

### if

```java
public class HelloWorld {
    public void test(int a, int b) {
        Object obj;
        int c = a + b;
        if (c > 10) {
            obj = Integer.valueOf(c);
        }
        else {
            obj = Float.valueOf(c);
        }
        System.out.println(obj);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，`SourceValue`类是“记录”instruction（`AbstractInsnNode`）与Frame当中的值（`SourceValue`）之间的关系，而`SourceInterpreter`类是“建立”两者之间的联系。
- 第二点，`SourceInterpreter`类是属于`Interpreter`的部分，它使用`SourceValue`的逻辑分成三个部分：
  - 在指令（instruction）执行之前，计算方法的初始Frame（initial frame），this、方法的参数和未初始化的值，它们对应的`SourceValue`对象不与任何的指令（instruction）相关，对应于`SourceValue`第1个构造方法。
  - 在指令（instruction）开始执行之后，如果某一条指令（instruction）改变了local variable和operand stack上的值，那么对应的`SourceValue`对象就记录该instruction（`AbstractInsnNode`）与`SourceValue`对象的联系，对应于`SourceValue`第2个构造方法。
  - 在指令（instruction）开始执行之后，control flow有分支（brach），也就意味着将来的合并（merge）；在合并（merge）时对应的`SourceValue`对象就记录该多个instruction（`Set<AbstractInsnNode>`）与`SourceValue`对象的联系，对应于`SourceValue`第3个构造方法。
