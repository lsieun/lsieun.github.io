---
title: "SimpleVerifier示例：移除checkcast"
sequence: "408"
---

## 示例：移除不必要的转换

### 预期目标

```java
public class HelloWorld {
    public void test() {
        Object obj = "ABC";
        String val = (String) obj;
        System.out.println(val);
    }
}
```

我们可以使用`javap`指令查看`test`方法包含的instructions内容：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: ldc           #2                  // String ABC
       2: astore_1
       3: aload_1
       4: checkcast     #3                  // class java/lang/String
       7: astore_2
       8: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      11: aload_2
      12: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      15: return
}
```

我们想实现的目标：移除不必要的`checkcast`指令。

```text
test:()V
000:    ldc "ABC"                               {HelloWorld, ., .} | {}
001:    astore_1                                {HelloWorld, ., .} | {String}
002:    aload_1                                 {HelloWorld, String, .} | {}
003:    checkcast String                        {HelloWorld, String, .} | {String}
004:    astore_2                                {HelloWorld, String, .} | {String}
005:    getstatic System.out                    {HelloWorld, String, String} | {}
006:    aload_2                                 {HelloWorld, String, String} | {PrintStream}
007:    invokevirtual PrintStream.println       {HelloWorld, String, String} | {PrintStream, String}
008:    return                                  {HelloWorld, String, String} | {}
================================================================
```

### 编码实现

```java
import lsieun.asm.tree.transformer.MethodTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;

import static org.objectweb.asm.Opcodes.CHECKCAST;

public class RemoveUnusedCastNode extends ClassNode {
    public RemoveUnusedCastNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        MethodTransformer mt = new MethodRemoveUnusedCastTransformer(name, null);
        for (MethodNode mn : methods) {
            if ("<init>".equals(mn.name) || "<clinit>".equals(mn.name)) {
                continue;
            }
            InsnList insns = mn.instructions;
            if (insns.size() == 0) {
                continue;
            }
            mt.transform(mn);
        }

        // 其次，调用父类的方法实现
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class MethodRemoveUnusedCastTransformer extends MethodTransformer {
        private final String owner;

        public MethodRemoveUnusedCastTransformer(String owner, MethodTransformer mt) {
            super(mt);
            this.owner = owner;
        }

        @Override
        public void transform(MethodNode mn) {
            // 首先，处理自己的代码逻辑
            Analyzer<BasicValue> analyzer = new Analyzer<>(new SimpleVerifier());
            try {
                Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
                AbstractInsnNode[] insnNodes = mn.instructions.toArray();
                for (int i = 0; i < insnNodes.length; i++) {
                    AbstractInsnNode insn = insnNodes[i];
                    if (insn.getOpcode() == CHECKCAST) {
                        Frame<BasicValue> f = frames[i];
                        if (f != null && f.getStackSize() > 0) {
                            BasicValue operand = f.getStack(f.getStackSize() - 1);
                            Class<?> to = getClass(((TypeInsnNode) insn).desc);
                            Class<?> from = getClass(operand.getType());
                            if (to.isAssignableFrom(from)) {
                                mn.instructions.remove(insn);
                            }
                        }
                    }
                }
            }
            catch (AnalyzerException ex) {
                ex.printStackTrace();
            }

            // 其次，调用父类的方法实现
            super.transform(mn);
        }

        private static Class<?> getClass(String desc) {
            try {
                return Class.forName(desc.replace('/', '.'));
            }
            catch (ClassNotFoundException ex) {
                throw new RuntimeException(ex.toString());
            }
        }

        private static Class<?> getClass(Type t) {
            if (t.getSort() == Type.OBJECT) {
                return getClass(t.getInternalName());
            }
            return getClass(t.getDescriptor());
        }
    }
}
```

### 进行转换

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
        ClassNode cn = new RemoveUnusedCastNode(api, cw);

        //（4）结合ClassReader和ClassNode
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        // (5) 生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

### 验证结果

一方面，验证`test`方法的功能是否正常：

```java
import java.lang.reflect.Method;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("sample.HelloWorld");
        Object instance = clazz.newInstance();
        Method m = clazz.getDeclaredMethod("test");
        m.invoke(instance);
    }
}
```

另一方面，验证`test`方法是否包含`checkcast`指令：

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: ldc           #11                 // String ABC
       2: astore_1
       3: aload_1
       4: astore_2
       5: getstatic     #17                 // Field java/lang/System.out:Ljava/io/PrintStream;
       8: aload_2
       9: invokevirtual #23                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      12: return
}
```

## 解决方式二：使用Core API

这个实现主要是依赖于Core API当中介绍的`AnalyzerAdapter`类。

### 编码实现

```java
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.commons.AnalyzerAdapter;

import static org.objectweb.asm.Opcodes.*;

public class RemoveUnusedCastVisitor extends ClassVisitor {
    private String owner;

    public RemoveUnusedCastVisitor(int api, ClassVisitor classVisitor) {
        super(api, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces);
        this.owner = name;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
        if (mv != null && !name.equals("<init>")) {
            boolean isAbstractMethod = (access & ACC_ABSTRACT) != 0;
            boolean isNativeMethod = (access & ACC_NATIVE) != 0;
            if (!isAbstractMethod && !isNativeMethod) {
                RemoveUnusedCastAdapter adapter = new RemoveUnusedCastAdapter(api, mv);
                adapter.aa = new AnalyzerAdapter(owner, access, name, descriptor, adapter);
                return adapter.aa;
            }
        }

        return mv;
    }

    private static class RemoveUnusedCastAdapter extends MethodVisitor {
        public AnalyzerAdapter aa;

        public RemoveUnusedCastAdapter(int api, MethodVisitor methodVisitor) {
            super(api, methodVisitor);
        }

        @Override
        public void visitTypeInsn(int opcode, String type) {
            if (opcode == CHECKCAST) {
                Class<?> to = getClass(type);
                if (aa.stack != null && aa.stack.size() > 0) {
                    Object operand = aa.stack.get(aa.stack.size() - 1);
                    if (operand instanceof String) {
                        Class<?> from = getClass((String) operand);
                        if (to.isAssignableFrom(from)) {
                            return;
                        }
                    }
                }
            }
            super.visitTypeInsn(opcode, type);
        }

        private static Class<?> getClass(String desc) {
            try {
                return Class.forName(desc.replace('/', '.'));
            }
            catch (ClassNotFoundException ex) {
                throw new RuntimeException(ex.toString());
            }
        }
    }
}
```

### 进行转换

需要注意的地方是，在使用`AnalyzerAdapter`类时，要使用`ClassReader.EXPAND_FRAMES`选项。

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

public class HelloWorldTransformCore {
    public static void main(String[] args) {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes1 = FileUtils.readBytes(filepath);
        if (bytes1 == null) {
            throw new RuntimeException("bytes1 is null");
        }

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        //（2）构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        //（3）串连ClassVisitor
        int api = Opcodes.ASM9;
        ClassVisitor cv = new RemoveUnusedCastVisitor(api, cw);
        
        //（4）结合ClassReader和ClassVisitor
        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.EXPAND_FRAMES;
        cr.accept(cv, parsingOptions);

        //（5）生成byte[]
        byte[] bytes2 = cw.toByteArray();

        FileUtils.writeBytes(filepath, bytes2);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，移除`checkcast`指令，从本质上来说，就是判断checkcast带有的“预期类型”和operand stack上栈顶的“实际类型”是否兼容。
- 第二点，虽然使用的分别是Tree API和Core API的内容来进行实现，但两者的本质是一样的逻辑。
