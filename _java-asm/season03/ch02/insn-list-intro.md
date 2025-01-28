---
title: "InsnList介绍"
sequence: "204"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## InsnList

### class info

第一个部分，`InsnList`类实现了`Iterable<AbstractInsnNode>`接口。

- 从含义上来说，`InsnList`类表示一个有序的指令集合，而`AbstractInsnNode`则表示单条指令。
- 从结构上来说，`InsnList`类是一个存储`AbstractInsnNode`的双向链表。

```java
public class InsnList implements Iterable<AbstractInsnNode> {
}
```

我们可以使用foreach语句对`InsnList`对象进行循环：

```text
ClassNode cn = new ClassNode();
// ...
MethodNode mn = cn.methods.get(0);
InsnList instructions = mn.instructions;
for (AbstractInsnNode insn : instructions) {
    System.out.println(insn);
}
```

### fields

第二个部分，`InsnList`类定义的字段有哪些。

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    private int size;

    private AbstractInsnNode firstInsn;
    private AbstractInsnNode lastInsn;

    // A cache of the instructions of this list.
    // This cache is used to improve the performance of the get method.
    AbstractInsnNode[] cache;
}
```

### constructors

第三个部分，`InsnList`类定义的构造方法有哪些。

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    // 没有提供
}
```

### methods

第四个部分，`InsnList`类定义的方法有哪些。

#### getter方法

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public int size() {
        return size;
    }

    public AbstractInsnNode getFirst() {
        return firstInsn;
    }

    public AbstractInsnNode getLast() {
        return lastInsn;
    }

    public AbstractInsnNode get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        if (cache == null) {
            cache = toArray();
        }
        return cache[index];
    }

    public AbstractInsnNode[] toArray() {
        int currentInsnIndex = 0;
        AbstractInsnNode currentInsn = firstInsn;
        AbstractInsnNode[] insnNodeArray = new AbstractInsnNode[size];
        while (currentInsn != null) {
            insnNodeArray[currentInsnIndex] = currentInsn;
            currentInsn.index = currentInsnIndex++;
            currentInsn = currentInsn.nextInsn;
        }
        return insnNodeArray;
    }
}
```

#### accept方法

在`InsnList`中，`accept`方法的作用就是将其包含的指令全部发送给下一个`MethodVisitor`对象。

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public void accept(MethodVisitor methodVisitor) {
        AbstractInsnNode currentInsn = firstInsn;
        while (currentInsn != null) {
            currentInsn.accept(methodVisitor);
            currentInsn = currentInsn.nextInsn;
        }
    }
}
```

## 方法分类

在下面所介绍的方法也都是`InsnList`所定义的方法，我们把它们单独的拿出来有两点原因：一是内容确实比较多，二是为了分成不同的类别以方便记忆。

我们将这些方法分成“遍历－增加－删除－修改－查询”共五个类别。

### 遍历

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public ListIterator<AbstractInsnNode> iterator() {
        return iterator(0);
    }

    public ListIterator<AbstractInsnNode> iterator(int index) {
        return new InsnListIterator(index);
    }
}
```

由于`InsnList`类实现了`Iterable`接口，我们可以直接对`InsnList`类进行foreach遍历：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        // 读取字节数组byte[]
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        // 将byte[]转换成ClassNode
        ClassReader cr = new ClassReader(bytes);
        ClassNode cn = new ClassNode(Opcodes.ASM9);
        cr.accept(cn, ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES);

        // 遍历InsnList
        InsnList instructions = cn.methods.get(0).instructions;
        for (AbstractInsnNode insn : instructions) {
            System.out.println(insn);
        }
    }
}
```

### 增加：开头

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public void insert(AbstractInsnNode insnNode) {
        ++size;
        if (firstInsn == null) {
            firstInsn = insnNode;
            lastInsn = insnNode;
        } else {
            firstInsn.previousInsn = insnNode;
            insnNode.nextInsn = firstInsn;
        }
        firstInsn = insnNode;
        cache = null;
        insnNode.index = 0; // insnNode now belongs to an InsnList.
    }

    public void insert(InsnList insnList) {
        if (insnList.size == 0) {
            return;
        }
        size += insnList.size;
        if (firstInsn == null) {
            firstInsn = insnList.firstInsn;
            lastInsn = insnList.lastInsn;
        } else {
            AbstractInsnNode lastInsnListElement = insnList.lastInsn;
            firstInsn.previousInsn = lastInsnListElement;
            lastInsnListElement.nextInsn = firstInsn;
            firstInsn = insnList.firstInsn;
        }
        cache = null;
        insnList.removeAll(false);
    }
}
```

### 增加：结尾

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public void add(AbstractInsnNode insnNode) {
        ++size;
        if (lastInsn == null) {
            firstInsn = insnNode;
            lastInsn = insnNode;
        } else {
            lastInsn.nextInsn = insnNode;
            insnNode.previousInsn = lastInsn;
        }
        lastInsn = insnNode;
        cache = null;
        insnNode.index = 0; // insnNode now belongs to an InsnList.
    }

    public void add(InsnList insnList) {
        if (insnList.size == 0) {
            return;
        }
        size += insnList.size;
        if (lastInsn == null) {
            firstInsn = insnList.firstInsn;
            lastInsn = insnList.lastInsn;
        } else {
            AbstractInsnNode firstInsnListElement = insnList.firstInsn;
            lastInsn.nextInsn = firstInsnListElement;
            firstInsnListElement.previousInsn = lastInsn;
            lastInsn = insnList.lastInsn;
        }
        cache = null;
        insnList.removeAll(false);
    }
}
```

### 增加：插队

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public void insert(AbstractInsnNode previousInsn, AbstractInsnNode insnNode) {
        ++size;
        AbstractInsnNode nextInsn = previousInsn.nextInsn;
        if (nextInsn == null) {
            lastInsn = insnNode;
        } else {
            nextInsn.previousInsn = insnNode;
        }
        previousInsn.nextInsn = insnNode;
        insnNode.nextInsn = nextInsn;
        insnNode.previousInsn = previousInsn;
        cache = null;
        insnNode.index = 0; // insnNode now belongs to an InsnList.
    }

    public void insert(AbstractInsnNode previousInsn, InsnList insnList) {
        if (insnList.size == 0) {
            return;
        }
        size += insnList.size;
        AbstractInsnNode firstInsnListElement = insnList.firstInsn;
        AbstractInsnNode lastInsnListElement = insnList.lastInsn;
        AbstractInsnNode nextInsn = previousInsn.nextInsn;
        if (nextInsn == null) {
            lastInsn = lastInsnListElement;
        } else {
            nextInsn.previousInsn = lastInsnListElement;
        }
        previousInsn.nextInsn = firstInsnListElement;
        lastInsnListElement.nextInsn = nextInsn;
        firstInsnListElement.previousInsn = previousInsn;
        cache = null;
        insnList.removeAll(false);
    }

    public void insertBefore(AbstractInsnNode nextInsn, AbstractInsnNode insnNode) {
        ++size;
        AbstractInsnNode previousInsn = nextInsn.previousInsn;
        if (previousInsn == null) {
            firstInsn = insnNode;
        } else {
            previousInsn.nextInsn = insnNode;
        }
        nextInsn.previousInsn = insnNode;
        insnNode.nextInsn = nextInsn;
        insnNode.previousInsn = previousInsn;
        cache = null;
        insnNode.index = 0; // insnNode now belongs to an InsnList.
    }

    public void insertBefore(AbstractInsnNode nextInsn, InsnList insnList) {
        if (insnList.size == 0) {
            return;
        }
        size += insnList.size;
        AbstractInsnNode firstInsnListElement = insnList.firstInsn;
        AbstractInsnNode lastInsnListElement = insnList.lastInsn;
        AbstractInsnNode previousInsn = nextInsn.previousInsn;
        if (previousInsn == null) {
            firstInsn = firstInsnListElement;
        } else {
            previousInsn.nextInsn = firstInsnListElement;
        }
        nextInsn.previousInsn = lastInsnListElement;
        lastInsnListElement.nextInsn = nextInsn;
        firstInsnListElement.previousInsn = previousInsn;
        cache = null;
        insnList.removeAll(false);
    }
}
```

### 删除

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public void remove(AbstractInsnNode insnNode) {
        --size;
        AbstractInsnNode nextInsn = insnNode.nextInsn;
        AbstractInsnNode previousInsn = insnNode.previousInsn;
        if (nextInsn == null) {
            if (previousInsn == null) {
                firstInsn = null;
                lastInsn = null;
            } else {
                previousInsn.nextInsn = null;
                lastInsn = previousInsn;
            }
        } else {
            if (previousInsn == null) {
                firstInsn = nextInsn;
                nextInsn.previousInsn = null;
            } else {
                previousInsn.nextInsn = nextInsn;
                nextInsn.previousInsn = previousInsn;
            }
        }
        cache = null;
        insnNode.index = -1; // insnNode no longer belongs to an InsnList.
        insnNode.previousInsn = null;
        insnNode.nextInsn = null;
    }

    void removeAll(boolean mark) {
        if (mark) {
            AbstractInsnNode currentInsn = firstInsn;
            while (currentInsn != null) {
                AbstractInsnNode next = currentInsn.nextInsn;
                currentInsn.index = -1; // currentInsn no longer belongs to an InsnList.
                currentInsn.previousInsn = null;
                currentInsn.nextInsn = null;
                currentInsn = next;
            }
        }
        size = 0;
        firstInsn = null;
        lastInsn = null;
        cache = null;
    }

    public void clear() {
        removeAll(false);
    }
}
```

### 修改

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public void set(AbstractInsnNode oldInsnNode, AbstractInsnNode newInsnNode) {
        // 处理与后续指令之间的关系
        AbstractInsnNode nextInsn = oldInsnNode.nextInsn;
        newInsnNode.nextInsn = nextInsn;
        if (nextInsn != null) {
            nextInsn.previousInsn = newInsnNode;
        } else {
            lastInsn = newInsnNode;
        }

        // 处理与前面指令之间的关系
        AbstractInsnNode previousInsn = oldInsnNode.previousInsn;
        newInsnNode.previousInsn = previousInsn;
        if (previousInsn != null) {
            previousInsn.nextInsn = newInsnNode;
        } else {
            firstInsn = newInsnNode;
        }
        
        // 新指令获取索引信息
        if (cache != null) {
            int index = oldInsnNode.index;
            cache[index] = newInsnNode;
            newInsnNode.index = index;
        } else {
            newInsnNode.index = 0; // newInsnNode now belongs to an InsnList.
        }
        
        // 旧指令移除索引信息
        oldInsnNode.index = -1; // oldInsnNode no longer belongs to an InsnList.
        oldInsnNode.previousInsn = null;
        oldInsnNode.nextInsn = null;
    }
}
```

### 查询

```java
public class InsnList implements Iterable<AbstractInsnNode> {
    public boolean contains(AbstractInsnNode insnNode) {
        AbstractInsnNode currentInsn = firstInsn;
        while (currentInsn != null && currentInsn != insnNode) {
            currentInsn = currentInsn.nextInsn;
        }
        return currentInsn != null;
    }

    public int indexOf(AbstractInsnNode insnNode) {
        if (cache == null) {
            cache = toArray();
        }
        return insnNode.index;
    }
}
```

## InsnList类的特点

An `InsnList` is a doubly linked list of instructions,
whose links are stored in the `AbstractInsnNode` objects themselves.
This point is extremely important because it has many consequences on the way
instruction objects and instruction lists must be used:

- An `AbstractInsnNode` object cannot appear more than once in an instruction list.
- An `AbstractInsnNode` object cannot belong to several instruction lists at the same time.
- As a consequence, adding an `AbstractInsnNode` to a list requires removing it from the list to which it belonged, if any.
- As another consequence, adding all the elements of a list into another one clears the first list.

## 总结

本文内容总结如下：

- 第一点，介绍`InsnList`类各个部分的信息。
- 第二点，对`InsnList`类中的方法进行分类，分成遍历、增、删、改、查五个类别，目的是方便从概括的角度来把握这些方法。
- 第三点，在`InsnList`类中，`AbstractInsnNode`表现出来的特点就是“一臣不能事二主”。
