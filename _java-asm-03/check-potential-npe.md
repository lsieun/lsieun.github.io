---
title:  "示例：检测潜在的NullPointerException"
sequence: "408"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## 如何检测

```java
public class HelloWorld {
    public void test(String s) {
        System.out.println(s.trim());
    }
}
```

```java
public class HelloWorld {
    public void test(String s) {
        if (s == null) { // 或者 s != null
            System.out.println("String is null");
        }
        // Method invocation 'trim' may produce 'NullPointerException'
        System.out.println(s.trim());
    }
}
```

Nullness kinds

- not-null
- unknown
- nullable
- null

```java
public class HelloWorld {
    public void test(String s) {
        // State: s:nullness = unknown
        System.out.println(s.trim());
    }
}
```

```java
public class HelloWorld {
    public void test(String s) {
        // State: s:nullness = unknown
        if (s == null) {
            // State: s:nullness = null
            System.out.println("String is null");
        }
        else {
            // State: s:nullness = not-null
        }

        // State#1: s:nullness = not-null
        // State#2: s:nullness = null
        // Merged state: s:nullness = nullable
        System.out.println(s.trim());
    }
}
```



我们生活当中，经常会听到有人说“薛定谔的猫”：比喻一件事，如果你不去做，它就可能有两个结果；而一旦你去做了，最后结果就只能有一个。也就是说，**你的参与直接干预了结果**。



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
    public final static BasicValue NULL_VALUE = new BasicValue(null);
    public final static BasicValue MAYBE_NULL_VALUE = new BasicValue(null);

    public IsNullInterpreter(int api) {
        super(api);
    }

    @Override
    public BasicValue newOperation(AbstractInsnNode insn) throws AnalyzerException {
        if (insn.getOpcode() == ACONST_NULL) {
            return NULL_VALUE;
        }
        return super.newOperation(insn);
    }

    @Override
    public BasicValue merge(BasicValue value1, BasicValue value2) {
        if (isRef(value1) && isRef(value2) && value1 != value2) {
            return MAYBE_NULL_VALUE;
        }
        return super.merge(value1, value2);
    }

    private boolean isRef(Value v) {
        return v == BasicValue.REFERENCE_VALUE || v == NULL_VALUE || v == MAYBE_NULL_VALUE;
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
                if (v == IsNullInterpreter.NULL_VALUE || v == IsNullInterpreter.MAYBE_NULL_VALUE) {
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

