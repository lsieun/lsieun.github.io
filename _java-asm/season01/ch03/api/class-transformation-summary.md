---
title: "本章内容总结"
sequence: "313"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在本章当中，从 Core API 的角度来说（第二个层次），我们介绍了 `asm.jar` 当中的 `ClassReader` 和 `Type` 两个类；同时，从应用的角度来说（第一个层次），我们也介绍了 Class Transformation 的原理和示例。

![ASM 的学习层次 ](/assets/images/java/asm/asm-study-three-levels.png)

## Class Transformation 的原理

在 Class Transformation 的过程中，主要使用到了 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 三个类；其中 `ClassReader` 类负责“读”Class，`ClassWriter` 负责“写”Class，而 `ClassVisitor` 则负责进行“转换”（Transformation）。

![ 多个 ClassVisitor 串联到一起 ](/assets/images/java/asm/multiple-class-vistors-connected.png)

在 Java ASM 当中，Class Transformation 的本质就是利用了“中间人攻击”的方式来实现对已有的 Class 文件进行修改或转换。

![Man-in-the-middle attack](/assets/images/network/man-in-the-middle-attack.png)

详细的来说，我们自己定义的 `ClassVisitor` 类就是一个“中间人”，那么这个“中间人”可以做什么呢？可以做三种类型的事情：

- 对“原有的信息”进行篡改，就可以实现“修改”的效果。对应到 ASM 代码层面，就是对 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 的参数值进行修改。
- 对“原有的信息”进行扔掉，就可以实现“删除”的效果。对应到 ASM 代码层面，将原本的 `FieldVisitor` 和 `MethodVisitor` 对象实例替换成 `null` 值，或者对原本的一些 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 方法不去调用了。
- 伪造一条“新的信息”，就可以实现“添加”的效果。对应到 ASM 代码层面，就是在原来的基础上，添加一些对于 `ClassVisitor.visitXxx()` 和 `MethodVisitor.visitXxx()` 方法的调用。

## ASM 能够做哪些转换操作

### 类层面的修改

在类层面所做的修改，主要是通过 `ClassVisitor` 类来完成。我们将类层面可以修改的信息，分成以下三个方面：

- 类自身信息：修改当前类、父类、接口的信息，通过 `ClassVisitor.visit()` 方法实现。
- 字段：添加一个新的字段、删除已有的字段，通过 `ClassVisitor.visitField()` 方法实现。
- 方法：添加一个新的方法、删除已有的方法，通过 `ClassVisitor.visitMethod()` 方法实现。

```java
public class HelloWorld extends Object implements Cloneable {
    public int intValue;
    public String strValue;

    public int add(int a, int b) {
        return a + b;
    }

    public int sub(int a, int b) {
        return a - b;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

为了让大家更明确的知道需要修改哪一个 `visitXxx()` 方法的参数，我们做了如下总结：

- `ClassVisitor.visit(int version, int access, String name, String signature, String superName, String[] interfaces)`
    - `version`: 修改当前 Class 版本的信息
    - `access`: 修改当前类的访问标识（access flag）信息。
    - `name`: 修改当前类的名字。
    - `signature`: 修改当前类的泛型信息。
    - `superName`: 修改父类。
    - `interfaces`: 修改接口信息。
- `ClassVisitor.visitField(int access, String name, String descriptor, String signature, Object value)`
    - `access`: 修改当前字段的访问标识（access flag）信息。
    - `name`: 修改当前字段的名字。
    - `descriptor`: 修改当前字段的描述符。
    - `signature`: 修改当前字段的泛型信息。
    - `value`: 修改当前字段的常量值。
- `ClassVisitor.visitMethod(int access, String name, String descriptor, String signature, String[] exceptions)`
    - `access`: 修改当前方法的访问标识（access flag）信息。
    - `name`: 修改当前方法的名字。
    - `descriptor`: 修改当前方法的描述符。
    - `signature`: 修改当前方法的泛型信息。
    - `exceptions`: 修改当前方法可以招出的异常信息。

再有，**如何删除一个字段或者方法呢？**其实很简单，我们只要让中间的某一个 `ClassVisitor` 在遇到该字段或方法时，不向后传递就可以了。在具体的代码实现上，我们只要让 `visitField()` 或 `visitMethod()` 方法返回一个 `null` 值就可以了。

![ 多个 FieldVisitor 和 MethodVisitor 串联到一起 ](/assets/images/java/asm/multiple-field-method-vistors-connected.png)

最后，**如何添加一个字段或方法呢？**我们只要让中间的某一个 `ClassVisitor` 向后多传递一个字段和方法就可以了。在具体的代码实现上，我们是在 `visitEnd()` 方法完成对字段或方法的添加，而不是在 `visitField()` 或 `visitMethod()` 当中添加。因为我们要避免“一个类里有重复的字段和方法出现”，在 `visitField()` 或 `visitMethod()` 方法中，我们要判断该字段或方法是否已经存在；如果该字段或方法不存在，那我们就在 `visitEnd()` 方法进行添加；如果该字段或方法存在，那么我们就不需要在 `visitEnd()` 方法中添加了。

### 方法体层面的修改

在方法体层面所做的修改，主要是通过 `MethodVisitor` 类来完成。

在方法体层面的修改，更准确的地说，就是对方法体内包含的 Instruction 进行修改。就像数据库的操作“增删改查”一样，我们也可以对 Instruction 进行添加、删除、修改和查找。

为了让大家更直观的理解，我们假设有如下代码：

```java
public class HelloWorld {
    public int test(String name, int age) {
        int hashCode = name.hashCode();
        hashCode = hashCode + age * 31;
        return hashCode;
    }
}
```

其中，`test()` 方法的方法体包含的 Instruction 内容如下：

```text
  public test(Ljava/lang/String;I)I
    ALOAD 1
    INVOKEVIRTUAL java/lang/String.hashCode ()I
    ISTORE 3
    ILOAD 3
    ILOAD 2
    BIPUSH 31
    IMUL
    IADD
    ISTORE 3
    ILOAD 3
    IRETURN
    MAXSTACK = 3
    MAXLOCALS = 4
```

有的时候，我们想实现某个功能，但是感觉无从下手。这个时候，我们需要解决两个问题。第一个问题，就是要明确需要修改什么？第二个问题，就是“定位”方法，也就是要使用哪个方法进行修改。我们可以结合这两个问题，和下面的示例应用来理解。

- 添加
    - 在“方法进入”时和“方法退出”时，
        - 打印方法参数和返回值
        - 方法计时
- 删除
    - 移除 `NOP`
    - 移除打印语句、加零、字段赋值
    - 清空方法体
- 修改
    - 替换方法调用（静态方法和非静态方法）
- 查找
    - 当前方法调用了哪些方法
    - 当前方法被哪些方法所调用

由于 `MethodVisitor` 类里定义了很多的 `visitXxxInsn()` 方法，我们就不详细介绍了。但是，大家可以的看一下 [asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf) 的一段描述：

Methods can be transformed, i.e. by using a method adapter that forwards the method calls it receives with some modifications:

- changing arguments can be used to change individual instructions,
- not forwarding a received call removes an instruction,
- and inserting calls between the received ones adds new instructions.

需要要注意一点：**无论是添加 instruction，还是删除 instruction，还是要替换 instruction，都要保持 operand stack 修改前和修改后是一致的**。

## 总结

本文内容总结如下：

- 第一点，希望大家可以理解 Class Transformation 的原理。
- 第二点，在 Class Transformation 中，ASM 究竟能够帮助我们修改哪些信息。

