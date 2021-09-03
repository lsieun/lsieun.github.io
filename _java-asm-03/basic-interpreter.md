---
title:  "BasicInterpreter"
sequence: "406"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

- `Value` --> `BasicValue`
- `Interpreter` --> `BasicInterpreter`

## BasicInterpreter

### class info

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
}
```

### fields

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
}
```

### constructors

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
}
```

### methods

```java
public class BasicInterpreter extends Interpreter<BasicValue> implements Opcodes {
}
```

The `BasicInterpreter` class is one of the predefined subclass of the `Interpreter` abstract class.
It simulates the effect of bytecode instructions by using seven sets of values, defined in the `BasicValue` class:

- `UNINITIALIZED_VALUE` means "all possible values".
- `INT_VALUE` means "all int, short, byte, boolean or char values".
- `FLOAT_VALUE` means "all float values".
- `LONG_VALUE` means "all long values".
- `DOUBLE_VALUE` means "all double values".
- `REFERENCE_VALUE` means "all object and array values".
- `RETURNADDRESS_VALUE` is used for subroutines.

This interpreter is not very useful in itself,
but it can be used as an "empty" `Interpreter` implementation in order to construct an `Analyzer`.
This analyzer can then be used to detect unreachable code in a method.

Indeed, even by following both branches in jumps instructions,
it is not possible to reach code that cannot be reached from the first instruction.
The consequence is that, after an analysis, and whatever the `Interpreter` implementation,
the computed frames – returned by the `Analyzer.getFrames` method – are null for instructions that cannot be reached.
This property can be used to implement a `RemoveDeadCodeAdapter` class very easily
(there are more efficient ways, but they require writing more code):

## 示例一：移除无用代码

### 编码实现

```java
import lsieun.asm.tree.MethodTransformer;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.LabelNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

public class MethodRemoveDeadCodeNode extends ClassNode {
    public MethodRemoveDeadCodeNode(int api, ClassVisitor cv) {
        super(api);
        this.cv = cv;
    }

    @Override
    public void visitEnd() {
        // 首先，处理自己的代码逻辑
        MethodTransformer mt = new MethodRemoveDeadCodeConverter(name, null);
        for (MethodNode mn : methods) {
            mt.transform(mn);
        }
        if (cv != null) {
            accept(cv);
        }

        // 其次，调用父类的方法实现
        super.visitEnd();
    }

    private static class MethodRemoveDeadCodeConverter extends MethodTransformer {
        private final String owner;

        public MethodRemoveDeadCodeConverter(String owner, MethodTransformer mt) {
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
        if (bytes1 == null) {
            throw new RuntimeException("bytes1 is null");
        }

        // (1)构建ClassReader
        ClassReader cr = new ClassReader(bytes1);

        // (2)构建ClassWriter
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (3)串连ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new MethodRemoveDeadCodeNode(api, cw);

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

## 示例二：检测潜在的null引用

### 预期目标

```java
public class HelloWorld {
    public void test(boolean flag) {
        Object obj = null;
        if (flag) {
            obj = "10";
        }
        int hash = obj.hashCode();
        System.out.println(hash);
    }
}
```

### 编码实现

```java
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.analysis.AnalyzerException;
import org.objectweb.asm.tree.analysis.BasicInterpreter;
import org.objectweb.asm.tree.analysis.BasicValue;
import org.objectweb.asm.tree.analysis.Value;

public class IsNullInterpreter extends BasicInterpreter {
    public final static BasicValue NULL = new BasicValue(null);
    public final static BasicValue MAYBENULL = new BasicValue(null);

    public IsNullInterpreter(int api) {
        super(api);
    }

    @Override
    public BasicValue newOperation(AbstractInsnNode insn) throws AnalyzerException {
        if (insn.getOpcode() == ACONST_NULL) {
            return NULL;
        }
        return super.newOperation(insn);
    }

    @Override
    public BasicValue merge(BasicValue value1, BasicValue value2) {
        if (isRef(value1) && isRef(value2) && value1 != value2) {
            return MAYBENULL;
        }
        return super.merge(value1, value2);
    }

    private boolean isRef(Value v) {
        return v == BasicValue.REFERENCE_VALUE || v == NULL || v == MAYBENULL;
    }
}
```

```java
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

import java.util.ArrayList;
import java.util.List;

import static org.objectweb.asm.Opcodes.*;

public class NullDereferenceAnalyzer {
    public List<AbstractInsnNode> findNullDereferences(String owner, MethodNode mn) throws AnalyzerException {
        List<AbstractInsnNode> result = new ArrayList<>();
        Analyzer<BasicValue> analyzer = new Analyzer<>(new IsNullInterpreter(ASM9));
        Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);
        AbstractInsnNode[] insns = mn.instructions.toArray();
        for (int i = 0; i < insns.length; i++) {
            AbstractInsnNode insn = insns[i];
            if (frames[i] != null) {
                Value v = getTarget(insn, frames[i]);
                if (v == IsNullInterpreter.NULL || v == IsNullInterpreter.MAYBENULL) {
                    result.add(insn);
                }
            }
        }
        return result;
    }

    private static BasicValue getTarget(AbstractInsnNode insn, Frame<BasicValue> f) {
        int opcode = insn.getOpcode();
        switch (opcode) {
            case GETFIELD:
            case ARRAYLENGTH:
            case MONITORENTER:
            case MONITOREXIT:
                return getStackValue(f, 0);
            case PUTFIELD:
                return getStackValue(f, 1);
            case INVOKEVIRTUAL:
            case INVOKESPECIAL:
            case INVOKEINTERFACE:
                String desc = ((MethodInsnNode) insn).desc;
                return getStackValue(f, Type.getArgumentTypes(desc).length);

        }
        return null;
    }

    private static BasicValue getStackValue(Frame<BasicValue> f, int index) {
        int top = f.getStackSize() - 1;
        return index <= top ? f.getStack(top - index) : null;
    }
}
```

### 进行分析

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.*;

import java.util.List;

public class HelloWorldAnalysisTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);
        if (bytes == null) {
            throw new RuntimeException("bytes is null");
        }

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode();

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）进行分析
        List<MethodNode> methods = cn.methods;
        NullDereferenceAnalyzer analyzer = new NullDereferenceAnalyzer();
        for (MethodNode mn : methods) {
            List<AbstractInsnNode> insnList = analyzer.findNullDereferences(cn.name, mn);
            if (insnList != null && insnList.size() > 0) {
                String line = String.format("Method: %s:%s", mn.name, mn.desc);
                System.out.println(line);
                for (AbstractInsnNode insnNode : insnList) {
                    if (insnNode instanceof MethodInsnNode) {
                        MethodInsnNode node = (MethodInsnNode) insnNode;
                        String item = String.format("    %s.%s:%s", node.owner, node.name, node.desc);
                        System.out.println(item);
                    }
                }
                System.out.println("=================================");
            }

        }
    }
}
```

运行结果：

```text
Method: test:(Z)V
    java/lang/Object.hashCode:()I
=================================
```
