---
title: "Type 介绍"
sequence: "304"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 为什么会存在 Type 类

在 ASM 的代码中，有一个 `Type` 类（`org.objectweb.asm.Type`）。为什么会有这样一个 `Type` 类呢？

大家知道，在 JDK 当中有一个 `java.lang.reflect.Type` 类。对于 `java.lang.reflect.Type` 类来说，它是一个接口，它有一个我们经常使用的子类，即 `java.lang.Class`；相应的，在 ASM 当中有一个 `org.objectweb.asm.Type` 类。

<table>
<thead>
<tr>
    <th></th>
    <th>JDK</th>
    <th>ASM</th>
</tr>
</thead>
<tbody>
<tr>
    <td>类名</td>
    <td><code>java.lang.reflect.Type</code></td>
    <td><code>org.objectweb.asm.Type</code></td>
</tr>
<tr>
    <td>位置</td>
    <td><code>rt.jar</code></td>
    <td><code>asm.jar</code></td>
</tr>
</tbody>
</table>

在编写代码层面，如果我们不能区分出 `java.lang.reflect.Type` 类和 `org.objectweb.asm.Type` 类，我们也不能很好的使用它们。

- Java File：具体表现为 `.java` 文件，在里面使用 Java 语言编写代码，它是属于 Java Language Specification 的范畴。
- Class File：具体表现为 `.class` 文件，它里面的内容遵循 ClassFile 的结构，它是属于 JVM Specification 的范畴。
- ASM：它是一个类库。我们在编写 ASM 代码的时候，是在 `.java` 文件中编写，使用的是 Java 语言，而它所操作的对象却是 `.class` 文件。

换句话说，ASM 实现，从本质上来说，是一只脚踩在 Java Language Specification 的范畴，而另一只脚却踩在 JVM Specification 的范畴。ASM，在这两个范畴中，扮演的一个非常重要的角色，就是将 Java Language Specification 范畴的概念和 JVM Specification 范畴的概念进行转换。

![JLS 与 JVM 之间的关系 ](/assets/images/java/jls-jvms.png)

这两个范畴，是相关的，但是又不是那种密不可分的关系。比如说，Java 语言编写的程序可以运行在 JVM 上，Scala 语言编写的程序也可以运行在 JVM 上，甚至 Python 语言编写的程序也可以编写在 JVM 上；也就是说，某一种编程语言和 JVM 之间，并不是一种非常强的依赖关系。

![ 各种语言与 JVM 之间的关系 ](/assets/images/java/java-scala-python-jvm.png)

<table>
<thead>
<tr>
    <th>Java Language Specification</th>
    <th>ASM</th>
    <th>JVM Specification</th>
</tr>
</thead>
<tbody>
<tr>
    <td><code>int</code></td>
    <td>&lt;--- 向左转换 ---Type--- 向右转换 ---&gt;</td>
    <td><code>I</code></td>
</tr>
<tr>
    <td><code>float</code></td>
    <td>&lt;--- 向左转换 ---Type--- 向右转换 ---&gt;</td>
    <td><code>F</code></td>
</tr>
<tr>
    <td><code>java.lang.String</code></td>
    <td>&lt;--- 向左转换 ---Type--- 向右转换 ---&gt;</td>
    <td><code>java/lang/String</code></td>
</tr>
</tbody>
</table>

在 `.java` 文件中，我们经常使用 `java.lang.Class` 类；而在 `.class` 文件中，需要经常用到 internal name、type descriptor 和 method descriptor；而在 ASM 中，`org.objectweb.asm.Type` 类就是帮助我们进行两者之间的转换。

![](/assets/images/java/asm/asm-type-relation.png)


## Type 类

### class info

第一个部分，`Type` 类继承自 `Object` 类，而且带有 `final` 标识，所以不会存在子类。

```java
public final class Type {
}
```

### fields

第二个部分，`Type` 类定义的字段有哪些。这里我们列出了 4 个字段，这 4 个字段可以分成两组。

- 第一组，只包括 `sort` 字段，是 `int` 类型，它标识了 `Type` 类的类别。
- 第二组，包括 `valueBuffer`、`valueBegin` 和 `valueEnd` 字段，这 3 个字段组合到一起表示一个 value 值，本质上就是一个字符串。

```java
public final class Type {
    // 标识类型
    private final int sort;

    // 标识内容
    private final String valueBuffer;
    private final int valueBegin;
    private final int valueEnd;
}
```

### constructors

第三个部分，`Type` 类定义的构造方法有哪些。由于 `Type` 类的构造方法用 `private` 修饰，因此“外界”不能使用 `new` 关键字创建 `Type` 对象。

```java
public final class Type {
    private Type(final int sort, final String valueBuffer, final int valueBegin, final int valueEnd) {
        this.sort = sort;
        this.valueBuffer = valueBuffer;
        this.valueBegin = valueBegin;
        this.valueEnd = valueEnd;
    }
}
```

### methods

第四个部分，`Type` 类定义的方法有哪些。在 `Type` 类里，定义了一些方法，这些方法是与字段有直接关系的。

```java
public final class Type {
    public int getSort() {
        return sort == INTERNAL ? OBJECT : sort;
    }

    public String getClassName() {
        switch (sort) {
            case VOID:
                return "void";
            case BOOLEAN:
                return "boolean";
            case CHAR:
                return "char";
            case BYTE:
                return "byte";
            case SHORT:
                return "short";
            case INT:
                return "int";
            case FLOAT:
                return "float";
            case LONG:
                return "long";
            case DOUBLE:
                return "double";
            case ARRAY:
                StringBuilder stringBuilder = new StringBuilder(getElementType().getClassName());
                for (int i = getDimensions(); i > 0; --i) {
                    stringBuilder.append("[]");
                }
                return stringBuilder.toString();
            case OBJECT:
            case INTERNAL:
                return valueBuffer.substring(valueBegin, valueEnd).replace('/', '.');
            default:
                throw new AssertionError();
        }
    }

    public String getInternalName() {
        return valueBuffer.substring(valueBegin, valueEnd);
    }

    public String getDescriptor() {
        if (sort == OBJECT) {
            return valueBuffer.substring(valueBegin - 1, valueEnd + 1);
        } else if (sort == INTERNAL) {
            return 'L' + valueBuffer.substring(valueBegin, valueEnd) + ';';
        } else {
            return valueBuffer.substring(valueBegin, valueEnd);
        }
    }
}
```

关于这些方法的使用，示例如下：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.getType("Ljava/lang/String;");

        int sort = t.getSort();                    // ASM
        String className = t.getClassName();       // Java File
        String internalName = t.getInternalName(); // Class File
        String descriptor = t.getDescriptor();     // Class File

        System.out.println(sort);         // 10，它对应于 Type.OBJECT 字段
        System.out.println(className);    // java.lang.String   注意，分隔符是“.”
        System.out.println(internalName); // java/lang/String   注意，分隔符是“/”
        System.out.println(descriptor);   // Ljava/lang/String; 注意，分隔符是“/”，前有“L”，后有“;”
    }
}
```

## 静态成员

### 静态字段

在 `Type` 类里，定义了一些常量字段，有 `int` 类型，也有 `String` 类型。

```java
public final class Type {
    public static final int VOID = 0;
    public static final int BOOLEAN = 1;
    public static final int CHAR = 2;
    public static final int BYTE = 3;
    public static final int SHORT = 4;
    public static final int INT = 5;
    public static final int FLOAT = 6;
    public static final int LONG = 7;
    public static final int DOUBLE = 8;
    public static final int ARRAY = 9;
    public static final int OBJECT = 10;
    public static final int METHOD = 11;
    private static final int INTERNAL = 12;

    private static final String PRIMITIVE_DESCRIPTORS = "VZCBSIFJD";
}
```

在 `Type` 类里，也定义了一些 `Type` 类型的字段，这些字段是由上面的 `int` 和 `String` 类型的字段组合得到。

```java
public final class Type {
    public static final Type VOID_TYPE = new Type(VOID, PRIMITIVE_DESCRIPTORS, VOID, VOID + 1);
    public static final Type BOOLEAN_TYPE = new Type(BOOLEAN, PRIMITIVE_DESCRIPTORS, BOOLEAN, BOOLEAN + 1);
    public static final Type CHAR_TYPE = new Type(CHAR, PRIMITIVE_DESCRIPTORS, CHAR, CHAR + 1);
    public static final Type BYTE_TYPE = new Type(BYTE, PRIMITIVE_DESCRIPTORS, BYTE, BYTE + 1);
    public static final Type SHORT_TYPE = new Type(SHORT, PRIMITIVE_DESCRIPTORS, SHORT, SHORT + 1);
    public static final Type INT_TYPE = new Type(INT, PRIMITIVE_DESCRIPTORS, INT, INT + 1);
    public static final Type FLOAT_TYPE = new Type(FLOAT, PRIMITIVE_DESCRIPTORS, FLOAT, FLOAT + 1);
    public static final Type LONG_TYPE = new Type(LONG, PRIMITIVE_DESCRIPTORS, LONG, LONG + 1);
    public static final Type DOUBLE_TYPE = new Type(DOUBLE, PRIMITIVE_DESCRIPTORS, DOUBLE, DOUBLE + 1);
}
```

### 静态方法

这里介绍的几个 `get*Type()` 方法，是静态（`static`）方法。这几个方法的主要目的就是得到一个 `Type` 对象。

```java
public final class Type {
    public static Type getType(final Class clazz) {
        if (clazz.isPrimitive()) {
            if (clazz == Integer.TYPE) {
                return INT_TYPE;
            } else if (clazz == Void.TYPE) {
                return VOID_TYPE;
            } else if (clazz == Boolean.TYPE) {
                return BOOLEAN_TYPE;
            } else if (clazz == Byte.TYPE) {
                return BYTE_TYPE;
            } else if (clazz == Character.TYPE) {
                return CHAR_TYPE;
            } else if (clazz == Short.TYPE) {
                return SHORT_TYPE;
            } else if (clazz == Double.TYPE) {
                return DOUBLE_TYPE;
            } else if (clazz == Float.TYPE) {
                return FLOAT_TYPE;
            } else if (clazz == Long.TYPE) {
                return LONG_TYPE;
            } else {
                throw new AssertionError();
            }
        } else {
            return getType(getDescriptor(clazz));
        }
    }

    public static Type getType(final Constructor<?> constructor) {
        return getType(getConstructorDescriptor(constructor));
    }

    public static Type getType(final Method method) {
        return getType(getMethodDescriptor(method));
    }

    public static Type getType(final String typeDescriptor) {
        return getTypeInternal(typeDescriptor, 0, typeDescriptor.length());
    }

    public static Type getMethodType(final String methodDescriptor) {
        return new Type(METHOD, methodDescriptor, 0, methodDescriptor.length());
    }

    public static Type getObjectType(final String internalName) {
        return new Type(internalName.charAt(0) == '[' ? ARRAY : INTERNAL, internalName, 0, internalName.length());
    }
}
```

### 获取 Type 对象

`Type` 类有一个 `private` 的构造方法，因此 `Type` 对象实例不能通过 `new` 关键字来创建。但是，`Type` 类提供了 static method 和 static field 来获取对象。

#### 方式一：java.lang.Class

从一个 `java.lang.Class` 对象来获取 `Type` 对象：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.getType(String.class);
        System.out.println(t);
    }
}
```

#### 方式二：descriptor

从一个描述符（descriptor）来获取 `Type` 对象：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t1 = Type.getType("Ljava/lang/String;");
        System.out.println(t1);

        // 这里是方法的描述符
        Type t2 = Type.getMethodType("(II)I");
        System.out.println(t2);
    }
}
```

#### 方式三：internal name

从一个 internal name 来获取 `Type` 对象：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.getObjectType("java/lang/String");
        System.out.println(t);
    }
}
```

#### 方式四：static field

从一个 `Type` 类的静态字段来获取 `Type` 对象：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.INT_TYPE;
        System.out.println(t);
    }
}
```

## 特殊的方法

### array-related methods

这里介绍的两个方法与数组类型相关：

- `getDimensions()` 方法，用于获取数组的维度
- `getElementType()` 方法，用于获取数组的元素的类型

```java
public final class Type {
    public int getDimensions() {
        int numDimensions = 1;
        while (valueBuffer.charAt(valueBegin + numDimensions) == '[') {
            numDimensions++;
        }
        return numDimensions;
    }

    public Type getElementType() {
        final int numDimensions = getDimensions();
        return getTypeInternal(valueBuffer, valueBegin + numDimensions, valueEnd);
    }
}
```

示例代码：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.getType("[[[[[Ljava/lang/String;");

        int dimensions = t.getDimensions();
        Type elementType = t.getElementType();

        System.out.println(dimensions);    // 5
        System.out.println(elementType);   // Ljava/lang/String;
    }
}
```

### method-related methods

这里介绍的两个方法与“方法”相关：

- `getArgumentTypes()` 方法，用于获取“方法”接收的参数类型
- `getReturnType()` 方法，用于获取“方法”返回值的类型

```java
public final class Type {
    public Type[] getArgumentTypes() {
        return getArgumentTypes(getDescriptor());
    }

    public Type getReturnType() {
        return getReturnType(getDescriptor());
    }
}
```

示例代码：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type methodType = Type.getMethodType("(Ljava/lang/String;I)V");

        String descriptor = methodType.getDescriptor();
        Type[] argumentTypes = methodType.getArgumentTypes();
        Type returnType = methodType.getReturnType();

        System.out.println("Descriptor: " + descriptor);
        System.out.println("Argument Types:");
        for (Type t : argumentTypes) {
            System.out.println("    " + t);
        }
        System.out.println("Return Type: " + returnType);
    }
}
```

输出结果：

```text
Descriptor: (Ljava/lang/String;I)V
Argument Types:
    Ljava/lang/String;
    I
Return Type: V
```

### size-related methods

这里列举的 3 个方法是与“类型占用 slot 空间的大小”相关：

- `getSize()` 方法，用于返回某一个类型所占用的 slot 空间的大小。
- `getArgumentsAndReturnSizes()` 方法，用于返回方法所对应的 slot 空间的大……
  - 其中，参数大小 `int argumentsSize = argumentsAndReturnSizes >> 2;`。注意，在 `argumentsSize` 当中包含了隐藏的 `this` 变量。
  - 其中，返回值大小 `int returnSize = argumentsAndReturnSizes 0x03)`

```java
public final class Type {
    public int getSize() {
        switch (sort) {
            case VOID:
                return 0;
            case BOOLEAN:
            case CHAR:
            case BYTE:
            case SHORT:
            case INT:
            case FLOAT:
            case ARRAY:
            case OBJECT:
            case INTERNAL:
                return 1;
            case LONG:
            case DOUBLE:
                return 2;
            default:
                throw new AssertionError();
        }
    }

    public int getArgumentsAndReturnSizes() {
        return getArgumentsAndReturnSizes(getDescriptor());
    }

    public static int getArgumentsAndReturnSizes(final String methodDescriptor) {
        int argumentsSize = 1;
        // Skip the first character, which is always a '('.
        int currentOffset = 1;
        int currentChar = methodDescriptor.charAt(currentOffset);
        // Parse the argument types and compute their size, one at a each loop iteration.
        while (currentChar != ')') {
            if (currentChar == 'J' || currentChar == 'D') {
                currentOffset++;
                argumentsSize += 2;
            } else {
                while (methodDescriptor.charAt(currentOffset) == '[') {
                    currentOffset++;
                }
                if (methodDescriptor.charAt(currentOffset++) == 'L') {
                    // Skip the argument descriptor content.
                    int semiColumnOffset = methodDescriptor.indexOf(';', currentOffset);
                    currentOffset = Math.max(currentOffset, semiColumnOffset + 1);
                }
                argumentsSize += 1;
            }
            currentChar = methodDescriptor.charAt(currentOffset);
        }
        currentChar = methodDescriptor.charAt(currentOffset + 1);
        if (currentChar == 'V') {
            return argumentsSize << 2;
        } else {
            int returnSize = (currentChar == 'J' || currentChar == 'D') ? 2 : 1;
            return argumentsSize << 2 | returnSize;
        }
    }
}
```

示例代码：

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.INT_TYPE;
        System.out.println(t.getSize()); // 1
    }
}
```

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.LONG_TYPE;
        System.out.println(t.getSize()); // 2
    }
}
```

```java
import org.objectweb.asm.Type;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.getMethodType("(II)I");
        int value = t.getArgumentsAndReturnSizes();

        int argumentsSize = value >> 2;
        int returnSize = value & 0b11;

        System.out.println(argumentsSize); // 3
        System.out.println(returnSize);    // 1
    }
}
```

### opcode-related methods

这里介绍的方法与 opcode 相关：

- `getOpcode(int opcode)` 方法，会让我们写代码的过程中更加方便。

但是，值得注意的一点：**参数 `opcode` 的取值是一些“指定的操作码（opcode）”，而不能随便乱写**。
这些“指定的操作码（opcode）”在方法的注释中写明了，必须是
`ILOAD`, `ISTORE`, `IALOAD`, `IASTORE`, `IADD`, `ISUB`, `IMUL`, `IDIV`, `IREM`, `INEG`,
`ISHL`, `ISHR`, `IUSHR`, `IAND`, `IOR`, `IXOR` 和 `IRETURN` 中的某一个值。

**作为初学者，我们一定要注意 `getOpcode(opcode)` 方法参数值的有效性。**
否则，它就会返回一个错误的结果，导致整个程序出现错误。
当我们去检查代码整体思路的时候，会觉得程序的代码逻辑上没有问题，但是生成的代码就是不能正确运行，
百思不得其解，很可能就是给 `getOpcode(opcode)` 方法传入了一个错误的参数值。

举个具体例子，有一次我给 `getOpcode(opcode)` 方法传入了 `ICONST_0` 值（这是一个错误的值），
我期望得到 `FCONST_0` 或 `DCONST_0`，最终没有达到预期的效果。
因为 `ICONST_0`，对于 `getOpcode(int opcode)` 来说，不是一个合理的值。


```java
public final class Type {
    /**
     * Returns a JVM instruction opcode adapted to this {@link Type}. This method must not be used for
     * method types.
     *
     * @param opcode a JVM instruction opcode. This opcode must be one of ILOAD, ISTORE, IALOAD,
     *     IASTORE, IADD, ISUB, IMUL, IDIV, IREM, INEG, ISHL, ISHR, IUSHR, IAND, IOR, IXOR and
     *     IRETURN.
     * @return an opcode that is similar to the given opcode, but adapted to this {@link Type}. For
     *     example, if this type is {@code float} and {@code opcode} is IRETURN, this method returns
     *     FRETURN.
     */
    public int getOpcode(final int opcode) {
        if (opcode == Opcodes.IALOAD || opcode == Opcodes.IASTORE) {
            switch (sort) {
                case BOOLEAN:
                case BYTE:
                    return opcode + (Opcodes.BALOAD - Opcodes.IALOAD);
                case CHAR:
                    return opcode + (Opcodes.CALOAD - Opcodes.IALOAD);
                case SHORT:
                    return opcode + (Opcodes.SALOAD - Opcodes.IALOAD);
                case INT:
                    return opcode;
                case FLOAT:
                    return opcode + (Opcodes.FALOAD - Opcodes.IALOAD);
                case LONG:
                    return opcode + (Opcodes.LALOAD - Opcodes.IALOAD);
                case DOUBLE:
                    return opcode + (Opcodes.DALOAD - Opcodes.IALOAD);
                case ARRAY:
                case OBJECT:
                case INTERNAL:
                    return opcode + (Opcodes.AALOAD - Opcodes.IALOAD);
                case METHOD:
                case VOID:
                    throw new UnsupportedOperationException();
                default:
                    throw new AssertionError();
            }
        } else {
            switch (sort) {
                case VOID:
                    if (opcode != Opcodes.IRETURN) {
                        throw new UnsupportedOperationException();
                    }
                    return Opcodes.RETURN;
                case BOOLEAN:
                case BYTE:
                case CHAR:
                case SHORT:
                case INT:
                    return opcode;
                case FLOAT:
                    return opcode + (Opcodes.FRETURN - Opcodes.IRETURN);
                case LONG:
                    return opcode + (Opcodes.LRETURN - Opcodes.IRETURN);
                case DOUBLE:
                    return opcode + (Opcodes.DRETURN - Opcodes.IRETURN);
                case ARRAY:
                case OBJECT:
                case INTERNAL:
                    if (opcode != Opcodes.ILOAD && opcode != Opcodes.ISTORE && opcode != Opcodes.IRETURN) {
                        throw new UnsupportedOperationException();
                    }
                    return opcode + (Opcodes.ARETURN - Opcodes.IRETURN);
                case METHOD:
                    throw new UnsupportedOperationException();
                default:
                    throw new AssertionError();
            }
        }
    }
}
```

示例代码：

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.util.Printer;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Type t = Type.FLOAT_TYPE;

        int[] opcodes = new int[]{
                Opcodes.IALOAD,
                Opcodes.IASTORE,
                Opcodes.ILOAD,
                Opcodes.ISTORE,
                Opcodes.IADD,
                Opcodes.ISUB,
                Opcodes.IRETURN,
        };

        for (int oldOpcode : opcodes) {
            int newOpcode = t.getOpcode(oldOpcode);

            String oldName = Printer.OPCODES[oldOpcode];
            String newName = Printer.OPCODES[newOpcode];

            System.out.printf("%-7s --- %-7s%n", oldName, newName);
        }
    }
}
```

输出结果：

```text
IALOAD  --- FALOAD
IASTORE --- FASTORE
ILOAD   --- FLOAD
ISTORE  --- FSTORE
IADD    --- FADD
ISUB    --- FSUB
IRETURN --- FRETURN
```



## 总结

本文主要对 `Type` 类进行了介绍，内容总结如下：

- 第一点，`Type` 类的作用是什么？ `Type` 类是一个工具类，它的一个主要目的是将 Java 语言当中的概念转换成 ClassFile 当中的概念。
- 第二点，学习 `Type` 类的方式就是“分而治之”。在 `Type` 类当中，定义了许多的字段和方法，它们是一个整体，内容也很繁杂；于是，我们将 `Type` 类分成不同的部分来讲解，就是希望大家能循序渐进的理解这个类的各个部分，方便以后对该类的使用。

当然，也不要求大家一下子把这个类的内容全部掌握，因为这里面的很多方法都是和 ClassFile 的结构密切相关的；如果大家对于 ClassFile 的结构不太了解，那么理解这些方法也会有一定的困难。总的来说，希望大家在以后使用的过程中，对这些方法慢慢熟悉起来。
