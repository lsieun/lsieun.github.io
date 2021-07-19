---
title:  "opcode: unused (7/205/205)"
sequence: "214"
---

## 概览

从Instruction的角度来说，余下的opcode有7个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 0      | nop             |        |                 |        |                 |        |                 |

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 168    | jsr             | 169    | ret             | 201    | jsr_w           |        |                 |

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 202    | breakpoint      |        |                 | 254    | impdep1         | 255    | impdep2         |

从ASM的角度来说，这些opcode与`MethodVisitor.visitXxxInsn()`方法对应关系如下：

- `MethodVisitor.visitInsn()`: `nop`
- `MethodVisitor.visitJumpInsn()`: `jsr`, `jsr_w`
- `MethodVisitor.visitVarInsn()`: `ret`

## nop

Do nothing

使用ASM编写一段包含`nop`指向的代码如下：

```java
import lsieun.utils.FileUtils;
import org.objectweb.asm.*;

import static org.objectweb.asm.Opcodes.*;

public class HelloWorldGenerateCore {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);

        // (1) 生成byte[]内容
        byte[] bytes = dump();

        // (2) 保存byte[]到文件
        FileUtils.writeBytes(filepath, bytes);
    }

    public static byte[] dump() throws Exception {
        // (1) 创建ClassWriter对象
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);

        // (2) 调用visitXxx()方法
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "sample/HelloWorld",
                null, "java/lang/Object", null);

        {
            MethodVisitor mv1 = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            mv1.visitCode();
            mv1.visitVarInsn(ALOAD, 0);
            mv1.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            mv1.visitInsn(RETURN);
            mv1.visitMaxs(1, 1);
            mv1.visitEnd();
        }

        {
            MethodVisitor mv2 = cw.visitMethod(ACC_PUBLIC, "test", "()V", null, null);
            mv2.visitCode();
            mv2.visitInsn(NOP);
            mv2.visitInsn(NOP);
            mv2.visitInsn(NOP);
            mv2.visitInsn(NOP);
            mv2.visitInsn(NOP);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(0, 1);
            mv2.visitEnd();
        }
        cw.visitEnd();

        // (3) 调用toByteArray()方法
        return cw.toByteArray();
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: nop
       1: nop
       2: nop
       3: nop
       4: nop
       5: return
}
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] []
[sample/HelloWorld] []
[sample/HelloWorld] []
[sample/HelloWorld] []
[sample/HelloWorld] []
[] []
```

从JVM规范的角度来看，`nop`指令对应的Operand Stack的变化如下：

```text
No change
```

## Deprecated Opcodes

If the class file version number is 51.0(Java 7) or above, then neither the `jsr` opcode or the `jsr_w` opcode may appear in the `code` array.

- jsr
- jsr_w
- ret

```text
Code_attribute {
    u2 attribute_name_index;
    u4 attribute_length;
    u2 max_stack;
    u2 max_locals;
    u4 code_length;
    u1 code[code_length]; // code array
    u2 exception_table_length;
    {   u2 start_pc;
        u2 end_pc;
        u2 handler_pc;
        u2 catch_type;
    } exception_table[exception_table_length];
    u2 attributes_count;
    attribute_info attributes[attributes_count];
}
```

## Reserved Opcodes

Three opcodes are reserved for internal use by a Java Virtual Machine implementation. If the instruction set of the Java Virtual Machine is extended in the future, these reserved opcodes are guaranteed not to be used.

Two of the reserved opcodes, numbers `254` (`0xfe`) and `255` (`0xff`), have the mnemonics `impdep1` and `impdep2`, respectively. These instructions are intended to provide "back doors" or traps to implementation-specific functionality implemented in software and hardware, respectively. The third reserved opcode, number `202` (`0xca`), has the mnemonic `breakpoint` and is intended to be used by debuggers to implement breakpoints.

Although these opcodes have been reserved, they may be used only inside a Java Virtual Machine implementation. They cannot appear in valid class files.
