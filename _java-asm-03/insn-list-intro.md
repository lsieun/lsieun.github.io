---
title:  "InsnList介绍"
sequence: "204"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## AbstractInsnNode

```java
public abstract class AbstractInsnNode {
    protected int opcode;

    AbstractInsnNode previousInsn;
    AbstractInsnNode nextInsn;

    int index;

    protected AbstractInsnNode(final int opcode) {
        this.opcode = opcode;
        this.index = -1;
    }

    public int getOpcode() {
        return opcode;
    }

    public abstract int getType();

    public AbstractInsnNode getPrevious() {
        return previousInsn;
    }

    public AbstractInsnNode getNext() {
        return nextInsn;
    }

    public abstract void accept(MethodVisitor methodVisitor);
}
```

An `InsnList` is a doubly linked list of instructions,
whose links are stored in the `AbstractInsnNode` objects themselves.
This point is extremely important because it has many consequences on the way
instruction objects and instruction lists must be used:

- An `AbstractInsnNode` object cannot appear more than once in an instruction list.
- An `AbstractInsnNode` object cannot belong to several instruction lists at the same time.
- As a consequence, adding an `AbstractInsnNode` to a list requires removing it from the list to which it belonged, if any.
- As another consequence, adding all the elements of a list into another one clears the first list.

The `AbstractInsnNode` class is the super class of the classes that represent bytecode instructions.
Its public API is the following:



## InsnList

```java
public class InsnList implements Iterable<AbstractInsnNode> {
}
```

