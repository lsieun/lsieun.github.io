---
title:  "Intro"
sequence: "101"
---

## 研究主题

《Java ASM系列二：OPCODE》的研究主题是围绕着三个事物来展开：

- instruction
- `MethodVisitor.visitXxxInsn()`方法
- Stack Frame

更详细的来说，instruction、`MethodVisitor.visitXxxInsn()`方法和Stack Frame三个事物之间有内在的关联关系：

- 从一个具体`.class`文件的视角来说，它定义的每一个方法当中都包含实现代码逻辑的instruction内容。
- 从ASM的视角来说，它可以通过Class Generation或Class Transformation操作来输出一个具体的`.class`文件；那么，对于方法当中的instruction内容，应该使用哪些`MethodVisitor.visitXxxInsn()`方法来生成呢？
- 从JVM的视角来说，一个具体的`.class`文件需要加载到JVM当中来运行；在方法的运行过程当中，每一条instruction的执行，会对Stack Frame有哪些影响呢？

{:refdef: style="text-align: center;"}
![instruction-visitXxxInsn-StackFrame](/assets/images/java/asm/instruction-visitxxxinsn-stack-frame.png)
{: refdef}

在[The Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中，它对于具体`.class`文件提供了[ClassFile](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)结构的支持，对于JVM Execution Engine提供了[Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)的支持。在以后的学习当中，我们需要经常参照[Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)部分的内容。

## ClassFile对方法的约束

从ClassFile的角度来说，它对于方法接收的参数数量、方法体的大小做了约束。

### 方法参数的数量（255）

在一个方法当中，方法接收的参数最多有255个。我们分成三种情况来进行说明：

- 第一种情况，对于non-static方法来说，`this`也要占用1个参数位置，因此接收的参数最多有254个参数。
- 第二种情况，对于static方法来说，不需要存储`this`变量，因此接收的参数最多有255个参数。
- 第三种情况，不管是non-static方法，还是static方法，`long`类型或`double`类型占据2个参数位置，所以实际的参数数量要小于255。

```java
public class HelloWorld {
    public void test(int a, int b) {
        // do nothing
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 255; i++) {
            String item = String.format("int val%d,", i);
            System.out.println(item);
        }
    }
}
```

- 问题：能否在文档中找到依据呢？
- 回答：能。

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[4.11. Limitations of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.11)部分对方法参数的数量进行了限制：

The number of method parameters is limited to **255** by the definition of a method descriptor, where the limit includes one unit for `this` in the case of instance or interface method invocations.

### 方法体的大小（65535）

对于方法来说，方法体并不是想写多少代码就写多少代码，它的大小也有一个限制：方法体内最多包含65535个字节。

当方法体的代码超过65535字节（bytes）时，会出现编译错误：code too large。

- 问题：能否在文档中找到依据呢？
- 回答：能。

在[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[4.7.3. The Code Attribute](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.3)部分定义了`Code`属性：

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

- `code_length`: The value of the `code_length` item gives the number of bytes in the `code` array for this method. The value of `code_length` must be greater than **zero** (as the `code` array must not be empty) and less than **65536**.

## ASM中的MethodVisitor类

使用ASM，可以生成一个`.class`文件当中各个部分的内容。在这里，我们只需要关心方法的部分：

- 对于方法的参数信息，我们可以使用`ClassVisitor.visitMethod()`方法的`descriptor`参数来提供。
- 对于方法体的部分，我们可能通过使用`MethodVisitor`类来实现。

对于`MethodVisitor`类来说，我们从两个方面来把握它：

- 第一方面，就是`MethodVisitor`类的`visitXxx()`方法的调用顺序。
- 第二方面，就是`MethodVisitor`类的`visitXxxInsn()`方法具体有哪些。

### 方法的调用顺序

`MethodVisitor`类的`visitXxx()`方法要遵循一定的调用顺序：

```text
[
    visitCode
    (
        visitFrame |
        visitXxxInsn |
        visitLabel |
        visitTryCatchBlock
    )*
    visitMaxs
]
visitEnd
```

这些方法的调用顺序，可以记忆如下：

- 第一步，调用`visitCode()`方法，调用一次。
- 第二步，调用`visitXxxInsn()`方法，可以调用多次。对这些方法的调用，就是在构建方法的“方法体”。
- 第三步，调用`visitMaxs()`方法，调用一次。
- 第四步，调用`visitEnd()`方法，调用一次。

### visitXxxInsn()方法

概括的来说，`MethodVisitor`类有15个`visitXxxInsn()`方法。但严格的来说，有13个`visitXxxInsn()`方法，再加上`visitLabel()`和`visitTryCatchBlock()`这2个方法。

```java
public abstract class MethodVisitor {
    // (1)
    public void visitInsn(int opcode);
    // (2)
    public void visitIntInsn(int opcode, int operand);
    // (3)
    public void visitVarInsn(int opcode, int var);
    // (4)
    public void visitTypeInsn(int opcode, String type);
    // (5)
    public void visitFieldInsn(int opcode, String owner, String name, String descriptor);
    // (6)
    public void visitMethodInsn(int opcode, String owner, String name, String descriptor, boolean isInterface);
    // (7)
    public void visitInvokeDynamicInsn(String name, String descriptor, Handle bootstrapMethodHandle, Object... bootstrapMethodArguments);
    // (8)
    public void visitJumpInsn(int opcode, Label label);
    // (9) 这里并不是严格的visitXxxInsn()方法
    public void visitLabel(Label label);
    // (10)
    public void visitLdcInsn(Object value);
    // (11)
    public void visitIincInsn(int var, int increment);
    // (12)
    public void visitTableSwitchInsn(int min, int max, Label dflt, Label... labels);
    // (13)
    public void visitLookupSwitchInsn(Label dflt, int[] keys, Label[] labels);
    // (14)
    public void visitMultiANewArrayInsn(String descriptor, int numDimensions);
    // (15) 这里也并不是严格的visitXxxInsn()方法
    public void visitTryCatchBlock(Label start, Label end, Label handler, String type);
}
```

## JVM Stack Frame

当一个具体的`.class`加载到JVM当中之后，方法的执行会对应于JVM当中一个Stack Frame内存空间。

### 三个子区域

对于Stack Frame内存空间，主要分成三个子区域：

- 第一个子区域，operand stack，它的大小是由`Code`属性中的`max_stack`来决定的。
- 第二个子区域，local variables，它的大小是由`Code`属性中的`max_locals`来决定的。
- 第三个子区域，Frame Data，它用来存储与当前方法相关的数据。例如，方法内的instructions、一个指向runtime constant pool的引用、出现异常时的处理逻辑（exception table）。
  
在Frame Data当中，我们也列出了其中两个重要数据信息：

- 第一个数据，`instructions`，它表示指令集合，是由`Code`属性中的`code[]`解析之后的结果。
- 第二个数据，`ref`，它是一个指向runtime constant pool的引用。这个runtime constant pool是由具体`.class`文件中的constant pool解析之后的结果。

{:refdef: style="text-align: center;"}
![JVM Execution Model](/assets/images/java/asm/jvm-execution-model.png)
{: refdef}

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length];
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

### Stack Frame的变化

上面的内容，是从静态的视角来看Stack Frame的四个部分；接下来，我们从动态的视角来看一下Stack Frame的变化。

那么，这四个部分是怎么结合在一起的呢？当一个具体方法要执行时，其实就是方法里的instruction一条一条在执行：

- 第一步，获取instruction。每一条instruction都是从`instructions`内存空间中取出来的。
- 第二步，执行instruction。对于instruction的执行，就会引起operand stack和local variables的状态变化。
- 第三步，在执行instruction过程中，需要获取相关资源。通过`ref`可以获取runtime constant pool的“资源”，例如一个字符串的内容，一个指向方法的物理内存地址。

需要注意的是：虽然operand stack和local variables是Stack Frame当中两个最重要的结构；但是，instruction的执行，有80%（数字不准确）的情况涉及到operand stack，有20%（数字不准确）的情况会涉及到local variables。换句话说，instruction的执行，大部分的操作会涉及到operand stack，小部分的操作会涉及到local variables。大多数情况下，都是先把数据加载到operand stack上，在operand stack上进行运算，最后可能将数据存储到local variables当中。举个形象的例子，operand stack类似于“工作场所”，local variables类似于“临时休息区”。

### 数据类型的变化

在这里，我们要区分开两个概念：**存储时的类型** 和 **运行时的类型**。

将一个具体`.class`文件加载进JVM当中，存放数据的地方有两个主要区域：堆（Heap Area）和栈（Stack Area）。

- 在堆（Heap Area）上，存放的就是Actual type，就是“存储时的类型”。例如，`byte`类型就是占用1个byte，`int`类型就是占用4个byte。
- 在栈（Stack Area）上，更确切的说，就是Stack Frame当中的operand stack和local variables区域，存放的就是Computational type。这个时候，类型就发生了变化，`boolean`、`byte`、`char`、`short`都会被转换成`int`类型来进行计算。

举个例子，在一个类当中，有一个`byte`类型的字段。将该类加载进JVM当中，然后创建该类的对象实例，那么该对象实例是存储在堆（Heap Area）上的，其中的字段就是`byte`类型。当程序运行过程中，会使用到该对象的字段，这个时候就要将`byte`类型的值转换成`int`类型进行计算；计算完成之后，需要将值存储到该对象的字段当中，这个时候就会将`int`类型再转换成`byte`类型进行存储。

另外，对于Category为`1`的类型，在operand stack和local variables当中占用1个slot的位置；对于对于Category为`2`的类型，在operand stack和local variables当中占用2个slot的位置。

下表的内容是来自于[Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)的[Table 2.11.1-B. Actual and Computational types in the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.1-320)部分。

| Actual type | Computational type | Category |
|-------------|--------------------|----------|
| boolean     | int                | 1        |
| byte        | int                | 1        |
| char        | int                | 1        |
| short       | int                | 1        |
| int         | int                | 1        |
| float       | float              | 1        |
| reference   | reference          | 1        |
| long        | long               | 2        |
| double      | double             | 2        |


