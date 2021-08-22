---
title:  "MethodNode介绍"
sequence: "203"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## MethodNode

### class info

```java
public class MethodNode extends MethodVisitor {
}
```

### fields

```java
public class MethodNode extends MethodVisitor {
    public int access;
    public String name;
    public String desc;
    public String signature;
    public List<String> exceptions;

    public InsnList instructions;
    public List<TryCatchBlockNode> tryCatchBlocks;
    public int maxStack;
    public int maxLocals;
}
```

### constructors

```java
public class MethodNode extends MethodVisitor {
    public MethodNode() {
        this(Opcodes.ASM9);
        if (getClass() != MethodNode.class) {
            throw new IllegalStateException();
        }
    }

    public MethodNode(final int api) {
        super(api);
        this.instructions = new InsnList();
    }

    public MethodNode(int access, String name, String descriptor, String signature, String[] exceptions) {
        this(Opcodes.ASM9, access, name, descriptor, signature, exceptions);
        if (getClass() != MethodNode.class) {
            throw new IllegalStateException();
        }
    }

    public MethodNode(int api, int access, String name, String descriptor, String signature, String[] exceptions) {
        super(api);
        this.access = access;
        this.name = name;
        this.desc = descriptor;
        this.signature = signature;
        this.exceptions = Util.asArrayList(exceptions);
        
        this.tryCatchBlocks = new ArrayList<>();
        this.instructions = new InsnList();
    }
}
```

### methods

```java
public class MethodNode extends MethodVisitor {
}
```

