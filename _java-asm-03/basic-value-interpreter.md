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

## 示例：移除Dead Code

This `BasicInterpreter` is not very useful in itself,
but it can be used as an "empty" `Interpreter` implementation in order to construct an `Analyzer`.
This analyzer can then be used to detect unreachable code in a method.

Indeed, even by following both branches in jumps instructions,
it is not possible to reach code that cannot be reached from the first instruction.
The consequence is that, after an analysis, and whatever the `Interpreter` implementation,
the computed frames – returned by the `Analyzer.getFrames` method – are `null` for instructions that cannot be reached.

那么，为什么可以移除dead code呢？

- 其实，`BasicInterpreter`类本身并没有太多的作用，因为所有的引用类型都使用`BasicValue.REFERENCE_VALUE`来表示，类型非常单一，没有太多的操作空间。
- 相反的，`Analyzer`类才是起到主要作用的类，`Frame<V>[] frames = (Frame<V>[]) new Frame<?>[insnListSize];`，那么默认情况下，`frames`里所有元素都是`null`值。如果某一条instruction可以执行到，那么就会设置对应的`frames`当中的值，就不再为`null`了。反过来说，如果`frames`当中的某一个元素为`null`，那么也就表示对应的instruction就是dead code。

### 预期目标

在之前的Tree Based Class Transformation示例当中，有一个示例是“优化跳转”，经过优化之后，有一些instruction就成为dead code。

我们的预期目标就是移除那些成为dead code的instruction。

### 编码实现

```java
import lsieun.asm.tree.transformer.MethodTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.LabelNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

public class RemoveDeadCodeNode extends ClassNode {
    public RemoveDeadCodeNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        MethodTransformer mt = new MethodRemoveDeadCodeTransformer(name, null);
        for (MethodNode mn : methods) {
            mt.transform(mn);
        }

        // 其次，调用父类的方法实现
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class MethodRemoveDeadCodeTransformer extends MethodTransformer {
        private final String owner;

        public MethodRemoveDeadCodeTransformer(String owner, MethodTransformer mt) {
            super(mt);
            this.owner = owner;
        }

        @Override
        public void transform(MethodNode mn) {
            // 首先，处理自己的代码逻辑
            Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
            try {
                analyzer.analyze(owner, mn);
                Frame<BasicValue>[] frames = analyzer.getFrames();
                AbstractInsnNode[] insnNodes = mn.instructions.toArray();
                for (int i = 0; i < frames.length; i++) {
                    if (frames[i] == null && !(insnNodes[i] instanceof LabelNode)) {
                        mn.instructions.remove(insnNodes[i]);
                    }
                }
            }
            catch (AnalyzerException ex) {
                ex.printStackTrace();
            }

            // 其次，调用父类的方法实现
            super.transform(mn);
        }
    }
}
```

### 进行转换

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

public class HelloWorldTransformTree {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new RemoveDeadCodeNode(api, cw);

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: goto          3
       3: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
       6: iload_1
       7: goto          10
      10: ifne          18
      13: ldc           #18                 // String val is 0
      15: goto          20
      18: ldc           #20                 // String val is not 0
      20: invokevirtual #26                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}
```

## 总结

本文内容总结如下：

- 第一点，`BasicValue`类实现了`Value`接口，它本质是在`Type`类型基础的进一步封装。在`BasicValue`类当中，定义了7个静态字段。
- 第二点，`BasicInterpreter`类继承自`Interpreter`类，它就是利用`BasicValue`类当中定义的7个静态字段进行运算，得到的结果是这7个字段当中的任意一个值，或者是`null`值。
- 第三点，代码示例，在这里举了一个移除dead code的例子。

