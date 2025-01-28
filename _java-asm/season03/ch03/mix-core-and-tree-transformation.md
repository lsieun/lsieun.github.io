---
title: "混合使用Core API和Tree API进行类转换"
sequence: "305"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

混合使用Core API和Tree API进行类转换，要分成两种情况：

- 第一种情况，先是Core API处理，然后使用Tree API处理。
- 第二种情况，先是Tree API处理，然后使用Core API处理。

先来说第一种情况，先前是Core API，接着用Tree API进行处理，对“类”和“方法”进行转换：

- ClassVisitor --> ClassNode --> ClassTransformer/MethodTransformer --> 回归Core API
- MethodVisitor --> MethodNode --> MethodTransformer --> 回归Core API

再来说第二种情况，先前是Tree API，接着用Core API进行处理，对“类”和“方法”进行转换：

- ClassNode --> ClassVisitor --> 回归Tree API
- MethodNode --> MethodVisitor --> 回归Tree API

## 类层面：ClassVisitor和ClassNode

假如有`HelloWorld`类，内容如下：

```java
public class HelloWorld {
    public int intValue;
}
```

我们的预期目标：使用Core API添加一个`String strValue`字段，使用Tree API添加一个`Object objValue`字段。

### 先Core API后Tree API

思路：

```text
ClassReader --> ClassVisitor（Core API，添加strValue字段） --> ClassNode（Tree API，添加objValue字段） --> ClassWriter
```

代码片段：

```text
int api = Opcodes.ASM9;
ClassNode cn = new ClassAddFieldNode(api, cw, Opcodes.ACC_PUBLIC, "objValue", "Ljava/lang/Object;");
ClassVisitor cv = new ClassAddFieldVisitor(api, cn, Opcodes.ACC_PUBLIC, "strValue", "Ljava/lang/String;");

int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cv, parsingOptions);
```

### 先Tree API后Core API

思路：

```text
ClassReader --> ClassNode（Tree API，添加objValue字段） --> ClassVisitor（Core API，添加strValue字段） --> ClassWriter
```

代码片段：

```text
int api = Opcodes.ASM9;
ClassVisitor cv = new ClassAddFieldVisitor(api, cw, Opcodes.ACC_PUBLIC, "strValue", "Ljava/lang/String;");
ClassNode cn = new ClassAddFieldNode(api, cv, Opcodes.ACC_PUBLIC, "objValue", "Ljava/lang/Object;");

int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
cr.accept(cn, parsingOptions);
```

## 方法层面：MethodVisitor和MethodNode

### 先Core API后Tree API

思路：

```text
MethodVisitor(Core API) --> MethodNode(Tree API) --> MethodVisitor(Core API)
```

编码实现：

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.tree.*;

import static org.objectweb.asm.Opcodes.*;

public class MixCore2TreeVisitor extends ClassVisitor {
    public MixCore2TreeVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !"<init>".equals(name) && !"<clinit>".equals(name)) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                mv = new MethodEnterNode(api, access, name, descriptor, signature, exceptions, mv);
            }
        }
        return mv;
    }

    private static class MethodEnterNode extends MethodNode {
        public MethodEnterNode(int api, int access, String name, String descriptor,
                               String signature, String[] exceptions,
                               MethodVisitor mv) {
            super(api, access, name, descriptor, signature, exceptions);
            this.mv = mv;
        }

        @Override
        public void visitEnd() {
            // 首先，处理自己的代码逻辑
            InsnList il = new InsnList();
            il.add(new FieldInsnNode(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;"));
            il.add(new LdcInsnNode("Method Enter"));
            il.add(new MethodInsnNode(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false));
            instructions.insert(il);

            // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
            super.visitEnd();

            // 最后，向后续MethodVisitor传递
            if (mv != null) {
                accept(mv);
            }
        }
    }
}
```

进行转换：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new MixCore2TreeVisitor(api, cw);

        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 先Tree API后Core API

思路：

```text
MethodNode(Tree API) --> MethodVisitor(Core API) --> MethodNode(Tree API)
```

编码实现：

```java
import lsieun.asm.template.MethodEnteringAdapter;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodNode;

public class MixTree2CoreNode extends ClassNode {
    public MixTree2CoreNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        int size = methods.size();
        for (int i = 0; i < size; i++) {
            MethodNode mn = methods.get(i);
            if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) {
                continue;
            }
            InsnList instructions = mn.instructions;
            if (instructions.size() == 0) {
                continue;
            }

            int api = Opcodes.ASM9;
            MethodNode newMethodNode = new MethodNode(api, mn.access, mn.name, mn.desc, mn.signature, mn.exceptions.toArray(new String[0]));
            MethodVisitor mv = new MethodEnteringAdapter(api, newMethodNode, mn.access, mn.name, mn.desc);
            mn.accept(mv);
            methods.set(i, newMethodNode);
        }

        // 其次，调用父类的方法实现（根据实际情况，选择保留，或删除）
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }
}
```

进行转换：

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
        ClassNode cn = new MixTree2CoreNode(api, cw);

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，混合使用Core API和Tree API，分成两种情况，一种是从Core API到Tree API，另一种是从Tree API到Core API。
- 第二点，这种混合使用又常体现在两个层面：类层面和方法层面。

其中，Core API和Tree API是从ASM的角度来进行区分，而类层面和方法层面是一个`ClassFile`的结构来划分。

在混合使用Core API和Tree API的初期，可能会觉得无从下手，这个时候可以让思路慢下来：

- 首先，思考一下当前是在什么位置。
- 其次，思考一下将要去往什么位置。
- 最后，逐步补充中间需要的步骤就可以了。
