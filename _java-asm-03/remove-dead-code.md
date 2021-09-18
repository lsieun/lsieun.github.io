---
title:  "示例：移除Dead Code"
sequence: "405"
---

## 如何移除Dead Code

This `BasicInterpreter` is not very useful in itself,
but it can be used as an "empty" `Interpreter` implementation in order to construct an `Analyzer`.
This analyzer can then be used to detect unreachable code in a method.

Indeed, even by following both branches in jumps instructions,
it is not possible to reach code that cannot be reached from the first instruction.
The consequence is that, after an analysis, and whatever the `Interpreter` implementation,
the computed frames – returned by the `Analyzer.getFrames` method - are `null` for instructions that cannot be reached.

那么，为什么可以移除dead code呢？

- 其实，`BasicInterpreter`类本身并没有太多的作用，因为所有的引用类型都使用`BasicValue.REFERENCE_VALUE`来表示，类型非常单一，没有太多的操作空间。
- 相反的，`Analyzer`类才是起到主要作用的类，`Frame<V>[] frames = (Frame<V>[]) new Frame<?>[insnListSize];`，那么默认情况下，`frames`里所有元素都是`null`值。如果某一条instruction可以执行到，那么就会设置对应的`frames`当中的值，就不再为`null`了。反过来说，如果`frames`当中的某一个元素为`null`，那么也就表示对应的instruction就是dead code。

## 代码示例

### 预期目标

在之前的Tree Based Class Transformation示例当中，有一个示例是“优化跳转”，经过优化之后，有一些instruction就成为dead code。

我们的预期目标就是移除那些成为dead code的instruction。

### 编码实现

```java
import lsieun.asm.tree.transformer.MethodTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.LabelNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

public class RemoveDeadCodeNode extends ClassNode {
    public RemoveDeadCodeNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        MethodTransformer mt = new MethodRemoveDeadCodeTransformer(name, null);
        for (MethodNode mn : methods) {
            mt.transform(mn);
        }

        // 其次，调用父类的方法实现
        super.visitEnd();

        // 最后，向后续ClassVisitor传递
        if (cv != null) {
            accept(cv);
        }
    }

    private static class MethodRemoveDeadCodeTransformer extends MethodTransformer {
        private final String owner;

        public MethodRemoveDeadCodeTransformer(String owner, MethodTransformer mt) {
            super(mt);
            this.owner = owner;
        }

        @Override
        public void transform(MethodNode mn) {
            // 首先，处理自己的代码逻辑
            Analyzer<BasicValue> analyzer = new Analyzer<>(new BasicInterpreter());
            try {
                analyzer.analyze(owner, mn);
                Frame<BasicValue>[] frames = analyzer.getFrames();
                AbstractInsnNode[] insnNodes = mn.instructions.toArray();
                for (int i = 0; i < frames.length; i++) {
                    if (frames[i] == null && !(insnNodes[i] instanceof LabelNode)) {
                        mn.instructions.remove(insnNodes[i]);
                    }
                }
            }
            catch (AnalyzerException ex) {
                ex.printStackTrace();
            }

            // 其次，调用父类的方法实现
            super.transform(mn);
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
        ClassNode cn = new RemoveDeadCodeNode(api, cw);

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

```text
$ javap -c sample.HelloWorld
public class sample.HelloWorld {
...
  public void test(int);
    Code:
       0: goto          3
       3: getstatic     #16                 // Field java/lang/System.out:Ljava/io/PrintStream;
       6: iload_1
       7: goto          10
      10: ifne          18
      13: ldc           #18                 // String val is 0
      15: goto          20
      18: ldc           #20                 // String val is not 0
      20: invokevirtual #26                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      23: return
}
```
