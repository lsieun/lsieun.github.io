---
title: "Tree Based Method Transformation"
sequence: "303"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在在ASM的官方文档（[asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf)）中，对Tree-Based Transformation分成了两个不同的层次：

- 类层面
- 方法层面

```text
                                                ┌─── ClassTransformer
                             ┌─── ClassNode ────┤
                             │                  └─── Two Common Patterns
Tree-Based Transformation ───┤
                             │                  ┌─── MethodTransformer
                             └─── MethodNode ───┤
                                                └─── Two Common Patterns
```

为什么没有“字段层面”呢？主要是因为字段的处理比较简单；而方法的处理则要复杂很多，方法有方法头（method header）和方法体（method body），方法体里有指令（`InsnList`）和异常处理的逻辑（`TryCatchBlockNode`），有足够的理由成为一个单独的讨论话题。

值得一提的是，对于Tree-Based Transformation来说，类层面和方法层面，两者虽然在使用细节上有差异，但在“整体的处理思路”上有非常大的相似性。

## MethodTransformer

```java
import org.objectweb.asm.tree.MethodNode;

public class MethodTransformer {
    protected MethodTransformer mt;

    public MethodTransformer(MethodTransformer mt) {
        this.mt = mt;
    }

    public void transform(MethodNode mn) {
        if (mt != null) {
            mt.transform(mn);
        }
    }
}
```

## Two Common Patterns

### First Pattern

```java
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.tree.MethodNode;

public class MyMethodNode extends MethodNode {
    public MyMethodNode(int access, String name, String descriptor,
                        String signature, String[] exceptions,
                        MethodVisitor mv) {
        super(access, name, descriptor, signature, exceptions);
        this.mv = mv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        // put your transformation code here

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续MethodVisitor传递
        if (mv != null) {
            accept(mv);
        }
    }
}
```

### Second Pattern

```java
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.tree.MethodNode;

public class MyMethodAdapter extends MethodVisitor {
    private final MethodVisitor next;

    public MyMethodAdapter(int api, int access, String name, String desc,
                           String signature, String[] exceptions, MethodVisitor mv) {
        super(api, new MethodNode(access, name, desc, signature, exceptions));
        this.next = mv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        MethodNode mn = (MethodNode) mv;
        // put your transformation code here

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (next != null) {
            mn.accept(next);
        }
    }
}
```



## 编写代码的习惯

在这里，主要是讲使用`MethodNode`进行Tree-Based Transformation过程中经常使用的编码习惯：

- 在遍历`InsnList`的过程当中，对instruction进行修改。
- 当需要添加多个instruction时，可以创建一个临时的`InsnList`，作为一个整体加入到方法当中。

Transforming a method with the tree API simply consists in modifying the fields of a `MethodNode` object, and in particular the `instructions` list.

### modify it while iterating

Although this list can be modified in arbitrary ways,
**a common pattern is to modify it while iterating over it.**

Indeed, unlike with the general `ListIterator` contract,
the `ListIterator` returned by an `InsnList` supports many concurrent list modifications.

In fact, you can use the `InsnList` methods to **remove** one or more elements before and including the current one,
to **remove** one or more elements after the next element(i.e. not just after the current element, but after its successor),
or to **insert** one or more elements before the current one or after its successor.
These changes will be reflected in the iterator, i.e. the elements inserted (resp. removed) after the next element will be seen (resp. not seen) in the iterator.

### temporary instruction list

Another common pattern to modify an instruction list,
when you need to insert several instructions after an instruction `i` inside a list, is
- to add these new instructions in a **temporary instruction list**,
- and to insert **this temporary list** inside the main one in one step

```text
InsnList il = new InsnList();
il.add(...);
...
il.add(...);
mn.instructions.insert(i, il);
```

Inserting the instructions one by one is also possible but more cumbersome,
because the insertion point must be updated after each insertion.

## 总结

本文内容总结如下：

- 第一点，对方法进行转换的时，经常使用的两种模式。
- 第二点，引入`MethodTransformer`类，它帮助进行转换具体的方法。
- 第三点，在处理`InsnList`时，经常遵循的编码习惯。

