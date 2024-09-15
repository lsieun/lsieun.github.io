---
title: "ASM 的 MethodVisitor 类"
sequence: "103"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})


使用 ASM，可以生成一个 `.class` 文件当中各个部分的内容。

```java
public class HelloWorld {
    public void test(String name, int age) {
        String line = String.format("name = '%s', age = %d", name, age);
        System.out.println(line);
    }
}
```

在这里，我们只关心方法的部分：

- 对于方法头的部分，我们可以使用 `ClassVisitor.visitMethod(int access, String name, String descriptor, String signature, String[] exceptions)` 方法来提供。
  - 其中的 `access` 参数提供访问标识信息，例如 `public`
  - 其中的 `name` 参数提供方法的名字，例如 `test`
  - 其中的 `descriptor` 参数提供方法的参数类型和返回值的类型
- 对于方法体的部分，我们可能通过使用 `MethodVisitor` 类来实现。
  - 如何得到一个 `MethodVisitor` 对象呢？`ClassVisitor.visitMethod()` 的返回值是一个 `MethodVisitor` 类型的实例。
  - 方法体的 instructions 是如何添加的呢？通过调用 `MethodVisitor.visitXxxInsn()` 方法来提供的

对于 `MethodVisitor` 类来说，我们从两个方面来把握：

- 第一方面，就是 `MethodVisitor` 类的 `visitXxx()` 方法的调用顺序。
- 第二方面，就是 `MethodVisitor` 类的 `visitXxxInsn()` 方法具体有哪些。

注意：`visitXxx()` 方法表示 `MethodVisitor` 类当中所有以 `visit` 开头的方法，包含的方法比较多；
而 `visitXxxInsn()` 方法是 `visitXxx()` 方法当中的一小部分，包含的方法比较较少。

## 方法的调用顺序

`MethodVisitor` 类的 `visitXxx()` 方法要遵循一定的调用顺序：

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

- 第一步，调用 `visitCode()` 方法，调用一次。
- 第二步，调用 `visitXxxInsn()` 方法，可以调用多次。对这些方法的调用，就是在构建方法的“方法体”。
- 第三步，调用 `visitMaxs()` 方法，调用一次。
- 第四步，调用 `visitEnd()` 方法，调用一次。

## visitXxxInsn()方法

粗略的来说，`MethodVisitor` 类有 15 个 `visitXxxInsn()` 方法。
但严格的来说，有 13 个 `visitXxxInsn()` 方法，再加上 `visitLabel()` 和 `visitTryCatchBlock()` 这 2 个方法。

那么，这 15 个 `visitXxxInsn()` 方法，可以用来生成将近 200 个左右的 opcode，也就是用来生成方法体的内容。

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
    // (9) 这里并不是严格的 visitXxxInsn()方法
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
    // (15) 这里也并不是严格的 visitXxxInsn()方法
    public void visitTryCatchBlock(Label start, Label end, Label handler, String type);
}
```

## 总结

本文主要是对 ASM 中 `MethodVisitor` 类进行回顾，内容总结如下：

- 第一点，`MethodVisitor` 类的 `visitXxx()` 方法要遵循一定的调用顺序。
- 第二点，`MethodVisitor` 类有 15 个 `visitXxxInsn()` 方法，用来生成将近 200 个左右的 opcode。
