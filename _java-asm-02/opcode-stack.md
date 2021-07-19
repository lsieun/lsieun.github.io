---
title:  "opcode: stack (9/194/205)"
sequence: "210"
---

## 概览

从Instruction的角度来说，与stack相关的opcode有9个，内容如下：

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|
| 87     | pop             | 90     | dup_x1          | 93     | dup2_x1         |
| 88     | pop2            | 91     | dup_x2          | 94     | dup2_x2         |
| 89     | dup             | 92     | dup2            | 95     | swap            |

从ASM的角度来说，这些opcode与`MethodVisitor.visitXxxInsn()`方法对应关系如下：

- `MethodVisitor.visitInsn()`:
    - `pop`, `pop2`
    - `dup`, `dup_x1`, `dup_x2`
    - `dup2`, `dup2_x1`, `dup2_x2`
    - `swap`

## pop

### pop

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Math.max(3, 4);
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_3
       1: iconst_4
       2: invokestatic  #2                  // Method java/lang/Math.max:(II)I
       5: pop
       6: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_3);
methodVisitor.visitInsn(ICONST_4);
methodVisitor.visitMethodInsn(INVOKESTATIC, "java/lang/Math", "max", "(II)I", false);
methodVisitor.visitInsn(POP);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [int, int]
[sample/HelloWorld] [int]
[sample/HelloWorld] []
[] []
```

从JVM规范的角度来看，`pop`指令对应的Operand Stack的变化如下：

```text
..., value →

...
```

Pop the top `value` from the operand stack. The `pop` instruction must not be used unless `value` is a value of a category 1 computational type.

### pop2

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        Math.max(3L, 4L);
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: ldc2_w        #2                  // long 3l
       3: ldc2_w        #4                  // long 4l
       6: invokestatic  #6                  // Method java/lang/Math.max:(JJ)J
       9: pop2
      10: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(new Long(3L));
methodVisitor.visitLdcInsn(new Long(4L));
methodVisitor.visitMethodInsn(INVOKESTATIC, "java/lang/Math", "max", "(JJ)J", false);
methodVisitor.visitInsn(POP2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(4, 1);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [long, top]
[sample/HelloWorld] [long, top, long, top]
[sample/HelloWorld] [long, top]
[sample/HelloWorld] []
[] []
```

从JVM规范的角度来看，`pop2`指令对应的Operand Stack的变化如下：

Form 1:

```text
..., value2, value1 →

...
```

where each of `value1` and `value2` is a value of a category 1 computational type.

Form 2:

```text
..., value →

...
```

where `value` is a value of a category 2 computational type.

## dup

### dup

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        int a;
        int b;
        b = a = 2;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: iconst_2
       1: dup
       2: istore_1
       3: istore_2
       4: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitInsn(ICONST_2);
methodVisitor.visitInsn(DUP);
methodVisitor.visitVarInsn(ISTORE, 1);
methodVisitor.visitVarInsn(ISTORE, 2);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 3);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [int]
[sample/HelloWorld] [int, int]
[sample/HelloWorld, int] [int]
[sample/HelloWorld, int, int] []
[] []
```

从JVM规范的角度来看，`dup`指令对应的Operand Stack的变化如下：

```text
..., value →

..., value, value
```

Duplicate the top value on the operand stack and push the duplicated value onto the operand stack.

The `dup` instruction must not be used unless `value` is a value of a category 1 computational type.

### dup_x1

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    private int num = 0;

    public static int test(HelloWorld instance, int val) {
        return instance.num = val;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  private int num;
...

  public static int test(sample.HelloWorld, int);
    Code:
       0: aload_0
       1: iload_1
       2: dup_x1
       3: putfield      #2                  // Field num:I
       6: ireturn
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitInsn(DUP_X1);
methodVisitor.visitFieldInsn(PUTFIELD, "sample/HelloWorld", "num", "I");
methodVisitor.visitInsn(IRETURN);
methodVisitor.visitMaxs(3, 2);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld, int] []
[sample/HelloWorld, int] [sample/HelloWorld]
[sample/HelloWorld, int] [sample/HelloWorld, int]
[sample/HelloWorld, int] [int, sample/HelloWorld, int]
[sample/HelloWorld, int] [int]
[] []
```

从JVM规范的角度来看，`dup_x1`指令对应的Operand Stack的变化如下：

```text
..., value2, value1 →

..., value1, value2, value1
```

Duplicate the top value on the operand stack and insert the duplicated `value` two values down in the operand stack.

The `dup_x1` instruction must not be used unless both `value1` and `value2` are values of a category 1 computational type.

### dup_x2

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public static int test(int[] array, int i, int value) {
        return array[i] = value;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public static int test(int[], int, int);
    Code:
       0: aload_0
       1: iload_1
       2: iload_2
       3: dup_x2
       4: iastore
       5: ireturn
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(ILOAD, 2);
methodVisitor.visitInsn(DUP_X2);
methodVisitor.visitInsn(IASTORE);
methodVisitor.visitInsn(IRETURN);
methodVisitor.visitMaxs(4, 3);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[[I, int, int] []
[[I, int, int] [[I]
[[I, int, int] [[I, int]
[[I, int, int] [[I, int, int]
[[I, int, int] [int, [I, int, int]
[[I, int, int] [int]
[] []
```

从JVM规范的角度来看，`dup_x2`指令对应的Operand Stack的变化如下：

Form 1:

```text
..., value3, value2, value1 →

..., value1, value3, value2, value1
```

where `value1`, `value2`, and `value3` are all values of a category 1 computational type.

Form 2:

```text
..., value2, value1 →

..., value1, value2, value1
```

where `value1` is a value of a category 1 computational type and `value2` is a value of a category 2 computational type.

## dup2

### dup2

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        long a;
        long b;
        b = a = 2;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: ldc2_w        #2                  // long 2l
       3: dup2
       4: lstore_1
       5: lstore_3
       6: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitLdcInsn(new Long(2L));
methodVisitor.visitInsn(DUP2);
methodVisitor.visitVarInsn(LSTORE, 1);
methodVisitor.visitVarInsn(LSTORE, 3);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(4, 5);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [long, top]
[sample/HelloWorld] [long, top, long, top]
[sample/HelloWorld, long, top] [long, top]
[sample/HelloWorld, long, top, long, top] []
[] []
```

从JVM规范的角度来看，`dup2`指令对应的Operand Stack的变化如下：

Form 1:

```text
..., value2, value1 →

..., value2, value1, value2, value1
```

where both `value1` and `value2` are values of a category 1 computational type.

Form 2:

```text
..., value →

..., value, value
```

where `value` is a value of a category 2 computational type.

### dup2_x1

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    private long num = 0;

    public static long test(HelloWorld instance, long val) {
        return instance.num = val;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  private long num;
...

  public static long test(sample.HelloWorld, long);
    Code:
       0: aload_0
       1: lload_1
       2: dup2_x1
       3: putfield      #2                  // Field num:J
       6: lreturn
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitVarInsn(LLOAD, 1);
methodVisitor.visitInsn(DUP2_X1);
methodVisitor.visitFieldInsn(PUTFIELD, "sample/HelloWorld", "num", "J");
methodVisitor.visitInsn(LRETURN);
methodVisitor.visitMaxs(5, 3);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld, long, top] []
[sample/HelloWorld, long, top] [sample/HelloWorld]
[sample/HelloWorld, long, top] [sample/HelloWorld, long, top]
[sample/HelloWorld, long, top] [long, top, sample/HelloWorld, long, top]
[sample/HelloWorld, long, top] [long, top]
[] []
```

从JVM规范的角度来看，`dup2_x1`指令对应的Operand Stack的变化如下：

Form 1:

```text
..., value3, value2, value1 →

..., value2, value1, value3, value2, value1
```

where `value1`, `value2`, and `value3` are all values of a category 1 computational type.

Form 2:

```text
..., value2, value1 →

..., value1, value2, value1
```

where `value1` is a value of a category 2 computational type and `value2` is a value of a category 1 computational type.

### dup2_x2

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public static long test(long[] array, int i, long value) {
        return array[i] = value;
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public static long test(long[], int, long);
    Code:
       0: aload_0
       1: iload_1
       2: lload_2
       3: dup2_x2
       4: lastore
       5: lreturn
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitVarInsn(ALOAD, 0);
methodVisitor.visitVarInsn(ILOAD, 1);
methodVisitor.visitVarInsn(LLOAD, 2);
methodVisitor.visitInsn(DUP2_X2);
methodVisitor.visitInsn(LASTORE);
methodVisitor.visitInsn(LRETURN);
methodVisitor.visitMaxs(6, 4);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[[J, int, long, top] []
[[J, int, long, top] [[J]
[[J, int, long, top] [[J, int]
[[J, int, long, top] [[J, int, long, top]
[[J, int, long, top] [long, top, [J, int, long, top]
[[J, int, long, top] [long, top]
[] []
```

从JVM规范的角度来看，`dup2_x2`指令对应的Operand Stack的变化如下：

Form 1:

```text
..., value4, value3, value2, value1 →

..., value2, value1, value4, value3, value2, value1
```

where `value1`, `value2`, `value3`, and `value4` are all values of a category 1 computational type.

Form 2:

```text
..., value3, value2, value1 →

..., value1, value3, value2, value1
```

where `value1` is a value of a category 2 computational type and `value2` and `value3` are both values of a category 1 computational type.

Form 3:

```text
..., value3, value2, value1 →

..., value2, value1, value3, value2, value1
```

where `value1` and `value2` are both values of a category 1 computational type and `value3` is a value of a category 2 computational type.

Form 4:

```text
..., value2, value1 →

..., value1, value2, value1
```

where `value1` and `value2` are both values of a category 2 computational type.

## swap

从Java语言的视角，有一个`HelloWorld`类，代码如下：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello ASM");
    }
}
```

从Instruction的视角来看，方法体对应的内容如下：

```text
$ javap -c -p sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #3                  // String Hello ASM
       5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```

从ASM的视角来看，方法体对应的内容如下：

```text
methodVisitor.visitCode();
methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
methodVisitor.visitLdcInsn("Hello ASM");
methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
methodVisitor.visitInsn(RETURN);
methodVisitor.visitMaxs(2, 1);
methodVisitor.visitEnd();
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [java/io/PrintStream]
[sample/HelloWorld] [java/io/PrintStream, java/lang/String]
[sample/HelloWorld] []
[] []
```

为了使用`swap`指令，我们编写如下ASM代码：

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
            mv2.visitLdcInsn("Hello ASM");
            mv2.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv2.visitInsn(SWAP);
            mv2.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            mv2.visitInsn(RETURN);
            mv2.visitMaxs(2, 1);
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
       0: ldc           #11                 // String Hello ASM
       2: getstatic     #17                 // Field java/lang/System.out:Ljava/io/PrintStream;
       5: swap
       6: invokevirtual #23                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       9: return
}
```

从Frame的视角来看，local variable和operand stack的变化：

```text
[sample/HelloWorld] []
[sample/HelloWorld] [java/lang/String]
[sample/HelloWorld] [java/lang/String, java/io/PrintStream]
[sample/HelloWorld] [java/io/PrintStream, java/lang/String]
[sample/HelloWorld] []
[] []
```

从JVM规范的角度来看，`swap`指令对应的Operand Stack的变化如下：

```text
..., value2, value1 →

..., value1, value2
```

Swap the top two values on the operand stack.

The `swap` instruction must not be used unless `value1` and `value2` are both values of a category 1 computational type.
