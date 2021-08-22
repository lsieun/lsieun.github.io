---
title:  "Tree Based Class Transformation"
sequence: "301"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## 如何进行转换

```java
import org.objectweb.asm.tree.ClassNode;

public class ClassTransformer {
    protected ClassTransformer ct;

    public ClassTransformer(ClassTransformer ct) {
        this.ct = ct;
    }

    public void transform(ClassNode cn) {
        if (ct != null) {
            ct.transform(cn);
        }
    }
}
```

## accept方法

### 从Core API到Tree API

### 从Tree API到Core API

## Two common patterns

It is also possible to use a **tree based class transformer** like a class adapter with the core API.
Two common patterns are used for that.

### First Pattern

The first one uses inheritance:

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;

public class MyClassNode extends ClassNode {
    public MyClassNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // put your transformation code here
        super.visitEnd();

        accept(cv);
    }
}
```

When this class adapter is used in a classical transformation chain:

```text
ClassWriter cw = new ClassWriter(0);
ClassVisitor cv = new MyClassNode(cw);
ClassReader cr = new ClassReader(...);
cr.accept(cv, 0);
byte[] b = cw.toByteArray();
```

### Second Pattern

The second pattern uses delegation instead of inheritance:

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.ClassNode;

public class MyClassVisitor extends ClassVisitor {
    private final ClassVisitor next;
    public MyClassVisitor(int api, ClassVisitor classVisitor) {
        super(api, new ClassNode());
        this.next = classVisitor;
    }

    @Override
    public void visitEnd() {
        super.visitEnd();
        ClassNode cn = (ClassNode) cv;
        // put your transformation code here
        cn.accept(next);
    }
}
```


